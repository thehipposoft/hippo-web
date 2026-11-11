import { PORTFOLIO_SINGLE_SLUGS, type PortfolioSingleSlug } from "@/lib/portfolioSlugs";

// Proyectos del portfolio con página propia (<PortfolioSingleProyect />). Acá solo lo no traducible;
// los textos están en messages/*.json (Portfolio.single.projects.<slug>), con una entrada por capa
// en el mismo orden que `layers`.

export type PortfolioLayer = {
  image: { src: string; width: number; height: number };
  /** cover: la imagen llena su recuadro (fotos, mockups con fondo); contain: entra completa (recortes) */
  fit: "cover" | "contain";
  year: string;
};

export type PortfolioSingleProject = {
  slug: PortfolioSingleSlug;
  /** slug del proyecto en la grilla del portfolio (components/sections/portfolio/constants.tsx) */
  gridSlug: string;
  logo: { src: string; width: number; height: number };
  /** Capas del proyecto, una card cada una (la primera es la presentación del cliente) */
  layers: PortfolioLayer[];
};

export const PORTFOLIO_SINGLE_PROJECTS: Record<PortfolioSingleSlug, PortfolioSingleProject> = {
  reynoso: {
    slug: "reynoso",
    gridSlug: "Reynoso",
    logo: { src: "/assets/images/portfolio/reynoso-logo.webp", width: 4096, height: 1712 },
    layers: [
      // Misma imagen que la card de la grilla del portfolio
      { image: { src: "/assets/images/portfolio/reynoso-mock.jpg", width: 1728, height: 1117 }, fit: "cover", year: "2025" },
      { image: { src: "/assets/images/portfolio/portfolio-reynoso-1.webp", width: 1728, height: 1019 }, fit: "cover", year: "2026" },
      { image: { src: "/assets/images/portfolio/portfolio-reynoso-2.webp", width: 666, height: 1000 }, fit: "contain", year: "2026" },
      { image: { src: "/assets/images/portfolio/portfolio-reynoso-3.webp", width: 1080, height: 1350 }, fit: "cover", year: "2026" },
    ],
  },
};

export const getPortfolioSingleProject = (slug: string): PortfolioSingleProject | undefined =>
  (PORTFOLIO_SINGLE_SLUGS as readonly string[]).includes(slug)
    ? PORTFOLIO_SINGLE_PROJECTS[slug as PortfolioSingleSlug]
    : undefined;

/** gridSlug → slug de la página propia (para que la grilla enlace a ella) */
export const PORTFOLIO_SINGLE_BY_GRID_SLUG: Record<string, PortfolioSingleSlug> = Object.fromEntries(
  Object.values(PORTFOLIO_SINGLE_PROJECTS).map((project) => [project.gridSlug, project.slug]),
);
