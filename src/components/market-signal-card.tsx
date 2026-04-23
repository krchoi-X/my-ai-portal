import { formatDateTime } from "@/lib/format";
import type { MarketSignal } from "@/lib/types";
import { Card, StatusBadge } from "./ui";

export function MarketSignalCard({ signal }: { signal: MarketSignal }) {
  return (
    <Card title="시장 신호" kicker="첫 번째 점검 항목">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-stone-400">현재 상태</p>
          <div className="mt-1 text-3xl font-semibold text-stone-50">{signal.label}</div>
          <p className="mt-3 max-w-xl text-sm leading-6 text-stone-300">{signal.message}</p>
        </div>
        <StatusBadge status={signal.status} />
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]">
        <div className="rounded-2xl border border-amber-200/15 bg-amber-200/10 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200/70">
            다음 행동
          </p>
          <p className="mt-2 text-sm font-medium text-amber-100">{signal.actionHint}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
            업데이트
          </p>
          <p className="mt-2 whitespace-nowrap text-sm font-medium text-stone-200">
            {formatDateTime(signal.updatedAt)}
          </p>
        </div>
      </div>
    </Card>
  );
}
