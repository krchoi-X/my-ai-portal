import Link from "next/link";
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
    <section className="grain-overlay overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/30 sm:p-8">
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-amber-200/70">
            {eyebrow}
          </p>
          <h2 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-stone-50 sm:text-6xl">
            {title}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-stone-300">
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
    <section className={`rounded-3xl border border-white/10 bg-[#10130f]/85 p-5 shadow-xl shadow-black/20 ${className}`}>
      <div className="mb-5 flex items-start justify-between gap-4">
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
  const tone =
    status === "ok"
      ? "border-emerald-200/30 bg-emerald-300/10 text-emerald-100"
      : status === "warning" || status === "watch" || status === "caution"
        ? "border-amber-200/30 bg-amber-300/10 text-amber-100"
        : "border-stone-200/20 bg-stone-200/10 text-stone-200";

  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${tone}`}>
      {status}
    </span>
  );
}

export function HubLinks({ links }: { links: Array<{ label: string; href: string }> }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm font-semibold text-stone-200 transition hover:border-amber-200/40 hover:bg-amber-200/10"
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}
