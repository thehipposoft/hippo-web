// Secciones del sitio (recuadros de <Start /> y páginas /[section]).
// `heroTitle`: título de la pantalla de sección; `\n` marca el corte de línea.
export const SECTIONS = [
  { slug: "branding-design", title: "Branding & Design", heroTitle: "Branding\n& Design" },
  { slug: "web-development", title: "Web Development", heroTitle: "Web\nDevelopment" },
  { slug: "hippo-lab", title: "Hippo Lab", heroTitle: "Hippo Lab" },
  { slug: "automation", title: "Automation", heroTitle: "Automation" },
  { slug: "contact", title: "Contact", heroTitle: "Contact" },
  { slug: "about", title: "About Us", heroTitle: "About Us" },
  { slug: "brochure", title: "Brochure", heroTitle: "Brochure" },
  { slug: "portfolio", title: "Portfolio", heroTitle: "Portfolio" },
] as const;

export type Section = (typeof SECTIONS)[number];
export type SectionSlug = Section["slug"];

export function getSection(slug: string): Section | undefined {
  return SECTIONS.find((section) => section.slug === slug);
}

export function getSectionHref(slug: SectionSlug): string {
  return `/${slug}`;
}
