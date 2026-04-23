import { Card, PageIntro } from "@/components/ui";

export default function MemoryPage() {
  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Memory"
        title="Local notes will live here."
        description="v0.1 reserves this area for future markdown notes under app-data/notes without adding a database."
      />
      <Card title="Storage Plan" kicker="Future">
        <p className="text-sm leading-6 text-stone-300">
          Notes can be added later as markdown files. This first working version keeps the page simple and avoids persistence changes beyond existing local data.
        </p>
      </Card>
    </div>
  );
}
