import { Card, PageIntro, StatusBadge } from "@/components/ui";
import { getInvestingData } from "@/lib/local-data";

export default async function AssetClassifyPage() {
  const { axes, buckets, assets } = await getInvestingData();
  const bucketNameById = new Map(buckets.map((bucket) => [bucket.bucketId, bucket.name]));
  const axisNameById = new Map(axes.map((axis) => [axis.axisId, axis.name]));

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="분류 연결"
        title="자산별 버킷 연결"
        description="각 자산은 축마다 하나의 버킷만 가집니다. 현재는 portfolio_assets.json의 분류를 시각적으로 확인하고, 향후 드래그 앤 드롭 입력으로 확장할 구조입니다."
      />
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.7fr]">
        <Card title="자산 목록" kicker="드래그 원본 자리">
          <div className="space-y-3">
            {assets.map((asset) => (
              <div key={asset.assetId} draggable className="cursor-grab rounded-2xl border border-white/10 bg-white/[0.04] p-4 active:cursor-grabbing">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-stone-50">{asset.name}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-stone-500">
                      {asset.ticker} / {asset.assetType} / {asset.currency}
                    </p>
                  </div>
                  <StatusBadge status={asset.isActive ? "active" : "inactive"} />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {Object.entries(asset.classifications).map(([axisId, bucketId]) => (
                    <span key={axisId} className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-stone-300">
                      {axisNameById.get(axisId) ?? axisId}: {bucketNameById.get(bucketId) ?? bucketId}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
        <div className="grid gap-6 xl:grid-cols-3">
          {axes
            .toSorted((a, b) => a.displayOrder - b.displayOrder)
            .map((axis) => {
              const axisBuckets = buckets
                .filter((bucket) => bucket.axisId === axis.axisId)
                .toSorted((a, b) => a.displayOrder - b.displayOrder);

              return (
                <Card key={axis.axisId} title={axis.name} kicker="버킷 영역">
                  <div className="space-y-3">
                    {axisBuckets.map((bucket) => {
                      const assignedAssets = assets.filter(
                        (asset) => asset.classifications[axis.axisId] === bucket.bucketId,
                      );

                      return (
                        <div key={bucket.bucketId} className="min-h-32 rounded-2xl border border-dashed border-white/15 bg-black/20 p-3">
                          <div className="mb-3 flex items-center justify-between">
                            <p className="text-sm font-semibold text-stone-100">{bucket.name}</p>
                            <span className="text-xs text-stone-500">{assignedAssets.length}</span>
                          </div>
                          <div className="space-y-2">
                            {assignedAssets.map((asset) => (
                              <div key={asset.assetId} className="rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-stone-200">
                                {asset.ticker}
                              </div>
                            ))}
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
    </div>
  );
}
