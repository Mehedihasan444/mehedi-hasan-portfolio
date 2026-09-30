import { cacheLife, cacheTag } from "next/cache";
import { API_BASE, DEFAULT_SECTIONS } from "./constants";

type SiteSetting = { key: unknown; value: unknown };

export async function getSectionVisibility(): Promise<Record<string, boolean>> {
  "use cache";
  cacheLife("hours");
  cacheTag("sections");

  const visibility: Record<string, boolean> = {};
  try {
    const res = await fetch(`${API_BASE}/site-settings`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const json: unknown = await res.json();
      const settings: unknown =
        json && typeof json === "object" && "data" in json ? (json as { data: unknown }).data : [];
      if (Array.isArray(settings)) {
        for (const s of settings as SiteSetting[]) {
          if (typeof s?.key !== "string") continue;
          if (!s.key.startsWith("section_")) continue;
          const raw = s.value;
          visibility[s.key.replace("section_", "")] = raw === true || raw === "true";
        }
      }
    }
  } catch (e) {
    console.warn("getSectionVisibility failed, defaulting visible", e);
  }
  for (const key of DEFAULT_SECTIONS) {
    if (visibility[key] === undefined) visibility[key] = true;
  }
  return visibility;
}
