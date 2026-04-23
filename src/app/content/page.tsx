import { SimpleHubPage } from "@/components/simple-hub-page";
import { getDashboardData } from "@/lib/local-data";

export default async function ContentPage() {
  const { links } = await getDashboardData();

  return (
    <SimpleHubPage
      eyebrow="콘텐츠"
      title="콘텐츠 기록 허브"
      description="글쓰기, 쇼츠 아이디어, 분석 초안으로 이어지는 AI 링크를 모아두는 가벼운 허브입니다. 나중에는 이전 작업 기록과 요약 카드가 쌓이는 공간으로 확장합니다."
      links={links.filter((link) => link.category === "content")}
    />
  );
}
