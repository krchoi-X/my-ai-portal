import { Card, PageIntro, StatusBadge } from "@/components/ui";
import { saveClassifications } from "@/lib/investing-actions";
import { getInvestingData } from "@/lib/local-data";

export default async function AssetClassifyPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const { axes, buckets, assets } = await getInvestingData();
  const bucketNameById = new Map(buckets.map((bucket) => [bucket.bucketId, bucket.name]));
  const axisNameById = new Map(axes.map((axis) => [axis.axisId, axis.name]));
  const bucketsByAxis = {
    geography: buckets.filter((bucket) => bucket.axisId === "geography"),
    role: buckets.filter((bucket) => bucket.axisId === "role"),
    theme: buckets.filter((bucket) => bucket.axisId === "theme"),
  };

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="분류 연결"
        title="자산별 버킷 연결"
        description="각 자산은 축마다 하나의 버킷만 가집니다. 현재는 portfolio_assets.json의 분류를 시각적으로 확인하고, 향후 드래그 앤 드롭 입력으로 확장할 구조입니다."
        actions={
          <button
            className="rounded-xl bg-amber-200 px-4 py-2 text-sm font-semibold text-stone-950 shadow-lg shadow-amber-950/20"
            form="classification-form"
            type="submit"
          >
            분류 저장
          </button>
        }
      />
      <SaveMessage
        error={typeof params?.error === "string" ? params.error : undefined}
        saved={typeof params?.saved === "string" ? params.saved : undefined}
      />
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.7fr]">
        <form action={saveClassifications} id="classification-form">
          <Card title="자산별 분류 편집" kicker="select 기반 저장">
            <div className="space-y-3">
              {assets.map((asset) => (
                <div key={asset.assetId} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-stone-50">{asset.name}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.2em] text-stone-500">
                        {asset.ticker} / {asset.assetType} / {asset.currency}
                      </p>
                    </div>
                    <StatusBadge status={asset.isActive ? "active" : "inactive"} />
                  </div>
                  <div className="mt-4 grid gap-3">
                    <ClassificationSelect
                      axisLabel="지역"
                      assetId={asset.assetId}
                      axisId="geography"
                      currentValue={asset.classifications.geography}
                      options={bucketsByAxis.geography}
                    />
                    <ClassificationSelect
                      axisLabel="테마"
                      assetId={asset.assetId}
                      axisId="theme"
                      currentValue={asset.classifications.theme}
                      options={bucketsByAxis.theme}
                    />
                    <ClassificationSelect
                      axisLabel="역할"
                      assetId={asset.assetId}
                      axisId="role"
                      currentValue={asset.classifications.role}
                      options={bucketsByAxis.role}
                    />
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
        </form>
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

function ClassificationSelect({
  axisLabel,
  assetId,
  axisId,
  currentValue,
  options,
}: {
  axisLabel: string;
  assetId: string;
  axisId: string;
  currentValue?: string;
  options: Array<{ bucketId: string; name: string }>;
}) {
  return (
    <label className="grid gap-2 text-sm text-stone-300">
      <span>{axisLabel}</span>
      <select
        className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-200/50"
        defaultValue={currentValue}
        name={`classification__${assetId}__${axisId}`}
        required
      >
        {options.map((option) => (
          <option key={option.bucketId} value={option.bucketId}>
            {option.name}
          </option>
        ))}
      </select>
    </label>
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
        자산 분류를 저장했고 포트폴리오 요약이 갱신되었습니다.
      </p>
    );
  }

  return null;
}
