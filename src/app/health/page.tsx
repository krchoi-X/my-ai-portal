import { SimpleHubPage } from "@/components/simple-hub-page";
import { getDashboardData } from "@/lib/local-data";

export default async function HealthPage() {
  const { links } = await getDashboardData();

  return (
    <SimpleHubPage
      eyebrow="Health"
      title="Health hub."
      description="A placeholder hub for local-first health links and future notes, with no external integrations."
      links={links}
    />
  );
}
