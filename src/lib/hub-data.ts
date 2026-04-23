import {
  ensureDirectory,
  fileExists,
  listFiles,
  parseOptionalString,
  parseRequiredString,
  readJsonFile,
  writeJsonFile,
} from "./file-utils";
import type { GptLink, HubCategory, HubRecord } from "./types";

export const hubCategories: HubCategory[] = [
  "travel",
  "content",
  "education",
  "health",
  "investing",
];

const gptLinksPath = "config/gpt_links.json";

export async function ensureHubStorage() {
  if (!(await fileExists(gptLinksPath))) {
    const now = new Date().toISOString();
    const initialLinks: GptLink[] = [
      {
        category: "investing",
        createdAt: now,
        description: "시장 분석과 포트폴리오 점검을 위한 링크",
        id: "invest-gpt",
        isActive: true,
        sortOrder: 10,
        title: "투자 분석 GPT",
        updatedAt: now,
        url: "https://chatgpt.com/",
      },
      {
        category: "content",
        createdAt: now,
        description: "쇼츠, 분석글, 아이디어 정리를 위한 링크",
        id: "content-gpt",
        isActive: true,
        sortOrder: 20,
        title: "콘텐츠 작성 GPT",
        updatedAt: now,
        url: "https://chatgpt.com/",
      },
      {
        category: "travel",
        createdAt: now,
        description: "여행 일정과 아이디어 정리를 위한 링크",
        id: "travel-gpt",
        isActive: true,
        sortOrder: 30,
        title: "여행 플래너 GPT",
        updatedAt: now,
        url: "https://chatgpt.com/",
      },
    ];
    await writeJsonFile(gptLinksPath, initialLinks);
  }

  for (const category of hubCategories) {
    await ensureDirectory(recordDirectory(category));
  }
}

export async function getGptLinks() {
  await ensureHubStorage();
  const links = await readJsonFile<GptLink[]>(gptLinksPath);
  return sortGptLinks(links);
}

export async function writeGptLinks(links: GptLink[]) {
  await writeJsonFile(gptLinksPath, sortGptLinks(links));
}

export async function getActiveGptLinks(category?: HubCategory) {
  const links = await getGptLinks();
  return links.filter((link) => link.isActive && (!category || link.category === category));
}

export async function getHubRecords(category: HubCategory) {
  await ensureHubStorage();
  const files = (await listFiles(recordDirectory(category))).filter((file) =>
    file.endsWith(".json"),
  );
  const records = await Promise.all(
    files.map((file) => readJsonFile<HubRecord>(`${recordDirectory(category)}/${file}`)),
  );

  return records.toSorted(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function writeHubRecord(category: HubCategory, record: HubRecord) {
  await ensureHubStorage();
  await writeJsonFile(`${recordDirectory(category)}/${record.id}.json`, record);
}

export function createId(seed: string) {
  const slug =
    seed
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9가-힣]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || "record";
  return `${slug}-${Date.now().toString(36)}`;
}

export function parseTags(raw: string) {
  return raw
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function parseCategory(formData: FormData, key = "category") {
  const category = parseRequiredString(formData, key);

  if (!hubCategories.includes(category as HubCategory)) {
    throw new Error("지원하지 않는 카테고리입니다.");
  }

  return category as HubCategory;
}

export function parseOptionalSortOrder(formData: FormData) {
  const raw = parseOptionalString(formData, "sortOrder");

  if (!raw) {
    return 100;
  }

  const value = Number(raw);

  if (!Number.isFinite(value)) {
    throw new Error("정렬 순서는 숫자여야 합니다.");
  }

  return value;
}

export function recordDirectory(category: HubCategory) {
  return `records/${category}`;
}

function sortGptLinks(links: GptLink[]) {
  return links.toSorted((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title));
}
