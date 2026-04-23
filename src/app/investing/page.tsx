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
        eyebrow="투자"
        title="포트폴리오 리뷰"
        description="시장 신호, 매크로 지표, 축별 비중 차이를 확인하고 필요한 입력 작업으로 바로 이동합니다."
        actions={
          <div className="flex flex-wrap gap-3">
            <Link className="rounded-xl bg-amber-200 px-4 py-2 text-sm font-semibold text-stone-950 shadow-lg shadow-amber-950/20" href="/investing/targets">
              목표 편집
            </Link>
            <Link className="rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-stone-100" href="/investing/assets/input">
              자산 입력
            </Link>
            <Link className="rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-stone-100" href="/investing/assets/classify">
              분류 연결
            </Link>
          </div>
        }
      />
      <div className="grid gap-6 xl:grid-cols-3">
        <Card title="시장 신호" kicker="현재 상태">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-semibold text-stone-50">{marketSignal.label}</p>
              <p className="mt-3 text-sm leading-6 text-stone-300">{marketSignal.message}</p>
            </div>
            <StatusBadge status={marketSignal.status} />
          </div>
        </Card>
        <Card title="매크로 목록" kicker="최신 값" className="xl:col-span-2">
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
