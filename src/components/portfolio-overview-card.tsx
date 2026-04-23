import { formatKrw, formatPct } from "@/lib/format";
import type { AxisSummary, PortfolioLatest } from "@/lib/types";
import { Card, StatusBadge } from "./ui";

export function PortfolioOverviewCard({ portfolio }: { portfolio: PortfolioLatest }) {
  const geography = portfolio.axisSummaries.find((axis) => axis.axisId === "geography");
  const theme = portfolio.axisSummaries.find((axis) => axis.axisId === "theme");

  return (
    <Card title="내 포트폴리오 현황" kicker="목표 / 현재 / 차이">
      <div className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-4">
          <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-400">
                총 평가금액
              </p>
              <StatusBadge status={portfolio.status} />
            </div>
            <p className="mt-4 text-3xl font-semibold tracking-tight text-stone-50">
              {formatKrw(portfolio.totalValueKrw)}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Metric label="주간 변화" value={formatPct(portfolio.weeklyChangePct)} />
            <Metric label="손익" value={formatKrw(portfolio.profitLossKrw)} />
          </div>
          <div className="grid gap-3">
            <SignalRow
              label="가장 많이 초과"
              tone="amber"
              value={`${portfolio.topOverweight.name} ${formatPct(portfolio.topOverweight.deviationPct)}`}
            />
            <SignalRow
              label="가장 많이 부족"
              tone="rose"
              value={`${portfolio.topUnderweight.name} ${formatPct(portfolio.topUnderweight.deviationPct)}`}
            />
            <SignalRow
              label="미분류 자산"
              tone="stone"
              value={`${portfolio.unclassifiedAssetCount}개`}
            />
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

export function PortfolioCompactCard({ portfolio }: { portfolio: PortfolioLatest }) {
  return (
    <Card title="포트폴리오 요약" kicker="핵심 수치">
      <div className="grid gap-3 sm:grid-cols-3">
        <Metric label="총 평가금액" value={formatKrw(portfolio.totalValueKrw)} />
        <Metric label="주간 변화" value={formatPct(portfolio.weeklyChangePct)} />
        <Metric label="손익" value={formatKrw(portfolio.profitLossKrw)} />
      </div>
    </Card>
  );
}

export function AxisList({ axis }: { axis: AxisSummary }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-center justify-between gap-3">
        <h4 className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-400">
          {axis.axisName} 차이
        </h4>
        <span className="text-xs text-stone-500">목표 / 현재</span>
      </div>
      <div className="mt-4 space-y-3">
        {axis.items.map((item) => (
          <div key={item.bucketId} className="rounded-2xl border border-white/10 bg-black/15 p-3">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium text-stone-100">{item.name}</span>
              <span className={item.deviationPct >= 0 ? "font-semibold text-amber-100" : "font-semibold text-rose-100"}>
                {formatPct(item.deviationPct)}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-stone-400">
              <span>목표 {item.targetWeightPct}%</span>
              <span>현재 {item.currentWeightPct}%</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-stone-800">
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

function SignalRow({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "amber" | "rose" | "stone";
}) {
  const valueTone = {
    amber: "text-amber-100",
    rose: "text-rose-100",
    stone: "text-stone-100",
  }[tone];

  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 p-3 text-sm">
      <span className="text-stone-400">{label}</span>
      <span className={`font-semibold ${valueTone}`}>{value}</span>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
      <p className="text-xs uppercase tracking-[0.2em] text-stone-500">{label}</p>
      <p className="mt-2 text-lg font-semibold text-stone-50">{value}</p>
    </div>
  );
}
