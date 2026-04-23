import { Card, PageIntro } from "@/components/ui";
import { formatKrw } from "@/lib/format";
import { getInvestingData } from "@/lib/local-data";

export default async function AssetInputPage() {
  const { assets, holdings } = await getInvestingData();
  const holdingsByAsset = new Map(holdings.map((holding) => [holding.asset_id, holding]));

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="자산 입력"
        title="수동 보유자산 입력"
        description="보유자산 입력과 분류 연결을 분리해서 관리합니다. 이 화면은 데이터베이스나 API 없이 로컬 파일 입력 흐름을 위한 구조입니다."
      />
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
              {assets.map((asset) => {
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
