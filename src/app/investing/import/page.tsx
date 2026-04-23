import { BrokerCsvImportForm } from "@/components/broker-csv-import-form";
import { PageIntro } from "@/components/ui";
import { getInvestingData } from "@/lib/local-data";

export default async function InvestingImportPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const { assets, buckets } = await getInvestingData();

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="CSV 가져오기"
        title="증권사 CSV 가져오기"
        description="로컬 CSV 파일을 미리보고 컬럼을 연결한 뒤, 자산 마스터와 보유 스냅샷을 app-data 파일에 저장합니다."
      />
      <SaveMessage
        error={typeof params?.error === "string" ? params.error : undefined}
        saved={typeof params?.saved === "string" ? params.saved : undefined}
      />
      <BrokerCsvImportForm assets={assets} buckets={buckets} />
    </div>
  );
}

function SaveMessage({ saved, error }: { saved?: string; error?: string }) {
  if (error) {
    return (
      <p className="rounded-2xl border border-rose-200/20 bg-rose-200/10 px-4 py-3 text-sm text-rose-100">
        가져오기 실패: {error}
      </p>
    );
  }

  if (saved) {
    return (
      <p className="rounded-2xl border border-emerald-200/20 bg-emerald-200/10 px-4 py-3 text-sm text-emerald-100">
        CSV를 가져왔고 포트폴리오 요약이 갱신되었습니다.
      </p>
    );
  }

  return null;
}
