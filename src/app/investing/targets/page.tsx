import { Card, PageIntro } from "@/components/ui";
import { getInvestingData } from "@/lib/local-data";

export default async function TargetsPage() {
  const { axes, buckets, targets } = await getInvestingData();

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Targets"
        title="Axis targets are editable by structure."
        description="This first pass renders mock-editable controls from local target JSON. The layout keeps axes, buckets, and thresholds separated for future file writes."
      />
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
                    const target = targets.find(
                      (item) => item.axisId === axis.axisId && item.bucketId === bucket.bucketId,
                    );

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
                            className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-stone-100 outline-none"
                            defaultValue={target?.targetWeightPct ?? 0}
                            aria-label={`${bucket.name} target weight`}
                          />
                          <input
                            className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-stone-100 outline-none"
                            defaultValue={target?.rebalanceThresholdPct ?? 0}
                            aria-label={`${bucket.name} rebalance threshold`}
                          />
                        </div>
                        <div className="mt-2 flex justify-between text-xs uppercase tracking-[0.18em] text-stone-500">
                          <span>Target %</span>
                          <span>Threshold %</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            );
          })}
      </div>
    </div>
  );
}
