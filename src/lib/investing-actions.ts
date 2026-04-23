"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  appendCsvRow,
  ensureCsvFile,
  parseCsvText,
  parseNumber,
  parseOptionalString,
  parseRequiredNumber,
  parseRequiredString,
  readJsonFile,
  writeJsonFile,
} from "./file-utils";
import { logAssetCreate, logAssetDifferences } from "./asset-change-log";
import { rebuildPortfolioSummary } from "./portfolio-summary";
import type { PortfolioAsset, PortfolioBucket, PortfolioTarget } from "./types";

const targetsPath = "config/portfolio_targets.json";
const assetsPath = "config/portfolio_assets.json";
const holdingsPath = "raw/portfolio_holdings.csv";

export async function saveTargets(formData: FormData) {
  let destination = "/investing/targets?saved=targets";

  try {
    const targets = await readJsonFile<PortfolioTarget[]>(targetsPath);
    const nextTargets = targets.map((target, index) => ({
      ...target,
      rebalanceThresholdPct: parseIndexedNumber(formData, "rebalanceThresholdPct", index),
      targetWeightPct: parseIndexedNumber(formData, "targetWeightPct", index),
    }));

    await writeJsonFile(targetsPath, nextTargets);
    await rebuildPortfolioSummary();
    revalidateInvestingPaths();
    destination = "/investing/targets?saved=rebuild";
  } catch (error) {
    destination = `/investing/targets?error=${encodeURIComponent(getErrorMessage(error))}`;
  }

  redirect(destination);
}

export async function saveAssetAndHolding(formData: FormData) {
  let destination = "/investing/assets/input?saved=asset";

  try {
    const assetId = parseRequiredString(formData, "assetId");
    const name = parseRequiredString(formData, "name");
    const ticker = parseRequiredString(formData, "ticker");
    const assetType = parseRequiredString(formData, "assetType");
    const currency = parseRequiredString(formData, "currency");
    const geography = parseRequiredString(formData, "geography");
    const theme = parseRequiredString(formData, "theme");
    const role = parseRequiredString(formData, "role");
    const quantity = parseRequiredNumber(formData, "quantity");
    const price = parseRequiredNumber(formData, "price");
    const marketValueKrw = parseRequiredNumber(formData, "market_value_krw");
    const note = parseOptionalString(formData, "note");

    await validateBucketSelection({ geography, role, theme });

    const assets = await readJsonFile<PortfolioAsset[]>(assetsPath);
    const exists = assets.some((asset) => String(asset.assetId) === assetId);

    if (!exists) {
      const nextAsset = {
        assetId,
        assetType,
        classifications: {
          geography,
          role,
          theme,
        },
        currency,
        dataSource: {
          mode: "manual",
          provider: null,
        },
        isActive: true,
        name,
        ticker,
      };
      assets.push(nextAsset);

      await writeJsonFile(assetsPath, assets);
      await logAssetCreate(nextAsset);
    }

    await appendHoldingSnapshot({
      assetId,
      note,
      inputType: "manual_entry",
      marketValueKrw,
      price,
      quantity,
      source: "manual",
    });

    await rebuildPortfolioSummary();
    revalidateInvestingPaths();
    destination = `/investing/assets/input?saved=${exists ? "holding_rebuild" : "asset_rebuild"}`;
  } catch (error) {
    destination = `/investing/assets/input?error=${encodeURIComponent(getErrorMessage(error))}`;
  }

  redirect(destination);
}

export async function saveClassifications(formData: FormData) {
  let destination = "/investing/assets/classify?saved=classifications";

  try {
    const [assets, buckets] = await Promise.all([
      readJsonFile<PortfolioAsset[]>(assetsPath),
      readJsonFile<PortfolioBucket[]>("config/portfolio_buckets.json"),
    ]);
    const validBucketsByAxis = buckets.reduce<Record<string, Set<string>>>((acc, bucket) => {
      acc[bucket.axisId] = acc[bucket.axisId] ?? new Set<string>();
      acc[bucket.axisId].add(bucket.bucketId);
      return acc;
    }, {});
    const beforeById = new Map(assets.map((asset) => [String(asset.assetId), asset]));

    const nextAssets = assets.map((asset) => {
      const geography = parseRequiredString(formData, fieldName(asset.assetId, "geography"));
      const theme = parseRequiredString(formData, fieldName(asset.assetId, "theme"));
      const role = parseRequiredString(formData, fieldName(asset.assetId, "role"));

      assertValidBucket(validBucketsByAxis, "geography", geography);
      assertValidBucket(validBucketsByAxis, "theme", theme);
      assertValidBucket(validBucketsByAxis, "role", role);

      return {
        ...asset,
        classifications: {
          ...asset.classifications,
          geography,
          role,
          theme,
        },
      };
    });

    await writeJsonFile(assetsPath, nextAssets);
    for (const nextAsset of nextAssets) {
      const before = beforeById.get(String(nextAsset.assetId));

      if (before) {
        await logAssetDifferences({
          after: nextAsset,
          before,
        });
      }
    }
    await rebuildPortfolioSummary();
    revalidateInvestingPaths();
    destination = "/investing/assets/classify?saved=rebuild";
  } catch (error) {
    destination = `/investing/assets/classify?error=${encodeURIComponent(getErrorMessage(error))}`;
  }

  redirect(destination);
}

export async function rebuildPortfolioSummaryAction() {
  let destination = "/investing?saved=rebuild";

  try {
    await rebuildPortfolioSummary();
    revalidateInvestingPaths();
  } catch (error) {
    destination = `/investing?error=${encodeURIComponent(getErrorMessage(error))}`;
  }

  redirect(destination);
}

export async function saveExistingAssetWithHolding(formData: FormData) {
  let destination = "/investing/assets/input?saved=asset_update_rebuild";

  try {
    const assetId = parseRequiredString(formData, "assetId");
    const actionIntent = parseOptionalString(formData, "actionIntent") || "save";
    const geography = parseRequiredString(formData, "geography");
    const theme = parseRequiredString(formData, "theme");
    const role = parseRequiredString(formData, "role");
    await validateBucketSelection({ geography, role, theme });

    const assets = await readJsonFile<PortfolioAsset[]>(assetsPath);
    let found = false;
    let beforeAsset: PortfolioAsset | null = null;
    let afterAsset: PortfolioAsset | null = null;
    const nextAssets = assets.map((asset) => {
      if (String(asset.assetId) !== assetId) {
        return asset;
      }

      found = true;
      beforeAsset = asset;
      afterAsset = {
        ...asset,
        assetType: parseRequiredString(formData, "assetType"),
        classifications: {
          geography,
          role,
          theme,
        },
        currency: parseRequiredString(formData, "currency"),
        dataSource: asset.dataSource ?? {
          mode: "manual",
          provider: null,
        },
        isActive:
          actionIntent === "deactivate"
            ? false
            : actionIntent === "reactivate"
              ? true
              : formData.get("isActive") === "on",
        name: parseRequiredString(formData, "name"),
        ticker: parseRequiredString(formData, "ticker"),
      };

      return afterAsset;
    });

    if (!found) {
      throw new Error("수정할 자산을 찾을 수 없습니다.");
    }

    await writeJsonFile(assetsPath, nextAssets);
    if (beforeAsset && afterAsset) {
      await logAssetDifferences({
        after: afterAsset,
        before: beforeAsset,
      });
    }
    if (actionIntent !== "deactivate" && actionIntent !== "reactivate") {
      await appendHoldingSnapshot({
        assetId,
        inputType: "manual_entry",
        marketValueKrw: parseRequiredNumber(formData, "market_value_krw"),
        note: parseOptionalString(formData, "note"),
        price: parseRequiredNumber(formData, "price"),
        quantity: parseRequiredNumber(formData, "quantity"),
        source: "manual",
      });
    }
    await rebuildPortfolioSummary();
    revalidateInvestingPaths();
    destination =
      actionIntent === "deactivate"
        ? "/investing/assets/input?saved=deactivated"
        : actionIntent === "reactivate"
          ? "/investing/assets/input?saved=reactivated"
          : "/investing/assets/input?saved=asset_update_rebuild";
  } catch (error) {
    destination = `/investing/assets/input?error=${encodeURIComponent(getErrorMessage(error))}`;
  }

  redirect(destination);
}

export async function importBrokerCsv(formData: FormData) {
  let destination = "/investing/import?saved=import_rebuild";

  try {
    const rawCsv = parseRequiredString(formData, "rawCsv");
    const mappings = {
      assetName: parseRequiredString(formData, "assetNameColumn"),
      marketValue: parseRequiredString(formData, "marketValueColumn"),
      note: parseOptionalString(formData, "noteColumn"),
      price: parseRequiredString(formData, "priceColumn"),
      quantity: parseRequiredString(formData, "quantityColumn"),
      ticker: parseRequiredString(formData, "tickerColumn"),
    };
    const createMissing = formData.get("createMissing") === "on";
    const rows = parseCsvText(rawCsv);

    if (rows.length === 0) {
      throw new Error("가져올 CSV 행이 없습니다.");
    }

    const buckets = await readJsonFile<PortfolioBucket[]>("config/portfolio_buckets.json");
    const validBucketsByAxis = buckets.reduce<Record<string, Set<string>>>((acc, bucket) => {
      acc[bucket.axisId] = acc[bucket.axisId] ?? new Set<string>();
      acc[bucket.axisId].add(bucket.bucketId);
      return acc;
    }, {});
    const assets = await readJsonFile<PortfolioAsset[]>(assetsPath);
    const nextAssets = [...assets];
    const snapshots: Array<{
      assetId: string;
      marketValueKrw: number;
      note: string;
      price: number;
      quantity: number;
    }> = [];

    for (const [index, row] of rows.entries()) {
      const assetName = requiredMappedValue(row, mappings.assetName, index, "자산명");
      const ticker = requiredMappedValue(row, mappings.ticker, index, "티커");
      const quantity = parseMappedNumber(row, mappings.quantity, index, "수량");
      const price = parseMappedNumber(row, mappings.price, index, "가격");
      const marketValueKrw = parseMappedNumber(row, mappings.marketValue, index, "평가금액");
      const note = mappings.note ? String(row[mappings.note] ?? "").trim() : "";
      let asset = findMatchingAsset(nextAssets, ticker, assetName);

      if (!asset) {
        if (!createMissing) {
          throw new Error(`${index + 1}행의 ${ticker || assetName} 자산을 찾을 수 없습니다.`);
        }

        const geography = parseRequiredString(formData, importClassificationName(index, "geography"));
        const theme = parseRequiredString(formData, importClassificationName(index, "theme"));
        const role = parseRequiredString(formData, importClassificationName(index, "role"));
        assertValidBucket(validBucketsByAxis, "geography", geography);
        assertValidBucket(validBucketsByAxis, "theme", theme);
        assertValidBucket(validBucketsByAxis, "role", role);

        asset = {
          assetId: createImportAssetId(nextAssets, ticker || assetName),
          assetType: "stock",
          classifications: {
            geography,
            role,
            theme,
          },
          currency: "KRW",
          dataSource: {
            mode: "manual",
            provider: null,
          },
          isActive: true,
          name: assetName,
          ticker,
        };
        nextAssets.push(asset);
        await logAssetCreate(asset, "broker csv import");
      }

      snapshots.push({
        assetId: String(asset.assetId),
        marketValueKrw,
        note,
        price,
        quantity,
      });
    }

    await writeJsonFile(assetsPath, nextAssets);
    for (const snapshot of snapshots) {
      await appendHoldingSnapshot({
        ...snapshot,
        inputType: "broker_csv_import",
        source: "broker_csv",
      });
    }
    await rebuildPortfolioSummary();
    revalidateInvestingPaths();
  } catch (error) {
    destination = `/investing/import?error=${encodeURIComponent(getErrorMessage(error))}`;
  }

  redirect(destination);
}

function fieldName(assetId: string, axisId: string) {
  return `classification__${assetId}__${axisId}`;
}

function parseIndexedNumber(formData: FormData, key: string, index: number) {
  const value = parseNumber(formData.get(`${key}_${index}`));

  if (!Number.isFinite(value)) {
    throw new Error("목표 비중과 기준값은 숫자로 입력해야 합니다.");
  }

  return value;
}

function requiredMappedValue(
  row: Record<string, string>,
  column: string,
  index: number,
  label: string,
) {
  const value = String(row[column] ?? "").trim();

  if (!value) {
    throw new Error(`${index + 1}행의 ${label} 값이 비어 있습니다.`);
  }

  return value;
}

function parseMappedNumber(
  row: Record<string, string>,
  column: string,
  index: number,
  label: string,
) {
  const value = parseNumber(requiredMappedValue(row, column, index, label));

  if (!Number.isFinite(value)) {
    throw new Error(`${index + 1}행의 ${label} 값은 숫자여야 합니다.`);
  }

  return value;
}

function findMatchingAsset(assets: PortfolioAsset[], ticker: string, assetName: string) {
  const normalizedTicker = ticker.trim().toLowerCase();
  const normalizedName = assetName.trim().toLowerCase();

  return assets.find(
    (asset) =>
      asset.ticker.trim().toLowerCase() === normalizedTicker ||
      asset.name.trim().toLowerCase() === normalizedName,
  );
}

function createImportAssetId(assets: PortfolioAsset[], seed: string) {
  const base =
    seed
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9가-힣]+/g, "_")
      .replace(/^_+|_+$/g, "") || "import_asset";
  const existingIds = new Set(assets.map((asset) => String(asset.assetId)));
  let candidate = base;
  let suffix = 2;

  while (existingIds.has(candidate)) {
    candidate = `${base}_${suffix}`;
    suffix += 1;
  }

  return candidate;
}

function importClassificationName(index: number, axisId: string) {
  return `import_${index}_${axisId}`;
}

async function validateBucketSelection(selection: {
  geography: string;
  theme: string;
  role: string;
}) {
  const buckets = await readJsonFile<PortfolioBucket[]>("config/portfolio_buckets.json");
  const validBucketsByAxis = buckets.reduce<Record<string, Set<string>>>((acc, bucket) => {
    acc[bucket.axisId] = acc[bucket.axisId] ?? new Set<string>();
    acc[bucket.axisId].add(bucket.bucketId);
    return acc;
  }, {});

  assertValidBucket(validBucketsByAxis, "geography", selection.geography);
  assertValidBucket(validBucketsByAxis, "theme", selection.theme);
  assertValidBucket(validBucketsByAxis, "role", selection.role);
}

async function appendHoldingSnapshot({
  assetId,
  inputType,
  marketValueKrw,
  note,
  price,
  quantity,
  source,
}: {
  assetId: string;
  inputType: string;
  marketValueKrw: number;
  note: string;
  price: number;
  quantity: number;
  source: string;
}) {
  await ensureCsvFile(holdingsPath, [
    "timestamp",
    "asset_id",
    "quantity",
    "price",
    "market_value_krw",
    "source",
    "input_type",
    "note",
  ]);
  await appendCsvRow(holdingsPath, [
    new Date().toISOString(),
    assetId,
    quantity,
    price,
    marketValueKrw,
    source,
    inputType,
    note,
  ]);
}

function assertValidBucket(
  validBucketsByAxis: Record<string, Set<string>>,
  axisId: string,
  bucketId: string,
) {
  if (!validBucketsByAxis[axisId]?.has(bucketId)) {
    throw new Error(`${axisId} 분류가 올바르지 않습니다.`);
  }
}

function revalidateInvestingPaths() {
  revalidatePath("/");
  revalidatePath("/investing");
  revalidatePath("/investing/targets");
  revalidatePath("/investing/assets/input");
  revalidatePath("/investing/assets/classify");
  revalidatePath("/investing/import");
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "저장 중 오류가 발생했습니다.";
}
