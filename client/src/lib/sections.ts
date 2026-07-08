const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

const defaultSections = [
  "hero",
  "about",
  "skills",
  "experience",
  "projects",
  "education",
  "certifications",
  "achievements",
  "github",
  "testimonials",
  "blog",
  "contact",
];

export async function getSectionVisibility(): Promise<Record<string, boolean>> {
  const visibility: Record<string, boolean> = {};
  try {
    const res = await fetch(`${API_BASE}/site-settings`, { cache: "no-store" });
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
  for (const key of defaultSections) {
    if (visibility[key] === undefined) visibility[key] = true;
  }
  return visibility;
}
