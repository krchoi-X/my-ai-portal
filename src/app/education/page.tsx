import { SimpleHubPage } from "@/components/simple-hub-page";
import { getDashboardData } from "@/lib/local-data";

export default async function EducationPage() {
  const { links } = await getDashboardData();

  return (
    <SimpleHubPage
      eyebrow="교육"
      title="학습 기록 허브"
      description="학습 주제, 강의 메모, 이전 ChatGPT 정리물을 모으기 위한 가벼운 시작점입니다. v0.1에서는 링크와 기록 자리만 유지합니다."
      links={links}
    />
  );
}
