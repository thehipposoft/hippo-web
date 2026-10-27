// Slugs de las fichas del logofolio (/branding-design/[slug]). Archivo liviano a propósito:
// lo usa proxy.ts para validar rutas sin cargar los datos ni componentes del logofolio.
export const LOGOFOLIO_SLUGS = [
  "rock-steady-digital",
  "inspir-performance",
  "diversity-employment",
  "lumina-technologies",
  "destino-salta",
  "perri",
] as const;

export type LogofolioSlug = (typeof LOGOFOLIO_SLUGS)[number];

/** Sección que tiene subpáginas (las fichas) */
export const LOGOFOLIO_SECTION = "branding-design";
