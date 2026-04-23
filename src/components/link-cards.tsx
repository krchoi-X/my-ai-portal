import type { LinkItem } from "@/lib/types";
import { Card } from "./ui";

export function LinkCards({ links }: { links: LinkItem[] }) {
  return (
    <Card title="External Link Hub" kicker="Configured locally">
      <div className="grid gap-3 md:grid-cols-3">
        {links.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noreferrer"
            className="group rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-amber-200/40 hover:bg-amber-200/10"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-200/70">
              {link.category}
            </p>
            <h4 className="mt-3 font-semibold text-stone-50">{link.title}</h4>
            <p className="mt-2 text-sm leading-6 text-stone-400">{link.description}</p>
          </a>
        ))}
      </div>
    </Card>
  );
}
