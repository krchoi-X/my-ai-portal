import { readFile } from "node:fs/promises";
import path from "node:path";
import type {
  HoldingRow,
  LinkItem,
  MacroDefinition,
  MacroLatest,
  MarketSignal,
  PortfolioAsset,
  PortfolioAxis,
  PortfolioBucket,
  PortfolioLatest,
  PortfolioTarget,
} from "./types";

const dataRoot = path.join(process.cwd(), "app-data");

async function readJson<T>(relativePath: string): Promise<T> {
  const file = await readFile(path.join(dataRoot, relativePath), "utf8");
  return JSON.parse(file) as T;
}

export async function readCsv(relativePath: string) {
  const file = await readFile(path.join(dataRoot, relativePath), "utf8");
  const [headerLine, ...lines] = file.trim().split(/\r?\n/);
  const headers = parseCsvLine(headerLine);

  return lines.map((line) => {
    const values = parseCsvLine(line);
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]));
  });
}

function parseCsvLine(line: string) {
  const values: string[] = [];
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

export async function getDashboardData() {
  const [marketSignal, macroLatest, macroDefinitions, portfolioLatest, links] =
    await Promise.all([
      readJson<MarketSignal>("current/market_signal.json"),
      readJson<MacroLatest>("current/macro_latest.json"),
      readJson<MacroDefinition[]>("config/macro_definitions.json"),
      readJson<PortfolioLatest>("current/portfolio_latest.json"),
      readJson<LinkItem[]>("config/links.json"),
    ]);

  return { marketSignal, macroLatest, macroDefinitions, portfolioLatest, links };
}

export async function getInvestingData() {
  const [dashboard, axes, buckets, targets, assets, holdings] = await Promise.all([
    getDashboardData(),
    readJson<PortfolioAxis[]>("config/portfolio_axes.json"),
    readJson<PortfolioBucket[]>("config/portfolio_buckets.json"),
    readJson<PortfolioTarget[]>("config/portfolio_targets.json"),
    readJson<PortfolioAsset[]>("config/portfolio_assets.json"),
    readCsv("raw/portfolio_holdings.csv") as Promise<HoldingRow[]>,
  ]);

  return { ...dashboard, axes, buckets, targets, assets, holdings };
}
