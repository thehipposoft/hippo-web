// Secciones del sitio (recuadros de <Start /> y páginas /[section]). Los slugs son los mismos en
// ambos idiomas; los textos están en messages/*.json: Sections.<slug>.title y .heroTitle
// (`\n` marca el corte de línea del título de la pantalla de sección).
export const SECTIONS = [
  { slug: "branding-design" },
  { slug: "web-development" },
  { slug: "hippo-lab" },
  { slug: "systems-ia" },
  { slug: "contact" },
  { slug: "about" },
  { slug: "brochure" },
  { slug: "portfolio" },
] as const;

export type Section = (typeof SECTIONS)[number];
export type SectionSlug = Section["slug"];

export function getSection(slug: string): Section | undefined {
  return SECTIONS.find((section) => section.slug === slug);
}

export function getSectionHref(slug: SectionSlug): string {
  return `/${slug}`;
}
