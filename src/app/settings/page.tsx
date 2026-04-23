import { Card, PageIntro } from "@/components/ui";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="설정"
        title="로컬 포털 설정"
        description="설정은 app-data/config의 JSON 파일에서 읽습니다. 인증, 데이터베이스, 외부 API 설정은 v0.1에 포함하지 않습니다."
      />
      <div className="grid gap-6 md:grid-cols-3">
        <Card title="데이터 위치" kicker="로컬">
          <p className="text-sm text-stone-300">app-data/config, app-data/current, app-data/raw</p>
        </Card>
        <Card title="저장 방식" kicker="v0.1">
          <p className="text-sm text-stone-300">JSON과 CSV 파일만 사용합니다.</p>
        </Card>
        <Card title="거래 기능" kicker="비활성">
          <p className="text-sm text-stone-300">주문, 예측, 거래 실행 기능은 없습니다.</p>
        </Card>
      </div>
    </div>
  );
}
