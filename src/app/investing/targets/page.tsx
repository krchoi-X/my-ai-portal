import { Card, PageIntro } from "@/components/ui";
import { saveTargets } from "@/lib/investing-actions";
import { getInvestingData } from "@/lib/local-data";

export default async function TargetsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const { axes, buckets, targets } = await getInvestingData();

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="목표"
        title="축별 목표 비중"
        description="로컬 목표 JSON을 기준으로 축, 버킷, 목표 비중, 리밸런싱 기준을 확인합니다. v0.1에서는 실제 저장 전 구조를 먼저 정리합니다."
        actions={
          <button
            form="targets-form"
            className="rounded-xl bg-amber-200 px-4 py-2 text-sm font-semibold text-stone-950 shadow-lg shadow-amber-950/20"
            type="submit"
          >
            목표 저장
          </button>
        }
      />
      <SaveMessage
        error={typeof params?.error === "string" ? params.error : undefined}
        saved={typeof params?.saved === "string" ? params.saved : undefined}
      />
      <form action={saveTargets} id="targets-form">
        <div className="grid gap-6 xl:grid-cols-3">
          {axes
            .toSorted((a, b) => a.displayOrder - b.displayOrder)
            .map((axis) => {
              const axisBuckets = buckets
                .filter((bucket) => bucket.axisId === axis.axisId)
                .toSorted((a, b) => a.displayOrder - b.displayOrder);

              return (
                <Card key={axis.axisId} title={axis.name} kicker={axis.axisId}>
                  <div className="space-y-3">
                    {axisBuckets.map((bucket) => {
                      const targetIndex = targets.findIndex(
                        (item) => item.axisId === axis.axisId && item.bucketId === bucket.bucketId,
                      );
                      const target = targets[targetIndex];

                      if (!target) {
                        return null;
                      }

                      return (
                        <div key={bucket.bucketId} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                          <div className="flex items-center justify-between gap-3">
                            <label className="text-sm font-semibold text-stone-100" htmlFor={`${axis.axisId}-${bucket.bucketId}`}>
                              {bucket.name}
                            </label>
                            <span className="text-xs text-stone-500">{bucket.bucketId}</span>
                          </div>
                          <div className="mt-3 grid grid-cols-2 gap-3">
                            <input
                              id={`${axis.axisId}-${bucket.bucketId}`}
                              className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-200/50"
                              defaultValue={target.targetWeightPct}
                              min="0"
                              name={`targetWeightPct_${targetIndex}`}
                              step="0.1"
                              type="number"
                              aria-label={`${bucket.name} 목표 비중`}
                            />
                            <input
                              className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-200/50"
                              defaultValue={target.rebalanceThresholdPct}
                              min="0"
                              name={`rebalanceThresholdPct_${targetIndex}`}
                              step="0.1"
                              type="number"
                              aria-label={`${bucket.name} 리밸런싱 기준`}
                            />
                          </div>
                          <div className="mt-2 flex justify-between text-xs uppercase tracking-[0.18em] text-stone-500">
                            <span>목표 %</span>
                            <span>기준 %</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              );
            })}
        </div>
      </form>
    </div>
  );
}

function SaveMessage({ saved, error }: { saved?: string; error?: string }) {
  if (error) {
    return (
      <p className="rounded-2xl border border-rose-200/20 bg-rose-200/10 px-4 py-3 text-sm text-rose-100">
        저장 실패: {error}
      </p>
    );
  }

  if (saved) {
    return (
      <p className="rounded-2xl border border-emerald-200/20 bg-emerald-200/10 px-4 py-3 text-sm text-emerald-100">
        목표 비중을 저장했고 포트폴리오 요약이 갱신되었습니다.
      </p>
    );
  }

  return null;
}
