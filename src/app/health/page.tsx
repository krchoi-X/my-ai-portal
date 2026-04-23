import { SimpleHubPage } from "@/components/simple-hub-page";
import { getActiveGptLinks, getHubRecords } from "@/lib/hub-data";

export default async function HealthPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const params = await searchParams;
  const [gptLinks, records] = await Promise.all([
    getActiveGptLinks("health"),
    getHubRecords("health"),
  ]);

  return (
    <SimpleHubPage
      category="health"
      eyebrow="건강"
      title="건강 기록 허브"
      description="운동, 식단, 컨디션 메모와 관련된 AI 작업을 모으기 위한 단순 허브입니다. 외부 연동 없이 향후 기록 카드와 요약을 붙일 수 있게 둡니다."
      error={params.error}
      gptLinks={gptLinks}
      records={records}
      saved={params.saved}
    />
  );
}
