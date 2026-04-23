import { createHubRecord, updateHubRecord } from "@/lib/hub-actions";
import type { GptLink, HubCategory, HubRecord } from "@/lib/types";
import { Card, PageIntro } from "./ui";

export function SimpleHubPage({
  category,
  description,
  eyebrow,
  error,
  gptLinks,
  records,
  saved,
  title,
}: {
  category: HubCategory;
  description: string;
  eyebrow: string;
  error?: string;
  gptLinks: GptLink[];
  records: HubRecord[];
  saved?: string;
  title: string;
}) {
  return (
    <div className="space-y-6">
      <PageIntro eyebrow={eyebrow} title={title} description={description} />
      <StatusMessages error={error} saved={saved} />
      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <GptLinksCard links={gptLinks} />
        <AddRecordCard category={category} links={gptLinks} />
      </section>
      <RecordsCard category={category} records={records} />
    </div>
  );
}

function GptLinksCard({ links }: { links: GptLink[] }) {
  return (
    <Card title="관련 GPT 링크" kicker="새 탭으로 열기">
      <div className="grid gap-3">
        {links.length === 0 ? (
          <EmptyState text="활성 GPT 링크가 없습니다. 설정에서 먼저 추가하세요." />
        ) : (
          links.map((link) => (
            <a
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-amber-200/40 hover:bg-amber-200/10"
              href={link.url}
              key={link.id}
              rel="noreferrer"
              target="_blank"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-stone-50">{link.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-400">{link.description}</p>
                </div>
                <span className="rounded-full border border-amber-200/20 bg-amber-200/10 px-3 py-1 text-xs font-semibold text-amber-100">
                  열기
                </span>
              </div>
            </a>
          ))
        )}
      </div>
    </Card>
  );
}

function AddRecordCard({ category, links }: { category: HubCategory; links: GptLink[] }) {
  return (
    <Card title="결과 기록 추가" kicker="수동 요약 저장">
      <form action={createHubRecord} className="grid gap-4">
        <input name="category" type="hidden" value={category} />
        <Field label="제목" name="title" required />
        <label className="grid gap-2 text-sm text-stone-300">
          <span>연결 GPT</span>
          <select
            className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-200/50"
            disabled={links.length === 0}
            name="gptId"
            required
          >
            {links.map((link) => (
              <option key={link.id} value={link.id}>
                {link.title}
              </option>
            ))}
          </select>
        </label>
        <Textarea label="처음 요청한 프롬프트" name="initialPrompt" required />
        <Textarea label="결과 요약" name="summary" required />
        <Field label="태그" name="tags" placeholder="쉼표로 구분: 일정,도쿄,초안" />
        <label className="flex items-center gap-2 text-sm text-stone-300">
          <input className="h-4 w-4 accent-amber-200" name="memoryCandidate" type="checkbox" />
          나중에 메모리 후보로 검토
        </label>
        <div className="flex justify-end">
          <button
            className="rounded-xl bg-amber-200 px-4 py-2 text-sm font-semibold text-stone-950 shadow-lg shadow-amber-950/20 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={links.length === 0}
            type="submit"
          >
            기록 저장
          </button>
        </div>
      </form>
    </Card>
  );
}

function RecordsCard({
  category,
  records,
}: {
  category: HubCategory;
  records: HubRecord[];
}) {
  return (
    <Card title="최근 기록" kicker="수동 GPT 결과 요약">
      <div className="grid gap-4">
        {records.length === 0 ? (
          <EmptyState text="아직 저장된 기록이 없습니다. GPT 작업 결과를 요약해서 남겨두세요." />
        ) : (
          records.map((record) => (
            <details
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
              key={record.id}
            >
              <summary className="cursor-pointer list-none">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="font-semibold text-stone-50">{record.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-stone-400">
                      {record.summary}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {record.tags.map((tag) => (
                        <span
                          className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-stone-300"
                          key={tag}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="shrink-0 text-left text-xs text-stone-500 sm:text-right">
                    <p>{formatDate(record.createdAt)}</p>
                    <p className="mt-1">{record.gptName}</p>
                    {record.memoryCandidate ? (
                      <p className="mt-1 text-amber-100">메모리 후보</p>
                    ) : null}
                  </div>
                </div>
              </summary>
              <div className="mt-5 grid gap-5 border-t border-white/10 pt-5 xl:grid-cols-[1fr_0.9fr]">
                <div className="space-y-4">
                  <ReadBlock label="초기 프롬프트" value={record.initialPrompt} />
                  <ReadBlock label="전체 요약" value={record.summary} />
                  <a
                    className="inline-flex rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-stone-100"
                    href={record.gptLink}
                    rel="noreferrer"
                    target="_blank"
                  >
                    연결 GPT 열기
                  </a>
                </div>
                <form action={updateHubRecord} className="grid gap-3">
                  <input name="category" type="hidden" value={category} />
                  <input name="id" type="hidden" value={record.id} />
                  <Field defaultValue={record.title} label="제목" name="title" required />
                  <Textarea
                    defaultValue={record.initialPrompt}
                    label="처음 요청한 프롬프트"
                    name="initialPrompt"
                    required
                  />
                  <Textarea defaultValue={record.summary} label="결과 요약" name="summary" required />
                  <Field defaultValue={record.tags.join(", ")} label="태그" name="tags" />
                  <Field defaultValue={record.status} label="상태" name="status" />
                  <label className="flex items-center gap-2 text-sm text-stone-300">
                    <input
                      className="h-4 w-4 accent-amber-200"
                      defaultChecked={record.memoryCandidate}
                      name="memoryCandidate"
                      type="checkbox"
                    />
                    메모리 후보
                  </label>
                  <button className="rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-stone-100" type="submit">
                    기록 수정
                  </button>
                </form>
              </div>
            </details>
          ))
        )}
      </div>
    </Card>
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

function Textarea({
  defaultValue,
  label,
  name,
  required,
}: {
  defaultValue?: string;
  label: string;
  name: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-2 text-sm text-stone-300">
      <span>{label}</span>
      <textarea
        className="min-h-28 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm leading-6 text-stone-100 outline-none focus:border-amber-200/50"
        defaultValue={defaultValue}
        name={name}
        required={required}
      />
    </label>
  );
}

function ReadBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">{label}</p>
      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-stone-300">{value}</p>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <p className="rounded-2xl border border-dashed border-white/12 bg-white/[0.02] px-4 py-5 text-sm text-stone-500">
      {text}
    </p>
  );
}

function StatusMessages({ error, saved }: { error?: string; saved?: string }) {
  if (error) {
    return (
      <p className="rounded-2xl border border-red-300/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
        저장하지 못했습니다. 필수 입력값을 확인하세요.
      </p>
    );
  }

  if (!saved) {
    return null;
  }

  const message = saved === "updated" ? "기록이 수정되었습니다." : "기록이 저장되었습니다.";

  return (
    <p className="rounded-2xl border border-emerald-300/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
      {message}
    </p>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
