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
        eyebrow="Dashboard"
        title="Review the portfolio before changing the portfolio."
        description="A local-first cockpit for checking market context, macro pressure, target drift, and next review areas without trading features or external APIs."
      />
      <div className="grid gap-6 xl:grid-cols-2">
        <PortfolioOverviewCard portfolio={portfolioLatest} />
        <MarketSignalCard signal={marketSignal} />
        <MacroOverviewCard latest={macroLatest} definitions={macroDefinitions} />
        <LinkCards links={links} />
      </div>
    </div>
  );
}
