import { formatDateTime, formatNumber } from "@/lib/format";
import type { MacroDefinition, MacroLatest } from "@/lib/types";
import { Card } from "./ui";

export function MacroOverviewCard({
  latest,
  definitions,
}: {
  latest: MacroLatest;
  definitions: MacroDefinition[];
}) {
  const definitionsById = new Map(definitions.map((item) => [item.indicatorId, item]));
  const rows = latest.items
    .map((item) => ({ ...item, definition: definitionsById.get(item.indicatorId) }))
    .sort((a, b) => (a.definition?.displayOrder ?? 99) - (b.definition?.displayOrder ?? 99));

  return (
    <Card title="Macro Overview" kicker={`Updated ${formatDateTime(latest.updatedAt)}`}>
      <div className="grid gap-3 sm:grid-cols-2">
        {rows.map((item) => (
          <div key={item.indicatorId} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-stone-100">
                  {item.definition?.name ?? item.indicatorId}
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.22em] text-stone-500">
                  {item.definition?.unit ?? "value"}
                </p>
              </div>
              <TrendPill trend={item.trend7d} />
            </div>
            <div className="mt-4 flex items-end justify-between">
              <span className="text-2xl font-semibold text-stone-50">
                {formatNumber(item.value)}
              </span>
              <span className={item.change1d >= 0 ? "text-emerald-200" : "text-rose-200"}>
                {item.change1d >= 0 ? "+" : ""}
                {formatNumber(item.change1d)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function TrendPill({ trend }: { trend: string }) {
  const tone =
    trend === "up"
      ? "border-emerald-200/20 bg-emerald-200/10 text-emerald-100"
      : trend === "down"
        ? "border-rose-200/20 bg-rose-200/10 text-rose-100"
        : "border-stone-200/20 bg-stone-200/10 text-stone-200";

  return (
    <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${tone}`}>
      {trend}
    </span>
  );
}
