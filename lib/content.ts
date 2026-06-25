import { createClient } from "@/lib/supabase/server";

export type ContentMap = Record<string, string>;

/**
 * Loads every content block into a simple { key: value } map for the public site.
 * Empty values fall back to whatever default the component passes to `c()`.
 */
export async function getContent(): Promise<ContentMap> {
  const map: ContentMap = {};
  try {
    const supabase = createClient();
    const { data } = await supabase.from("content_blocks").select("key,value");
    for (const row of data ?? []) {
      if (row.value != null && row.value !== "") map[row.key] = row.value;
    }
  } catch {
    // Backend unreachable / env not configured — fall back to component defaults
    // rather than crashing the page.
  }
  return map;
}

/** Read a content value with a fallback default. */
export function c(map: ContentMap, key: string, fallback = ""): string {
  return map[key] ?? fallback;
}

/** Resolve a stored image value to a usable URL (empty string if none). */
export function img(map: ContentMap, key: string): string {
  return map[key] ?? "";
}
