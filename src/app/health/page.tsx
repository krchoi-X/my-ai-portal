import { SimpleHubPage } from "@/components/simple-hub-page";
import { getDashboardData } from "@/lib/local-data";

export default async function HealthPage() {
  const { links } = await getDashboardData();

  return (
    <SimpleHubPage
      eyebrow="건강"
      title="건강 기록 허브"
      description="운동, 식단, 컨디션 메모와 관련된 AI 작업을 모으기 위한 단순 허브입니다. 외부 연동 없이 향후 기록 카드와 요약을 붙일 수 있게 둡니다."
      links={links}
    />
  );
}
