import { Card, PageIntro } from "@/components/ui";

export default function MemoryPage() {
  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="메모리"
        title="로컬 메모 자리"
        description="v0.1에서는 향후 app-data/notes 아래 마크다운 메모를 둘 수 있는 공간만 준비합니다. 데이터베이스는 추가하지 않습니다."
      />
      <Card title="저장 방향" kicker="향후 확장">
        <p className="text-sm leading-6 text-stone-300">
          나중에 메모, 요약, 태그를 마크다운 파일로 추가할 수 있습니다. 현재 버전은 기존 로컬 데이터 외 저장 변경을 만들지 않습니다.
        </p>
      </Card>
    </div>
  );
}
