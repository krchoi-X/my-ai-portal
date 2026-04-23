import { access, appendFile, mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export const dataRoot = path.join(process.cwd(), "app-data");

export async function readJsonFile<T>(relativePath: string): Promise<T> {
  const file = await readFile(resolveDataPath(relativePath), "utf8");
  return JSON.parse(file) as T;
}

export async function writeJsonFile<T>(relativePath: string, data: T) {
  const serialized = `${JSON.stringify(data, null, 2)}\n`;
  const filePath = resolveDataPath(relativePath);
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, serialized, "utf8");
}

export async function appendCsvRow(relativePath: string, values: Array<string | number>) {
  const row = `${values.map(serializeCsvValue).join(",")}\n`;
  await appendFile(resolveDataPath(relativePath), row, "utf8");
}

export async function ensureCsvFile(relativePath: string, headerColumns: string[]) {
  const filePath = resolveDataPath(relativePath);

  try {
    await access(filePath);
  } catch {
    await writeFile(filePath, `${headerColumns.map(serializeCsvValue).join(",")}\n`, "utf8");
  }
}

export async function ensureDirectory(relativePath: string) {
  await mkdir(resolveDataPath(relativePath), { recursive: true });
}

export async function listFiles(relativePath: string) {
  try {
    return await readdir(resolveDataPath(relativePath));
  } catch {
    return [];
  }
}

export async function fileExists(relativePath: string) {
  try {
    await access(resolveDataPath(relativePath));
    return true;
  } catch {
    return false;
  }
}

export async function readCsvFile(relativePath: string) {
  const file = await readFile(resolveDataPath(relativePath), "utf8");
  return parseCsvText(file);
}

export function parseCsvText(csvText: string) {
  const lines = csvText.trim().split(/\r?\n/).filter(Boolean);

  if (lines.length === 0) {
    return [];
  }

  const headers = parseCsvLine(lines[0]);

  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]));
  });
}

export function parseRequiredString(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "").trim();

  if (!value) {
    throw new Error(`${key} 값이 필요합니다.`);
  }

  return value;
}

export function parseOptionalString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export function parseRequiredNumber(formData: FormData, key: string) {
  const raw = parseRequiredString(formData, key);
  const value = parseNumber(raw);

  if (!Number.isFinite(value)) {
    throw new Error(`${key} 값은 숫자여야 합니다.`);
  }

  return value;
}

export function parseNumber(value: unknown) {
  const normalized = String(value ?? "").replaceAll(",", "").trim();
  return Number(normalized);
}

function resolveDataPath(relativePath: string) {
  const resolved = path.resolve(dataRoot, relativePath);

  if (!resolved.startsWith(dataRoot)) {
    throw new Error("app-data 밖의 파일은 수정할 수 없습니다.");
  }

  return resolved;
}

function serializeCsvValue(value: string | number) {
  const stringValue = String(value);

  if (/[",\n\r]/.test(stringValue)) {
    return `"${stringValue.replaceAll('"', '""')}"`;
  }

  return stringValue;
}

function parseCsvLine(line: string) {
  const values: string[] = [];
  let current = "";
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"' && quoted && next === '"') {
      current += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      values.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  values.push(current);
  return values;
}
