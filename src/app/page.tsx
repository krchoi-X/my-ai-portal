import { LinkCards } from "@/components/link-cards";
import { MacroOverviewCard } from "@/components/macro-overview-card";
import { MarketSignalCard } from "@/components/market-signal-card";
import { PortfolioOverviewCard } from "@/components/portfolio-overview-card";
import { PageIntro } from "@/components/ui";
import { getDashboardData } from "@/lib/local-data";

export default async function DashboardPage() {
  const { marketSignal, macroLatest, macroDefinitions, portfolioLatest, links } =
    await getDashboardData();

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="대시보드"
        title="오늘 점검할 투자 상태"
        description="시장 신호, 매크로 지표, 목표 대비 비중 차이를 한 화면에서 확인합니다. 매매 판단이 아니라 포트폴리오 설계와 리뷰를 위한 로컬 대시보드입니다."
      />
      <div className="grid gap-5 xl:grid-cols-2">
        <MarketSignalCard signal={marketSignal} />
        <MacroOverviewCard latest={macroLatest} definitions={macroDefinitions} />
        <PortfolioOverviewCard portfolio={portfolioLatest} />
        <LinkCards links={links} />
      </div>
    </div>
  );
}
