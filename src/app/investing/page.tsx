import Link from "next/link";
import { AxisList } from "@/components/portfolio-overview-card";
import { Card, PageIntro, StatusBadge } from "@/components/ui";
import { formatNumber } from "@/lib/format";
import { getInvestingData } from "@/lib/local-data";

export default async function InvestingPage() {
  const { marketSignal, macroLatest, macroDefinitions, portfolioLatest } =
    await getInvestingData();
  const definitionsById = new Map(macroDefinitions.map((item) => [item.indicatorId, item]));

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Investing"
        title="Portfolio review workspace."
        description="Use this area to compare market context, macro indicators, and axis-level portfolio drift before updating targets or classifications."
        actions={
          <div className="flex flex-wrap gap-3">
            <Link className="rounded-full bg-amber-200 px-4 py-2 text-sm font-semibold text-stone-950" href="/investing/targets">
              Edit targets
            </Link>
            <Link className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-stone-100" href="/investing/assets/classify">
              Classify assets
            </Link>
          </div>
        }
      />
      <div className="grid gap-6 xl:grid-cols-3">
        <Card title="Market Signal" kicker="Current">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-semibold text-stone-50">{marketSignal.label}</p>
              <p className="mt-3 text-sm leading-6 text-stone-300">{marketSignal.message}</p>
            </div>
            <StatusBadge status={marketSignal.status} />
          </div>
        </Card>
        <Card title="Macro List" kicker="Latest values" className="xl:col-span-2">
          <div className="grid gap-3 md:grid-cols-2">
            {macroLatest.items.map((item) => (
              <div key={item.indicatorId} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                <span className="text-sm text-stone-300">
                  {definitionsById.get(item.indicatorId)?.name ?? item.indicatorId}
                </span>
                <span className="font-semibold text-stone-50">{formatNumber(item.value)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <div className="grid gap-6 xl:grid-cols-3">
        {portfolioLatest.axisSummaries.map((axis) => (
          <AxisList key={axis.axisId} axis={axis} />
        ))}
      </div>
    </div>
  );
}
