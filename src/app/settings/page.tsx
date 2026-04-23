import { Card, PageIntro } from "@/components/ui";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Settings"
        title="Local portal settings."
        description="Configuration is read from JSON files in app-data/config. No auth, no database, and no external API configuration are present."
      />
      <div className="grid gap-6 md:grid-cols-3">
        <Card title="Data Root" kicker="Local">
          <p className="text-sm text-stone-300">app-data/config, app-data/current, app-data/raw</p>
        </Card>
        <Card title="Persistence" kicker="v0.1">
          <p className="text-sm text-stone-300">JSON and CSV files only.</p>
        </Card>
        <Card title="Trading" kicker="Disabled">
          <p className="text-sm text-stone-300">No orders, predictions, or transaction features.</p>
        </Card>
      </div>
    </div>
  );
}
