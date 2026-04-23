import { SimpleHubPage } from "@/components/simple-hub-page";
import { getDashboardData } from "@/lib/local-data";

export default async function EducationPage() {
  const { links } = await getDashboardData();

  return (
    <SimpleHubPage
      eyebrow="Education"
      title="Education hub."
      description="A simple link area for learning resources. v0.1 intentionally keeps this section minimal."
      links={links}
    />
  );
}
