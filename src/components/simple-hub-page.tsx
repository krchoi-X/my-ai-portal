import { LinkCards } from "@/components/link-cards";
import { Card, PageIntro } from "@/components/ui";
import type { LinkItem } from "@/lib/types";

export function SimpleHubPage({
  eyebrow,
  title,
  description,
  links,
}: {
  eyebrow: string;
  title: string;
  description: string;
  links: LinkItem[];
}) {
  return (
    <div className="space-y-6">
      <PageIntro eyebrow={eyebrow} title={title} description={description} />
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <LinkCards links={links} />
        <Card title="최근 기록" kicker="v0.1 자리">
          <div className="space-y-3">
            <RecordPlaceholder title="이전 ChatGPT 작업 링크" description="나중에 관련 대화, 산출물, 참고 링크를 카드로 모을 수 있습니다." />
            <RecordPlaceholder title="요약과 태그" description="최근 기록의 핵심 요약, 주제 태그, 다음 행동을 간단히 남기는 영역으로 확장합니다." />
            <RecordPlaceholder title="작업 히스토리" description="아직 편집 기능은 없고, v0.1에서는 향후 기록 카드가 들어갈 구조만 준비합니다." />
          </div>
        </Card>
      </div>
    </div>
  );
}

function RecordPlaceholder({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-white/12 bg-white/[0.025] p-4">
      <p className="text-sm font-semibold text-stone-100">{title}</p>
      <p className="mt-2 text-sm leading-6 text-stone-400">{description}</p>
    </div>
  );
}
