"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  parseOptionalString,
  parseRequiredString,
} from "./file-utils";
import {
  createId,
  getGptLinks,
  getHubRecords,
  parseCategory,
  parseOptionalSortOrder,
  parseTags,
  writeGptLinks,
  writeHubRecord,
} from "./hub-data";
import type { GptLink, HubCategory, HubRecord } from "./types";

export async function saveGptLink(formData: FormData) {
  let destination = "/settings?saved=gpt";

  try {
    const id = parseOptionalString(formData, "id");
    const category = parseCategory(formData);
    const now = new Date().toISOString();
    const links = await getGptLinks();

    if (id) {
      let found = false;
      const nextLinks = links.map((link) => {
        if (link.id !== id) {
          return link;
        }

        found = true;
        return {
          ...link,
          category,
          description: parseOptionalString(formData, "description"),
          isActive: formData.get("isActive") === "on",
          sortOrder: parseOptionalSortOrder(formData),
          title: parseRequiredString(formData, "title"),
          updatedAt: now,
          url: parseRequiredString(formData, "url"),
        };
      });

      if (!found) {
        throw new Error("수정할 GPT 링크를 찾을 수 없습니다.");
      }

      await writeGptLinks(nextLinks);
    } else {
      const title = parseRequiredString(formData, "title");
      const link: GptLink = {
        category,
        createdAt: now,
        description: parseOptionalString(formData, "description"),
        id: createId(title),
        isActive: true,
        sortOrder: parseOptionalSortOrder(formData),
        title,
        updatedAt: now,
        url: parseRequiredString(formData, "url"),
      };
      await writeGptLinks([...links, link]);
    }

    revalidateHubPaths();
  } catch (error) {
    destination = `/settings?error=${encodeURIComponent(getErrorMessage(error))}`;
  }

  redirect(destination);
}

export async function setGptLinkActive(formData: FormData) {
  let destination = "/settings?saved=gpt_status";

  try {
    const id = parseRequiredString(formData, "id");
    const isActive = parseRequiredString(formData, "isActive") === "true";
    const now = new Date().toISOString();
    const links = await getGptLinks();
    let found = false;
    const nextLinks = links.map((link) => {
      if (link.id !== id) {
        return link;
      }

      found = true;
      return {
        ...link,
        isActive,
        updatedAt: now,
      };
    });

    if (!found) {
      throw new Error("상태를 바꿀 GPT 링크를 찾을 수 없습니다.");
    }

    await writeGptLinks(nextLinks);
    revalidateHubPaths();
  } catch (error) {
    destination = `/settings?error=${encodeURIComponent(getErrorMessage(error))}`;
  }

  redirect(destination);
}

export async function createHubRecord(formData: FormData) {
  let category: HubCategory = "content";
  let destination = "/content?saved=record";

  try {
    category = parseCategory(formData);
    destination = `/${category}?saved=record`;
    const gptId = parseRequiredString(formData, "gptId");
    const gpt = (await getGptLinks()).find((link) => link.id === gptId && link.isActive);

    if (!gpt || gpt.category !== category) {
      throw new Error("선택한 GPT 링크를 찾을 수 없습니다.");
    }

    const now = new Date().toISOString();
    const title = parseRequiredString(formData, "title");
    const record: HubRecord = {
      createdAt: now,
      gptId: gpt.id,
      gptLink: gpt.url,
      gptName: gpt.title,
      id: createId(title),
      initialPrompt: parseRequiredString(formData, "initialPrompt"),
      memoryCandidate: formData.get("memoryCandidate") === "on",
      status: "done",
      summary: parseRequiredString(formData, "summary"),
      tags: parseTags(parseOptionalString(formData, "tags")),
      title,
      type: "manual_gpt_result",
      updatedAt: now,
    };

    await writeHubRecord(category, record);
    revalidatePath(`/${category}`);
  } catch (error) {
    destination = `/${category}?error=${encodeURIComponent(getErrorMessage(error))}`;
  }

  redirect(destination);
}

export async function updateHubRecord(formData: FormData) {
  let category: HubCategory = "content";
  let destination = "/content?saved=record_update";

  try {
    category = parseCategory(formData);
    destination = `/${category}?saved=record_update`;
    const id = parseRequiredString(formData, "id");
    const records = await getHubRecords(category);
    const existing = records.find((record) => record.id === id);

    if (!existing) {
      throw new Error("수정할 기록을 찾을 수 없습니다.");
    }

    const updated: HubRecord = {
      ...existing,
      initialPrompt: parseRequiredString(formData, "initialPrompt"),
      memoryCandidate: formData.get("memoryCandidate") === "on",
      status: parseOptionalString(formData, "status") || existing.status,
      summary: parseRequiredString(formData, "summary"),
      tags: parseTags(parseOptionalString(formData, "tags")),
      title: parseRequiredString(formData, "title"),
      updatedAt: new Date().toISOString(),
    };

    await writeHubRecord(category, updated);
    revalidatePath(`/${category}`);
  } catch (error) {
    destination = `/${category}?error=${encodeURIComponent(getErrorMessage(error))}`;
  }

  redirect(destination);
}

function revalidateHubPaths() {
  revalidatePath("/settings");
  revalidatePath("/content");
  revalidatePath("/travel");
  revalidatePath("/education");
  revalidatePath("/health");
  revalidatePath("/investing");
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "저장 중 오류가 발생했습니다.";
}
