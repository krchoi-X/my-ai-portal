import { SimpleHubPage } from "@/components/simple-hub-page";
import { getDashboardData } from "@/lib/local-data";

export default async function ContentPage() {
  const { links } = await getDashboardData();

  return (
    <SimpleHubPage
      eyebrow="Content"
      title="Content workspace links."
      description="A simple v0.1 hub for writing, publishing, and idea systems. No workflow automation is added."
      links={links.filter((link) => link.category === "content")}
    />
  );
}
