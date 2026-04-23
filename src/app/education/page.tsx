import { SimpleHubPage } from "@/components/simple-hub-page";
import { getActiveGptLinks, getHubRecords } from "@/lib/hub-data";

export default async function EducationPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const params = await searchParams;
  const [gptLinks, records] = await Promise.all([
    getActiveGptLinks("education"),
    getHubRecords("education"),
  ]);

  return (
    <SimpleHubPage
      category="education"
      eyebrow="교육"
      title="학습 기록 허브"
      description="학습 주제, 강의 메모, 이전 ChatGPT 정리물을 모으기 위한 가벼운 시작점입니다. v0.1에서는 링크와 기록 자리만 유지합니다."
      error={params.error}
      gptLinks={gptLinks}
      records={records}
      saved={params.saved}
    />
  );
}
