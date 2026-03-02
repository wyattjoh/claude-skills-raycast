import { readFileSync } from "node:fs";
import matter from "gray-matter";

export interface MarkdownEntry {
  name: string;
  path: string;
  body: string;
  keywords: string[];
}

export function extractKeywords(
  data: Record<string, unknown>,
  content: string,
): string[] {
  const keywords: string[] = [];
  for (const value of Object.values(data)) {
    if (Array.isArray(value)) {
      keywords.push(...value.map(String));
    } else if (typeof value === "string") {
      keywords.push(...value.split(/\s+/));
    }
  }
  keywords.push(...content.split(/\s+/));
  return keywords;
}

export function parseMarkdownFile(
  filePath: string,
): { data: Record<string, unknown>; content: string } | null {
  try {
    const raw = readFileSync(filePath, "utf-8");
    return matter(raw);
  } catch {
    return null;
  }
}
