export type MarketSignal = {
  status: string;
  label: string;
  message: string;
  updatedAt: string;
  actionHint: string;
};

export type MacroDefinition = {
  indicatorId: string;
  name: string;
  unit: string;
  displayOrder: number;
};

export type MacroLatest = {
  updatedAt: string;
  items: Array<{
    indicatorId: string;
    value: number;
    change1d: number;
    trend7d: "up" | "down" | "flat" | string;
  }>;
};

export type AxisSummaryItem = {
  bucketId: string;
  name: string;
  targetWeightPct: number;
  currentWeightPct: number;
  deviationPct: number;
  thresholdPct: number;
  status: string;
};

export type AxisSummary = {
  axisId: string;
  axisName: string;
  items: AxisSummaryItem[];
};

export type PortfolioLatest = {
  updatedAt: string;
  totalValueKrw: number;
  weeklyChangePct: number;
  profitLossKrw: number;
  status: string;
  unclassifiedAssetCount: number;
  axisSummaries: AxisSummary[];
  topOverweight: {
    axisId: string;
    bucketId: string;
    name: string;
    deviationPct: number;
  };
  topUnderweight: {
    axisId: string;
    bucketId: string;
    name: string;
    deviationPct: number;
  };
};

export type LinkItem = {
  id: string;
  category: string;
  title: string;
  description: string;
  url: string;
};

export type HubCategory = "travel" | "content" | "education" | "health" | "investing";

export type GptLink = {
  id: string;
  category: HubCategory;
  title: string;
  description: string;
  url: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type HubRecord = {
  id: string;
  type: string;
  title: string;
  gptId: string;
  gptName: string;
  gptLink: string;
  createdAt: string;
  updatedAt: string;
  initialPrompt: string;
  summary: string;
  tags: string[];
  status: string;
  memoryCandidate: boolean;
};

export type PortfolioAxis = {
  axisId: string;
  name: string;
  displayOrder: number;
};

export type PortfolioBucket = {
  bucketId: string;
  axisId: string;
  name: string;
  displayOrder: number;
};

export type PortfolioTarget = {
  axisId: string;
  bucketId: string;
  targetWeightPct: number;
  rebalanceThresholdPct: number;
};

export type PortfolioAsset = {
  assetId: string;
  name: string;
  ticker: string;
  assetType: string;
  currency: string;
  classifications: Record<string, string>;
  dataSource: {
    mode: string;
    provider: string | null;
  };
  isActive: boolean;
};

export type HoldingRow = {
  timestamp: string;
  asset_id: string;
  quantity: string;
  price: string;
  market_value_krw: string;
  source: string;
  input_type: string;
  note: string;
};
