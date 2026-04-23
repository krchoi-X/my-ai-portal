import { SimpleHubPage } from "@/components/simple-hub-page";
import { getDashboardData } from "@/lib/local-data";

export default async function TravelPage() {
  const { links } = await getDashboardData();

  return (
    <SimpleHubPage
      eyebrow="여행"
      title="여행 계획 허브"
      description="여행 일정, 장소 후보, 준비 메모로 이어지는 AI 링크를 모아두는 v0.1 허브입니다. 향후에는 이전 여행 계획과 기록을 카드로 정리할 수 있게 둡니다."
      links={links.filter((link) => link.category === "travel")}
    />
  );
}
