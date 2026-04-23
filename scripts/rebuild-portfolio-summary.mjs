import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const dataRoot = path.join(root, "app-data");

const [assets, targets, buckets, holdingsRows] = await Promise.all([
  readJson("config/portfolio_assets.json"),
  readJson("config/portfolio_targets.json"),
  readJson("config/portfolio_buckets.json"),
  readCsv("raw/portfolio_holdings.csv"),
]);

const axes = ["geography", "theme", "role"];
const assetsById = new Map(assets.map((asset) => [String(asset.assetId), asset]));
const latestHoldings = new Map();

for (const holding of holdingsRows) {
  const assetId = String(holding.asset_id);

  if (!assetsById.has(assetId)) {
    continue;
  }

  const previous = latestHoldings.get(assetId);

  if (!previous || new Date(holding.timestamp) >= new Date(previous.timestamp)) {
    latestHoldings.set(assetId, holding);
  }
}

const totalValueKrw = [...latestHoldings.values()].reduce(
  (sum, holding) => sum + safeNumber(holding.market_value_krw),
  0,
);
const bucketsById = new Map(buckets.map((bucket) => [bucket.bucketId, bucket]));
const currentValueByAxisBucket = new Map();

for (const [assetId, holding] of latestHoldings) {
  const asset = assetsById.get(assetId);
  const marketValue = safeNumber(holding.market_value_krw);

  for (const axisId of axes) {
    const bucketId = asset?.classifications?.[axisId];

    if (!bucketId) {
      continue;
    }

    const key = `${axisId}:${bucketId}`;
    currentValueByAxisBucket.set(key, (currentValueByAxisBucket.get(key) ?? 0) + marketValue);
  }
}

const axisSummaries = axes.map((axisId) => ({
  axisId,
  axisName: axisLabel(axisId),
  items: targets
    .filter((target) => target.axisId === axisId)
    .map((target) => {
      const currentValue = currentValueByAxisBucket.get(`${axisId}:${target.bucketId}`) ?? 0;
      const currentWeightPct = totalValueKrw > 0 ? (currentValue / totalValueKrw) * 100 : 0;
      const deviationPct = currentWeightPct - target.targetWeightPct;

      return {
        bucketId: target.bucketId,
        currentWeightPct: roundPct(currentWeightPct),
        deviationPct: roundPct(deviationPct),
        name: bucketsById.get(target.bucketId)?.name ?? target.bucketId,
        status:
          Math.abs(deviationPct) >= target.rebalanceThresholdPct ? "warning" : "ok",
        targetWeightPct: target.targetWeightPct,
        thresholdPct: target.rebalanceThresholdPct,
      };
    }),
}));

const allItems = axisSummaries.flatMap((axis) =>
  axis.items.map((item) => ({ ...item, axisId: axis.axisId })),
);
const topOverweight =
  [...allItems].sort((a, b) => b.deviationPct - a.deviationPct)[0] ?? emptyDeviation();
const topUnderweight =
  [...allItems].sort((a, b) => a.deviationPct - b.deviationPct)[0] ?? emptyDeviation();
const unclassifiedAssetCount = assets.filter((asset) =>
  axes.some((axisId) => !asset.classifications?.[axisId]),
).length;

const summary = {
  updatedAt: new Date().toISOString(),
  totalValueKrw: Math.round(totalValueKrw),
  weeklyChangePct: 0,
  profitLossKrw: 0,
  status:
    allItems.some((item) => item.status === "warning") || unclassifiedAssetCount > 0
      ? "watch"
      : "ok",
  unclassifiedAssetCount,
  axisSummaries,
  topOverweight: {
    axisId: topOverweight.axisId,
    bucketId: topOverweight.bucketId,
    name: topOverweight.name,
    deviationPct: topOverweight.deviationPct,
  },
  topUnderweight: {
    axisId: topUnderweight.axisId,
    bucketId: topUnderweight.bucketId,
    name: topUnderweight.name,
    deviationPct: topUnderweight.deviationPct,
  },
};

await writeFile(
  path.join(dataRoot, "current/portfolio_latest.json"),
  `${JSON.stringify(summary, null, 2)}\n`,
  "utf8",
);

console.log(JSON.stringify(summary, null, 2));

async function readJson(relativePath) {
  const file = await readFile(path.join(dataRoot, relativePath), "utf8");
  return JSON.parse(file);
}

async function readCsv(relativePath) {
  const file = await readFile(path.join(dataRoot, relativePath), "utf8");
  const lines = file.trim().split(/\r?\n/).filter(Boolean);
  const headers = parseCsvLine(lines[0]);

  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]));
  });
}

function parseCsvLine(line) {
  const values = [];
  let current = "";
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"' && quoted && next === '"') {
      current += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      values.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  values.push(current);
  return values;
}

function safeNumber(value) {
  const parsed = Number(String(value ?? "").replaceAll(",", "").trim());
  return Number.isFinite(parsed) ? parsed : 0;
}

function roundPct(value) {
  return Math.round(value * 10) / 10;
}

function axisLabel(axisId) {
  const labels = {
    geography: "지역",
    role: "역할",
    theme: "테마",
  };

  return labels[axisId] ?? axisId;
}

function emptyDeviation() {
  return {
    axisId: "geography",
    bucketId: "",
    deviationPct: 0,
    name: "-",
  };
}
