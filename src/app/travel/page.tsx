import { SimpleHubPage } from "@/components/simple-hub-page";
import { getActiveGptLinks, getHubRecords } from "@/lib/hub-data";

export default async function TravelPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const params = await searchParams;
  const [gptLinks, records] = await Promise.all([
    getActiveGptLinks("travel"),
    getHubRecords("travel"),
  ]);

  return (
    <SimpleHubPage
      category="travel"
      eyebrow="여행"
      title="여행 계획 허브"
      description="여행 일정, 장소 후보, 준비 메모로 이어지는 AI 링크를 모아두는 v0.1 허브입니다. 향후에는 이전 여행 계획과 기록을 카드로 정리할 수 있게 둡니다."
      error={params.error}
      gptLinks={gptLinks}
      records={records}
      saved={params.saved}
    />
  );
}
