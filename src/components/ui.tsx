import type { ReactNode } from "react";

export function PageIntro({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-5 shadow-xl shadow-black/20 sm:p-6">
      <div className="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-amber-200/70">
            {eyebrow}
          </p>
          <h2 className="mt-3 max-w-4xl text-3xl font-semibold tracking-tight text-stone-50 sm:text-4xl">
            {title}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-300">
            {description}
          </p>
        </div>
        {actions}
      </div>
    </section>
  );
}

export function Card({
  title,
  children,
  kicker,
  className = "",
}: {
  title: string;
  children: ReactNode;
  kicker?: string;
  className?: string;
}) {
  return (
    <section className={`rounded-3xl border border-white/10 bg-[#10130f]/90 p-5 shadow-lg shadow-black/15 ${className}`}>
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          {kicker ? (
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-stone-500">
              {kicker}
            </p>
          ) : null}
          <h3 className="mt-1 text-lg font-semibold text-stone-50">{title}</h3>
        </div>
      </div>
      {children}
    </section>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const labelByStatus: Record<string, string> = {
    active: "활성",
    caution: "주의",
    inactive: "비활성",
    ok: "정상",
    warning: "점검",
    watch: "관찰",
  };
  const tone =
    status === "ok"
      ? "border-emerald-200/30 bg-emerald-300/10 text-emerald-100"
      : status === "warning" || status === "watch" || status === "caution"
        ? "border-amber-200/30 bg-amber-300/10 text-amber-100"
        : "border-stone-200/20 bg-stone-200/10 text-stone-200";

  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${tone}`}>
      {labelByStatus[status] ?? status}
    </span>
  );
}
