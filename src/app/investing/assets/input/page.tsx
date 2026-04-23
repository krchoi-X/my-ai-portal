import { Card, PageIntro } from "@/components/ui";
import { formatKrw } from "@/lib/format";
import { getInvestingData } from "@/lib/local-data";

export default async function AssetInputPage() {
  const { assets, holdings } = await getInvestingData();
  const holdingsByAsset = new Map(holdings.map((holding) => [holding.asset_id, holding]));

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Asset Input"
        title="Manual holdings entry."
        description="Asset input is separate from classification. This table is prepared for manual local-file updates without introducing a database or API."
      />
      <Card title="Holdings Draft" kicker="From portfolio_assets.json and raw holdings CSV">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] border-separate border-spacing-y-2 text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.18em] text-stone-500">
              <tr>
                <th className="px-3 py-2">Asset name</th>
                <th className="px-3 py-2">Ticker</th>
                <th className="px-3 py-2">Type</th>
                <th className="px-3 py-2">Currency</th>
                <th className="px-3 py-2">Quantity</th>
                <th className="px-3 py-2">Price</th>
                <th className="px-3 py-2">Market value</th>
                <th className="px-3 py-2">Note</th>
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
                      {holding?.note || "Manual entry"}
                    </td>
                  </tr>
                );
              })}
              <tr>
                {["Asset name", "Ticker", "Asset type", "Currency", "Quantity", "Price", "Market value", "Note"].map((field, index) => (
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
