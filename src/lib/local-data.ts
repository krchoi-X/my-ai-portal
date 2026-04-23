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
import { readCsvFile, readJsonFile } from "./file-utils";

export const readJson = readJsonFile;
export const readCsv = readCsvFile;

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
