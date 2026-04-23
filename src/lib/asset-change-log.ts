import { appendCsvRow, ensureCsvFile } from "./file-utils";
import type { PortfolioAsset } from "./types";

const assetChangePath = "raw/portfolio_asset_changes.csv";
const header = [
  "timestamp",
  "asset_id",
  "change_type",
  "field_name",
  "old_value",
  "new_value",
  "note",
];

export async function logAssetCreate(asset: PortfolioAsset, note = "") {
  const timestamp = new Date().toISOString();
  const rows = [
    createRow(timestamp, String(asset.assetId), "create", "name", "", asset.name, note),
    createRow(timestamp, String(asset.assetId), "create", "ticker", "", asset.ticker, note),
    createRow(timestamp, String(asset.assetId), "create", "assetType", "", asset.assetType, note),
    createRow(timestamp, String(asset.assetId), "create", "currency", "", asset.currency, note),
    createRow(
      timestamp,
      String(asset.assetId),
      "create",
      "geography",
      "",
      asset.classifications.geography ?? "",
      note,
    ),
    createRow(
      timestamp,
      String(asset.assetId),
      "create",
      "theme",
      "",
      asset.classifications.theme ?? "",
      note,
    ),
    createRow(
      timestamp,
      String(asset.assetId),
      "create",
      "role",
      "",
      asset.classifications.role ?? "",
      note,
    ),
    createRow(
      timestamp,
      String(asset.assetId),
      asset.isActive ? "create" : "deactivate",
      "isActive",
      "",
      String(asset.isActive),
      note,
    ),
  ];

  await appendChangeRows(rows);
}

export async function logAssetDifferences({
  after,
  before,
  note = "",
}: {
  after: PortfolioAsset;
  before: PortfolioAsset;
  note?: string;
}) {
  const timestamp = new Date().toISOString();
  const rows: string[][] = [];

  pushIfChanged(rows, timestamp, before, after, "name", before.name, after.name, "update", note);
  pushIfChanged(
    rows,
    timestamp,
    before,
    after,
    "ticker",
    before.ticker,
    after.ticker,
    "update",
    note,
  );
  pushIfChanged(
    rows,
    timestamp,
    before,
    after,
    "assetType",
    before.assetType,
    after.assetType,
    "update",
    note,
  );
  pushIfChanged(
    rows,
    timestamp,
    before,
    after,
    "currency",
    before.currency,
    after.currency,
    "update",
    note,
  );
  pushIfChanged(
    rows,
    timestamp,
    before,
    after,
    "geography",
    before.classifications.geography ?? "",
    after.classifications.geography ?? "",
    "update",
    note,
  );
  pushIfChanged(
    rows,
    timestamp,
    before,
    after,
    "theme",
    before.classifications.theme ?? "",
    after.classifications.theme ?? "",
    "update",
    note,
  );
  pushIfChanged(
    rows,
    timestamp,
    before,
    after,
    "role",
    before.classifications.role ?? "",
    after.classifications.role ?? "",
    "update",
    note,
  );

  if (before.isActive !== after.isActive) {
    rows.push(
      createRow(
        timestamp,
        String(after.assetId),
        after.isActive ? "reactivate" : "deactivate",
        "isActive",
        String(before.isActive),
        String(after.isActive),
        note,
      ),
    );
  }

  if (rows.length > 0) {
    await appendChangeRows(rows);
  }
}

function pushIfChanged(
  rows: string[][],
  timestamp: string,
  before: PortfolioAsset,
  after: PortfolioAsset,
  fieldName: string,
  oldValue: string,
  newValue: string,
  changeType: string,
  note: string,
) {
  if (oldValue !== newValue) {
    rows.push(
      createRow(timestamp, String(after.assetId), changeType, fieldName, oldValue, newValue, note),
    );
  }
}

function createRow(
  timestamp: string,
  assetId: string,
  changeType: string,
  fieldName: string,
  oldValue: string,
  newValue: string,
  note: string,
) {
  return [timestamp, assetId, changeType, fieldName, oldValue, newValue, note];
}

async function appendChangeRows(rows: string[][]) {
  await ensureCsvFile(assetChangePath, header);

  for (const row of rows) {
    await appendCsvRow(assetChangePath, row);
  }
}
