import Link from "next/link";
import { Card, PageIntro } from "@/components/ui";
import { formatKrw } from "@/lib/format";
import {
  rebuildPortfolioSummaryAction,
  saveAssetAndHolding,
  saveExistingAssetWithHolding,
} from "@/lib/investing-actions";
import { getInvestingData } from "@/lib/local-data";
import type { HoldingRow, PortfolioAsset, PortfolioBucket } from "@/lib/types";

export default async function AssetInputPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const { assets, buckets, holdings } = await getInvestingData();
  const holdingsByAsset = getLatestHoldingByAsset(holdings);
  const showInactive = params?.showInactive === "1";
  const activeAssets = assets.filter((asset) => asset.isActive !== false);
  const inactiveAssets = assets.filter((asset) => asset.isActive === false);
  const bucketsByAxis = {
    geography: buckets.filter((bucket) => bucket.axisId === "geography"),
    role: buckets.filter((bucket) => bucket.axisId === "role"),
    theme: buckets.filter((bucket) => bucket.axisId === "theme"),
  };

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="자산 입력"
        title="자산별 통합 입력"
        description="각 자산 카드에서 기본 정보, 분류, 최신 보유 스냅샷을 한 번에 수정합니다. 저장하면 자산 마스터를 업데이트하고 보유 기록을 CSV에 추가한 뒤 요약을 다시 계산합니다."
        actions={
          <form action={rebuildPortfolioSummaryAction}>
            <button className="rounded-xl border border-emerald-200/20 bg-emerald-200/10 px-4 py-2 text-sm font-semibold text-emerald-100" type="submit">
              포트폴리오 다시 계산
            </button>
          </form>
        }
      />
      <SaveMessage
        error={typeof params?.error === "string" ? params.error : undefined}
        saved={typeof params?.saved === "string" ? params.saved : undefined}
      />
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-stone-300">
        <span>활성 자산 {activeAssets.length}개, 비활성 자산 {inactiveAssets.length}개</span>
        <Link
          className="rounded-xl border border-white/15 bg-white/[0.04] px-3 py-2 text-sm font-semibold text-stone-100"
          href={showInactive ? "/investing/assets/input" : "/investing/assets/input?showInactive=1"}
        >
          {showInactive ? "비활성 자산 숨기기" : "비활성 자산 보기"}
        </Link>
      </div>
      <Card title="새 자산 추가 + 첫 보유 스냅샷" kicker="portfolio_assets.json / portfolio_holdings.csv 저장">
        <form action={saveAssetAndHolding} className="grid gap-4">
          <div className="grid gap-3 md:grid-cols-4">
            <Field label="자산 ID" name="assetId" required />
            <Field label="자산명" name="name" required />
            <Field label="티커" name="ticker" required />
            <Field label="자산 유형" name="assetType" placeholder="stock, etf, cash" required />
            <Field label="통화" name="currency" placeholder="KRW, USD, JPY" required />
            <SelectField label="지역 분류" name="geography" options={bucketsByAxis.geography} />
            <SelectField label="테마 분류" name="theme" options={bucketsByAxis.theme} />
            <SelectField label="역할 분류" name="role" options={bucketsByAxis.role} />
          </div>
          <div className="grid gap-3 md:grid-cols-4">
            <Field label="수량" name="quantity" required type="number" />
            <Field label="가격" name="price" required type="number" />
            <Field label="평가금액(KRW)" name="market_value_krw" required type="number" />
            <Field label="메모" name="note" />
          </div>
          <div className="flex justify-end">
            <button className="rounded-xl bg-amber-200 px-4 py-2 text-sm font-semibold text-stone-950 shadow-lg shadow-amber-950/20" type="submit">
              자산/보유 저장
            </button>
          </div>
        </form>
      </Card>
      <Card title="활성 자산 통합 편집" kicker="자산 정보 + 보유 스냅샷 한 번에 저장">
        <div className="grid gap-4">
          {activeAssets.map((asset) => (
            <ExistingAssetForm
              asset={asset}
              bucketsByAxis={bucketsByAxis}
              holding={holdingsByAsset.get(String(asset.assetId))}
              key={asset.assetId}
            />
          ))}
        </div>
      </Card>
      {showInactive ? (
        <Card title="비활성 자산" kicker="기본 합산 제외">
          <div className="grid gap-4">
            {inactiveAssets.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-white/12 bg-white/[0.02] px-4 py-5 text-sm text-stone-500">
                비활성 자산이 없습니다.
              </p>
            ) : (
              inactiveAssets.map((asset) => (
                <ExistingAssetForm
                  asset={asset}
                  bucketsByAxis={bucketsByAxis}
                  holding={holdingsByAsset.get(String(asset.assetId))}
                  key={asset.assetId}
                />
              ))
            )}
          </div>
        </Card>
      ) : null}
      <Card title="보유자산 입력표" kicker="portfolio_assets.json 및 raw CSV 기준">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] border-separate border-spacing-y-2 text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.18em] text-stone-500">
              <tr>
                <th className="px-3 py-2">자산명</th>
                <th className="px-3 py-2">티커</th>
                <th className="px-3 py-2">유형</th>
                <th className="px-3 py-2">통화</th>
                <th className="px-3 py-2">수량</th>
                <th className="px-3 py-2">가격</th>
                <th className="px-3 py-2">평가금액</th>
                <th className="px-3 py-2">메모</th>
              </tr>
            </thead>
            <tbody>
              {activeAssets.map((asset) => {
                const holding = holdingsByAsset.get(asset.assetId);

                return (
                  <tr key={asset.assetId}>
                    <td className="rounded-l-2xl border-y border-l border-white/10 bg-white/[0.03] px-3 py-3 font-medium text-stone-100">
                      {asset.name}
                    </td>
                    <td className="border-y border-white/10 bg-white/[0.03] px-3 py-3 text-stone-300">
                      {asset.ticker}
                    </td>
                    <td className="border-y border-white/10 bg-white/[0.03] px-3 py-3 text-stone-300">
                      {asset.assetType}
                    </td>
                    <td className="border-y border-white/10 bg-white/[0.03] px-3 py-3 text-stone-300">
                      {asset.currency}
                    </td>
                    <td className="border-y border-white/10 bg-white/[0.03] px-3 py-3 text-stone-300">
                      {holding?.quantity ?? ""}
                    </td>
                    <td className="border-y border-white/10 bg-white/[0.03] px-3 py-3 text-stone-300">
                      {holding?.price ?? ""}
                    </td>
                    <td className="border-y border-white/10 bg-white/[0.03] px-3 py-3 text-stone-100">
                      {holding ? formatKrw(Number(holding.market_value_krw)) : ""}
                    </td>
                    <td className="rounded-r-2xl border-y border-r border-white/10 bg-white/[0.03] px-3 py-3 text-stone-500">
                      {holding?.note || "수동 입력"}
                    </td>
                  </tr>
                );
              })}
              <tr>
                {["자산명", "티커", "유형", "통화", "수량", "가격", "평가금액", "메모"].map((field, index) => (
                  <td
                    key={field}
                    className={`${index === 0 ? "rounded-l-2xl border-l" : ""} ${index === 7 ? "rounded-r-2xl border-r" : ""} border-y border-dashed border-amber-200/25 bg-amber-200/5 px-3 py-3`}
                  >
                    <input
                      className="w-full bg-transparent text-stone-200 outline-none placeholder:text-stone-600"
                      placeholder={field}
                    />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function ExistingAssetForm({
  asset,
  bucketsByAxis,
  holding,
}: {
  asset: PortfolioAsset;
  bucketsByAxis: Record<string, PortfolioBucket[]>;
  holding?: HoldingRow;
}) {
  return (
    <form
      action={saveExistingAssetWithHolding}
      className={`rounded-2xl border p-4 ${asset.isActive === false ? "border-white/8 bg-white/[0.015] opacity-80" : "border-white/10 bg-white/[0.03]"}`}
    >
      <input name="assetId" type="hidden" value={asset.assetId} />
      <div className="mb-4 flex flex-col gap-2 border-b border-white/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-base font-semibold text-stone-50">{asset.name}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-stone-500">
            {asset.assetId} / {asset.ticker}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            className="rounded-xl bg-amber-200 px-4 py-2 text-sm font-semibold text-stone-950 shadow-lg shadow-amber-950/20"
            name="actionIntent"
            type="submit"
            value="save"
          >
            이 자산 저장
          </button>
          <button
            className={`rounded-xl px-4 py-2 text-sm font-semibold ${asset.isActive === false ? "border border-emerald-200/20 bg-emerald-200/10 text-emerald-100" : "border border-rose-200/20 bg-rose-200/10 text-rose-100"}`}
            name="actionIntent"
            type="submit"
            value={asset.isActive === false ? "reactivate" : "deactivate"}
          >
            {asset.isActive === false ? "재활성화" : "비활성화"}
          </button>
        </div>
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <section>
          <p className="mb-3 text-sm font-semibold text-stone-100">자산 정보와 분류</p>
          <div className="grid gap-3 md:grid-cols-2">
            <Field defaultValue={asset.name} label="자산명" name="name" required />
            <Field defaultValue={asset.ticker} label="티커" name="ticker" required />
            <Field defaultValue={asset.assetType} label="유형" name="assetType" required />
            <Field defaultValue={asset.currency} label="통화" name="currency" required />
            <SelectField
              defaultValue={asset.classifications.geography}
              label="지역"
              name="geography"
              options={bucketsByAxis.geography}
            />
            <SelectField
              defaultValue={asset.classifications.theme}
              label="테마"
              name="theme"
              options={bucketsByAxis.theme}
            />
            <SelectField
              defaultValue={asset.classifications.role}
              label="역할"
              name="role"
              options={bucketsByAxis.role}
            />
            <label className="flex items-end gap-2 pb-2 text-sm text-stone-300">
              <input
                className="h-4 w-4 accent-amber-200"
                defaultChecked={asset.isActive}
                name="isActive"
                type="checkbox"
              />
              활성 자산
            </label>
          </div>
        </section>
        <section>
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-stone-100">새 보유 스냅샷</p>
            <p className="text-xs text-stone-500">
              {holding ? `최근 ${formatKrw(Number(holding.market_value_krw))}` : "최근 기록 없음"}
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <Field
              defaultValue={holding?.quantity}
              label="수량"
              name="quantity"
              required
              type="number"
            />
            <Field
              defaultValue={holding?.price}
              label="가격"
              name="price"
              required
              type="number"
            />
            <Field
              defaultValue={holding?.market_value_krw}
              label="평가금액(KRW)"
              name="market_value_krw"
              required
              type="number"
            />
            <Field
              defaultValue={holding?.note}
              label="메모"
              name="note"
            />
          </div>
          <p className="mt-3 text-xs leading-5 text-stone-500">
            저장 시 자산 정보는 JSON에 반영되고, 보유 스냅샷은 CSV에 새 행으로 추가됩니다. 비활성 자산은 기본 포트폴리오 합산에서 제외됩니다.
          </p>
        </section>
      </div>
    </form>
  );
}

function Field({
  defaultValue,
  label,
  name,
  placeholder,
  required,
  type = "text",
}: {
  defaultValue?: string;
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="grid gap-2 text-sm text-stone-300">
      <span>{label}</span>
      <input
        className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-stone-100 outline-none placeholder:text-stone-600 focus:border-amber-200/50"
        defaultValue={defaultValue}
        min={type === "number" ? "0" : undefined}
        name={name}
        placeholder={placeholder}
        required={required}
        step={type === "number" ? "any" : undefined}
        type={type}
      />
    </label>
  );
}

function SelectField({
  defaultValue,
  label,
  name,
  options,
}: {
  defaultValue?: string;
  label: string;
  name: string;
  options: Array<{ bucketId: string; name: string }>;
}) {
  return (
    <label className="grid gap-2 text-sm text-stone-300">
      <span>{label}</span>
      <select
        className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-200/50"
        defaultValue={defaultValue}
        name={name}
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
    const messageByState: Record<string, string> = {
      asset_edit_rebuild: "자산 정보를 저장했고 포트폴리오 요약이 갱신되었습니다.",
      asset_update_rebuild: "자산 정보와 보유 스냅샷을 저장했고 포트폴리오 요약이 갱신되었습니다.",
      asset_rebuild: "새 자산과 보유 스냅샷을 저장했고 포트폴리오 요약이 갱신되었습니다.",
      deactivated: "비활성화되었습니다. 포트폴리오 요약이 갱신되었습니다.",
      holding_rebuild: "보유 스냅샷을 추가했고 포트폴리오 요약이 갱신되었습니다.",
      reactivated: "재활성화되었습니다. 포트폴리오 요약이 갱신되었습니다.",
    };

    return (
      <p className="rounded-2xl border border-emerald-200/20 bg-emerald-200/10 px-4 py-3 text-sm text-emerald-100">
        {messageByState[saved] ?? "저장했고 포트폴리오 요약이 갱신되었습니다."}
      </p>
    );
  }

  return null;
}

function getLatestHoldingByAsset(holdings: HoldingRow[]) {
  const latest = new Map<string, HoldingRow>();

  for (const holding of holdings) {
    const previous = latest.get(holding.asset_id);

    if (!previous || new Date(holding.timestamp) >= new Date(previous.timestamp)) {
      latest.set(holding.asset_id, holding);
    }
  }

  return latest;
}
