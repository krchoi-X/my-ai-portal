import { SimpleHubPage } from "@/components/simple-hub-page";
import { getDashboardData } from "@/lib/local-data";

export default async function TravelPage() {
  const { links } = await getDashboardData();

  return (
    <SimpleHubPage
      eyebrow="Travel"
      title="Travel planning hub."
      description="A lightweight landing page for travel planning links and notes planned for later markdown storage."
      links={links.filter((link) => link.category === "travel")}
    />
  );
}
