import { LinkCards } from "@/components/link-cards";
import { HubLinks, PageIntro } from "@/components/ui";
import type { LinkItem } from "@/lib/types";

export function SimpleHubPage({
  eyebrow,
  title,
  description,
  links,
}: {
  eyebrow: string;
  title: string;
  description: string;
  links: LinkItem[];
}) {
  return (
    <div className="space-y-6">
      <PageIntro eyebrow={eyebrow} title={title} description={description} />
      <HubLinks
        links={[
          { label: "Dashboard", href: "/" },
          { label: "Investing", href: "/investing" },
          { label: "Memory", href: "/memory" },
          { label: "Settings", href: "/settings" },
        ]}
      />
      <LinkCards links={links} />
    </div>
  );
}
