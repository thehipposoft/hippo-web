import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Locale } from "next-intl";
import { getTranslations } from "next-intl/server";
import LogofolioSingleComp from "@/components/sections/Logofolio/LogofolioSingleComp";
import NewLogofolioComp from "@/components/sections/Logofolio/NewLogofolioComp";
import PortfolioSingleProyect from "@/components/sections/portfolio/PortfolioSingleProyect";
import SectionMenu from "@/components/SectionMenu";
import { LOGOFOLIO, getLogofolioProject } from "@/lib/logofolio";
import { LOGOFOLIO_SECTION } from "@/lib/logofolioSlugs";
import { getPortfolioSingleProject } from "@/lib/portfolioProjects";
import { PORTFOLIO_SECTION, PORTFOLIO_SINGLE_SLUGS } from "@/lib/portfolioSlugs";
import { getSection } from "@/lib/sections";
import { localizedMetadata } from "@/lib/seo";

// Subpáginas: las fichas del logofolio (Branding & Design) y los proyectos del portfolio con
// página propia (<PortfolioSingleProyect />)
const SECTION = LOGOFOLIO_SECTION;

export function generateStaticParams() {
  return [
    ...LOGOFOLIO.map(({ slug }) => ({ section: SECTION, slug })),
    ...PORTFOLIO_SINGLE_SLUGS.map((slug) => ({ section: PORTFOLIO_SECTION, slug })),
  ];
}

export async function generateMetadata({ params }: PageProps<"/[locale]/[section]/[slug]">): Promise<Metadata> {
  const { locale, section, slug } = await params;
  if (section === PORTFOLIO_SECTION) {
    const single = getPortfolioSingleProject(slug);
    if (!single) return { title: "Hippo" };
    const tSingle = await getTranslations({ locale: locale as Locale, namespace: "Portfolio" });
    const tMeta = await getTranslations({ locale: locale as Locale, namespace: "Metadata" });
    return {
      title: `${tSingle(`single.projects.${single.slug}.title`)} · ${tMeta("portfolio")} · Hippo`,
      ...localizedMetadata(`/${PORTFOLIO_SECTION}/${single.slug}`, locale as Locale),
    };
  }
  const project = getLogofolioProject(slug);
  if (!project) return { title: "Hippo" };
  const t = await getTranslations({ locale: locale as Locale, namespace: "Metadata" });
  return {
    title: `${project.data.name} · ${t("logofolio")} · Hippo`,
    ...localizedMetadata(`/${SECTION}/${project.slug}`, locale as Locale),
  };
}

export default async function SectionSubpage({ params }: PageProps<"/[locale]/[section]/[slug]">) {
  const { locale, section, slug } = await params;

  // Portfolio: proyecto con página propia
  if (section === PORTFOLIO_SECTION) {
    const single = getPortfolioSingleProject(slug);
    const portfolio = getSection(section);
    if (!single || !portfolio) notFound();
    return (
      <main>
        <PortfolioSingleProyect project={single} />
        <SectionMenu section={portfolio} atSectionRoot={false} />
      </main>
    );
  }

  const project = section === SECTION ? getLogofolioProject(slug) : undefined;
  const parent = getSection(section);
  if (!project || !parent) notFound();

  // Textos de la ficha (Logofolio.projects.<slug>), sumados a los datos no traducibles
  const t = await getTranslations({ locale: locale as Locale, namespace: "Logofolio.projects" });
  const texts = {
    legend: t(`${project.slug}.legend`),
    country: t(`${project.slug}.country`),
    date: t(`${project.slug}.date`),
    description: t.raw(`${project.slug}.description`) as string[],
    concept: t.raw(`${project.slug}.concept`) as string[],
  };

  return (
    <main>
      {project.layout === "single" ? (
        <LogofolioSingleComp data={{ ...project.data, ...texts }} />
      ) : (
        <NewLogofolioComp data={{ ...project.data, ...texts }} />
      )}
      {/* Menú de secciones, igual que en el resto del sitio */}
      <SectionMenu section={parent} atSectionRoot={false} />
    </main>
  );
}
