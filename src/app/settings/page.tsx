import { Card, PageIntro } from "@/components/ui";
import { saveGptLink, setGptLinkActive } from "@/lib/hub-actions";
import { getGptLinks, hubCategories } from "@/lib/hub-data";
import type { GptLink, HubCategory } from "@/lib/types";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const links = await getGptLinks();
  const activeLinks = links.filter((link) => link.isActive);
  const inactiveLinks = links.filter((link) => !link.isActive);

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="설정"
        title="로컬 포털 설정"
        description="설정은 app-data/config의 JSON 파일에서 읽습니다. 인증, 데이터베이스, 외부 API 설정은 v0.1에 포함하지 않습니다."
      />
      <SaveMessage
        error={typeof params?.error === "string" ? params.error : undefined}
        saved={typeof params?.saved === "string" ? params.saved : undefined}
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
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card title="GPT 링크 추가" kicker="app-data/config/gpt_links.json">
          <form action={saveGptLink} className="grid gap-4">
            <Field label="제목" name="title" required />
            <Field label="설명" name="description" />
            <Field label="URL" name="url" required />
            <CategorySelect />
            <Field label="정렬 순서" name="sortOrder" placeholder="100" />
            <button className="rounded-xl bg-amber-200 px-4 py-2 text-sm font-semibold text-stone-950 shadow-lg shadow-amber-950/20" type="submit">
              GPT 링크 추가
            </button>
          </form>
        </Card>
        <Card title="활성 GPT 링크" kicker={`${activeLinks.length}개`}>
          <div className="space-y-4">
            {activeLinks.length === 0 ? (
              <EmptyState text="활성 GPT 링크가 없습니다." />
            ) : (
              activeLinks.map((link) => <GptLinkEditor key={link.id} link={link} />)
            )}
          </div>
        </Card>
      </div>
      <Card title="비활성 GPT 링크" kicker="숨김 상태">
        <div className="space-y-4">
          {inactiveLinks.length === 0 ? (
            <EmptyState text="비활성 GPT 링크가 없습니다." />
          ) : (
            inactiveLinks.map((link) => <GptLinkEditor key={link.id} link={link} />)
          )}
        </div>
      </Card>
    </div>
  );
}

function GptLinkEditor({ link }: { link: GptLink }) {
  return (
    <div className={`rounded-2xl border p-4 ${link.isActive ? "border-white/10 bg-white/[0.03]" : "border-white/8 bg-white/[0.015] opacity-80"}`}>
      <form action={saveGptLink} className="grid gap-3">
        <input name="id" type="hidden" value={link.id} />
        <div className="grid gap-3 md:grid-cols-2">
          <Field defaultValue={link.title} label="제목" name="title" required />
          <Field defaultValue={link.url} label="URL" name="url" required />
          <CategorySelect defaultValue={link.category} />
          <Field defaultValue={String(link.sortOrder)} label="정렬 순서" name="sortOrder" />
        </div>
        <Field defaultValue={link.description} label="설명" name="description" />
        <label className="flex items-center gap-2 text-sm text-stone-300">
          <input
            className="h-4 w-4 accent-amber-200"
            defaultChecked={link.isActive}
            name="isActive"
            type="checkbox"
          />
          활성 링크
        </label>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-stone-500">
            {categoryLabel(link.category)} / ID: {link.id}
          </p>
          <div className="flex flex-wrap gap-2">
            <button className="rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-stone-100" type="submit">
              링크 저장
            </button>
          </div>
        </div>
      </form>
      <form action={setGptLinkActive} className="mt-3 flex justify-end">
        <input name="id" type="hidden" value={link.id} />
        <input name="isActive" type="hidden" value={link.isActive ? "false" : "true"} />
        <button
          className={`rounded-xl px-4 py-2 text-sm font-semibold ${link.isActive ? "border border-rose-200/20 bg-rose-200/10 text-rose-100" : "border border-emerald-200/20 bg-emerald-200/10 text-emerald-100"}`}
          type="submit"
        >
          {link.isActive ? "비활성화" : "재활성화"}
        </button>
      </form>
    </div>
  );
}

function CategorySelect({ defaultValue }: { defaultValue?: HubCategory }) {
  return (
    <label className="grid gap-2 text-sm text-stone-300">
      <span>카테고리</span>
      <select
        className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-200/50"
        defaultValue={defaultValue}
        name="category"
        required
      >
        {hubCategories.map((category) => (
          <option key={category} value={category}>
            {categoryLabel(category)}
          </option>
        ))}
      </select>
    </label>
  );
}

function Field({
  defaultValue,
  label,
  name,
  placeholder,
  required,
}: {
  defaultValue?: string;
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-2 text-sm text-stone-300">
      <span>{label}</span>
      <input
        className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-stone-100 outline-none placeholder:text-stone-600 focus:border-amber-200/50"
        defaultValue={defaultValue}
        name={name}
        placeholder={placeholder}
        required={required}
      />
    </label>
  );
}

function SaveMessage({ saved, error }: { saved?: string; error?: string }) {
  if (error) {
    return (
      <p className="rounded-2xl border border-rose-200/20 bg-rose-200/10 px-4 py-3 text-sm text-rose-100">
        저장 실패: {error}
      </p>
    );
  }

  if (saved) {
    return (
      <p className="rounded-2xl border border-emerald-200/20 bg-emerald-200/10 px-4 py-3 text-sm text-emerald-100">
        GPT 링크 설정을 저장했습니다.
      </p>
    );
  }

  return null;
}

function EmptyState({ text }: { text: string }) {
  return (
    <p className="rounded-2xl border border-dashed border-white/12 bg-white/[0.02] px-4 py-5 text-sm text-stone-500">
      {text}
    </p>
  );
}

function categoryLabel(category: HubCategory) {
  const labels: Record<HubCategory, string> = {
    content: "콘텐츠",
    education: "교육",
    health: "건강",
    investing: "투자",
    travel: "여행",
  };

  return labels[category];
}
