import Link from "next/link";
import { AxisList } from "@/components/portfolio-overview-card";
import { Card, PageIntro, StatusBadge } from "@/components/ui";
import { formatNumber } from "@/lib/format";
import { rebuildPortfolioSummaryAction } from "@/lib/investing-actions";
import { getInvestingData } from "@/lib/local-data";

export default async function InvestingPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
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
            <Link className="rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-stone-100" href="/investing/import">
              CSV 가져오기
            </Link>
            <form action={rebuildPortfolioSummaryAction}>
              <button className="rounded-xl border border-emerald-200/20 bg-emerald-200/10 px-4 py-2 text-sm font-semibold text-emerald-100" type="submit">
                포트폴리오 다시 계산
              </button>
            </form>
          </div>
        }
      />
      <SaveMessage
        error={typeof params?.error === "string" ? params.error : undefined}
        saved={typeof params?.saved === "string" ? params.saved : undefined}
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

function SaveMessage({ saved, error }: { saved?: string; error?: string }) {
  if (error) {
    return (
      <p className="rounded-2xl border border-rose-200/20 bg-rose-200/10 px-4 py-3 text-sm text-rose-100">
        다시 계산 실패: {error}
      </p>
    );
  }

  if (saved === "rebuild") {
    return (
      <p className="rounded-2xl border border-emerald-200/20 bg-emerald-200/10 px-4 py-3 text-sm text-emerald-100">
        포트폴리오 요약이 갱신되었습니다.
      </p>
    );
  }

  return null;
}
