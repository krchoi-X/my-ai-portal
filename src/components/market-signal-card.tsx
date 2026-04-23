import { formatDateTime } from "@/lib/format";
import type { MarketSignal } from "@/lib/types";
import { Card, StatusBadge } from "./ui";

export function MarketSignalCard({ signal }: { signal: MarketSignal }) {
  return (
    <Card title="Market Signal" kicker="Current stance">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-3xl font-semibold text-stone-50">{signal.label}</div>
          <p className="mt-3 max-w-xl text-sm leading-6 text-stone-300">{signal.message}</p>
        </div>
        <StatusBadge status={signal.status} />
      </div>
      <div className="mt-6 rounded-2xl border border-amber-200/15 bg-amber-200/10 p-4">
        <p className="text-sm font-medium text-amber-100">{signal.actionHint}</p>
        <p className="mt-2 text-xs text-stone-500">Updated {formatDateTime(signal.updatedAt)}</p>
      </div>
    </Card>
  );
}
