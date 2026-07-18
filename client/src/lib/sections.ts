import { cacheLife, cacheTag } from "next/cache";
import { API_BASE, DEFAULT_SECTIONS } from "./constants";

export async function getSectionVisibility(): Promise<Record<string, boolean>> {
  "use cache";
  cacheLife("hours");
  cacheTag("sections");

  const visibility: Record<string, boolean> = {};
  try {
    const res = await fetch(`${API_BASE}/site-settings`);
    if (res.ok) {
      const json = await res.json();
      const settings = json.data || [];
      for (const s of settings) {
        if (s.key.startsWith("section_")) {
          visibility[s.key.replace("section_", "")] = s.value === "true";
        }
      }
    }
  } catch {}
  for (const key of DEFAULT_SECTIONS) {
    if (visibility[key] === undefined) visibility[key] = true;
  }
  return visibility;
}
