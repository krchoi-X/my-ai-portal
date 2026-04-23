import { SimpleHubPage } from "@/components/simple-hub-page";
import { getActiveGptLinks, getHubRecords } from "@/lib/hub-data";

export default async function ContentPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const params = await searchParams;
  const [gptLinks, records] = await Promise.all([
    getActiveGptLinks("content"),
    getHubRecords("content"),
  ]);

  return (
    <SimpleHubPage
      category="content"
      eyebrow="콘텐츠"
      title="콘텐츠 기록 허브"
      description="글쓰기, 쇼츠 아이디어, 분석 초안으로 이어지는 AI 링크를 모아두는 가벼운 허브입니다. 나중에는 이전 작업 기록과 요약 카드가 쌓이는 공간으로 확장합니다."
      error={params.error}
      gptLinks={gptLinks}
      records={records}
      saved={params.saved}
    />
  );
}
