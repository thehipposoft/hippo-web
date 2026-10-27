import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Locale } from "next-intl";
import { getTranslations } from "next-intl/server";
import LogofolioSingleComp from "@/components/sections/Logofolio/LogofolioSingleComp";
import NewLogofolioComp from "@/components/sections/Logofolio/NewLogofolioComp";
import { LOGOFOLIO, getLogofolioProject } from "@/lib/logofolio";
import { LOGOFOLIO_SECTION } from "@/lib/logofolioSlugs";

// Por ahora solo Branding & Design tiene subpáginas: las fichas del logofolio
const SECTION = LOGOFOLIO_SECTION;

export function generateStaticParams() {
  return LOGOFOLIO.map(({ slug }) => ({ section: SECTION, slug }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/[section]/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getLogofolioProject(slug);
  return { title: project ? `${project.data.name} · Logofolio · Hippo` : "Hippo" };
}

export default async function LogofolioProjectPage({ params }: PageProps<"/[locale]/[section]/[slug]">) {
  const { locale, section, slug } = await params;
  const project = section === SECTION ? getLogofolioProject(slug) : undefined;
  if (!project) notFound();

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
    </main>
  );
}
