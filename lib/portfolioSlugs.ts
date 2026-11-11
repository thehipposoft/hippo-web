// Slugs de los proyectos del portfolio con página propia (/portfolio/[slug], <PortfolioSingleProyect />).
// Archivo liviano a propósito: lo usan proxy.ts y el sitemap sin cargar datos ni componentes.
export const PORTFOLIO_SINGLE_SLUGS = ["reynoso"] as const;

export type PortfolioSingleSlug = (typeof PORTFOLIO_SINGLE_SLUGS)[number];

/** Sección que contiene estas páginas */
export const PORTFOLIO_SECTION = "portfolio";

export const isPortfolioSingleSlug = (slug: string): slug is PortfolioSingleSlug =>
  (PORTFOLIO_SINGLE_SLUGS as readonly string[]).includes(slug);
