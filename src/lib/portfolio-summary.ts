import { parseNumber, readCsvFile, readJsonFile, writeJsonFile } from "./file-utils";
import type {
  HoldingRow,
  PortfolioAsset,
  PortfolioBucket,
  PortfolioLatest,
  PortfolioTarget,
} from "./types";

const axes = ["geography", "theme", "role"] as const;

export async function rebuildPortfolioSummary() {
  const [assets, targets, buckets, holdings] = await Promise.all([
    readJsonFile<PortfolioAsset[]>("config/portfolio_assets.json"),
    readJsonFile<PortfolioTarget[]>("config/portfolio_targets.json"),
    readJsonFile<PortfolioBucket[]>("config/portfolio_buckets.json"),
    readCsvFile("raw/portfolio_holdings.csv") as Promise<HoldingRow[]>,
  ]);

  const activeAssets = assets.filter((asset) => asset.isActive !== false);
  const assetsById = new Map(activeAssets.map((asset) => [String(asset.assetId), asset]));
  const latestHoldings = getLatestHoldings(holdings, assetsById);
  const totalValueKrw = [...latestHoldings.values()].reduce(
    (sum, holding) => sum + safeMarketValue(holding.market_value_krw),
    0,
  );
  const bucketsById = new Map(buckets.map((bucket) => [bucket.bucketId, bucket]));
  const targetsByAxis = groupTargetsByAxis(targets);
  const currentValueByAxisBucket = aggregateByAxisBucket(latestHoldings, assetsById);
  const axisSummaries = axes.map((axisId) => {
    const axisTargets = targetsByAxis.get(axisId) ?? [];

    return {
      axisId,
      axisName: axisLabel(axisId),
      items: axisTargets.map((target) => {
        const bucket = bucketsById.get(target.bucketId);
        const currentValue = currentValueByAxisBucket.get(axisKey(axisId, target.bucketId)) ?? 0;
        const currentWeightPct = totalValueKrw > 0 ? (currentValue / totalValueKrw) * 100 : 0;
        const deviationPct = currentWeightPct - target.targetWeightPct;

        return {
          bucketId: target.bucketId,
          currentWeightPct: roundPct(currentWeightPct),
          deviationPct: roundPct(deviationPct),
          name: bucket?.name ?? target.bucketId,
          status:
            Math.abs(deviationPct) >= target.rebalanceThresholdPct ? "warning" : "ok",
          targetWeightPct: target.targetWeightPct,
          thresholdPct: target.rebalanceThresholdPct,
        };
      }),
    };
  });
  const allItems = axisSummaries.flatMap((axis) =>
    axis.items.map((item) => ({ ...item, axisId: axis.axisId })),
  );
  const topOverweight =
    allItems.toSorted((a, b) => b.deviationPct - a.deviationPct)[0] ?? emptyDeviation();
  const topUnderweight =
    allItems.toSorted((a, b) => a.deviationPct - b.deviationPct)[0] ?? emptyDeviation();
  const unclassifiedAssetCount = activeAssets.filter((asset) =>
    axes.some((axisId) => !asset.classifications?.[axisId]),
  ).length;
  const hasWarning = allItems.some((item) => item.status === "warning");

  const summary: PortfolioLatest = {
    axisSummaries,
    profitLossKrw: 0,
    status: hasWarning || unclassifiedAssetCount > 0 ? "watch" : "ok",
    topOverweight: {
      axisId: topOverweight.axisId,
      bucketId: topOverweight.bucketId,
      deviationPct: topOverweight.deviationPct,
      name: topOverweight.name,
    },
    topUnderweight: {
      axisId: topUnderweight.axisId,
      bucketId: topUnderweight.bucketId,
      deviationPct: topUnderweight.deviationPct,
      name: topUnderweight.name,
    },
    totalValueKrw: Math.round(totalValueKrw),
    unclassifiedAssetCount,
    updatedAt: new Date().toISOString(),
    weeklyChangePct: 0,
  };

  await writeJsonFile("current/portfolio_latest.json", summary);
  return summary;
}

function getLatestHoldings(
  holdings: HoldingRow[],
  assetsById: Map<string, PortfolioAsset>,
) {
  const latest = new Map<string, HoldingRow>();

  for (const holding of holdings) {
    const assetId = String(holding.asset_id);

    if (!assetsById.has(assetId)) {
      continue;
    }

    const previous = latest.get(assetId);

    if (!previous || new Date(holding.timestamp) >= new Date(previous.timestamp)) {
      latest.set(assetId, holding);
    }
  }

  return latest;
}

function aggregateByAxisBucket(
  latestHoldings: Map<string, HoldingRow>,
  assetsById: Map<string, PortfolioAsset>,
) {
  const values = new Map<string, number>();

  for (const [assetId, holding] of latestHoldings) {
    const asset = assetsById.get(assetId);
    const marketValue = safeMarketValue(holding.market_value_krw);

    if (!asset) {
      continue;
    }

    for (const axisId of axes) {
      const bucketId = asset.classifications?.[axisId];

      if (!bucketId) {
        continue;
      }

      const key = axisKey(axisId, bucketId);
      values.set(key, (values.get(key) ?? 0) + marketValue);
    }
  }

  return values;
}

function groupTargetsByAxis(targets: PortfolioTarget[]) {
  return targets.reduce<Map<string, PortfolioTarget[]>>((acc, target) => {
    const current = acc.get(target.axisId) ?? [];
    current.push(target);
    acc.set(target.axisId, current);
    return acc;
  }, new Map());
}

function safeMarketValue(value: string) {
  const parsed = parseNumber(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function axisKey(axisId: string, bucketId: string) {
  return `${axisId}:${bucketId}`;
}

function roundPct(value: number) {
  return Math.round(value * 10) / 10;
}

function axisLabel(axisId: string) {
  const labels: Record<string, string> = {
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
