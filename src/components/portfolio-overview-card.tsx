import { formatKrw, formatPct } from "@/lib/format";
import type { AxisSummary, PortfolioLatest } from "@/lib/types";
import { Card, StatusBadge } from "./ui";

export function PortfolioOverviewCard({ portfolio }: { portfolio: PortfolioLatest }) {
  const geography = portfolio.axisSummaries.find((axis) => axis.axisId === "geography");
  const theme = portfolio.axisSummaries.find((axis) => axis.axisId === "theme");

  return (
    <Card title="Portfolio Overview" kicker="Target vs current" className="xl:col-span-2">
      <div className="grid gap-4 lg:grid-cols-[1.1fr_1.6fr]">
        <div className="rounded-3xl border border-amber-200/15 bg-gradient-to-br from-amber-200/15 to-transparent p-5">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-400">
              Total value
            </p>
            <StatusBadge status={portfolio.status} />
          </div>
          <p className="mt-5 text-4xl font-semibold tracking-tight text-stone-50">
            {formatKrw(portfolio.totalValueKrw)}
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <Metric label="Weekly" value={formatPct(portfolio.weeklyChangePct)} />
            <Metric label="P/L" value={formatKrw(portfolio.profitLossKrw)} />
          </div>
          <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
            <div className="flex justify-between text-sm">
              <span className="text-stone-400">Top overweight</span>
              <span className="font-semibold text-amber-100">
                {portfolio.topOverweight.name} {formatPct(portfolio.topOverweight.deviationPct)}
              </span>
            </div>
            <div className="mt-3 flex justify-between text-sm">
              <span className="text-stone-400">Top underweight</span>
              <span className="font-semibold text-rose-100">
                {portfolio.topUnderweight.name} {formatPct(portfolio.topUnderweight.deviationPct)}
              </span>
            </div>
            <div className="mt-3 flex justify-between text-sm">
              <span className="text-stone-400">Unclassified assets</span>
              <span className="font-semibold text-stone-100">
                {portfolio.unclassifiedAssetCount}
              </span>
            </div>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {geography ? <AxisList axis={geography} /> : null}
          {theme ? <AxisList axis={theme} /> : null}
        </div>
      </div>
    </Card>
  );
}

export function AxisList({ axis }: { axis: AxisSummary }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
      <h4 className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-400">
        {axis.axisName}
      </h4>
      <div className="mt-4 space-y-3">
        {axis.items.map((item) => (
          <div key={item.bucketId}>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="font-medium text-stone-100">{item.name}</span>
              <span className={item.deviationPct >= 0 ? "text-amber-100" : "text-rose-100"}>
                {formatPct(item.deviationPct)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-stone-500">
              <span>Target {item.targetWeightPct}%</span>
              <span>Current {item.currentWeightPct}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-stone-800">
              <div
                className={item.status === "ok" ? "h-full bg-emerald-300" : "h-full bg-amber-300"}
                style={{ width: `${Math.min(item.currentWeightPct, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
      <p className="text-xs uppercase tracking-[0.22em] text-stone-500">{label}</p>
      <p className="mt-2 text-lg font-semibold text-stone-50">{value}</p>
    </div>
  );
}
