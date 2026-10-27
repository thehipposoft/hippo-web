import type { Metadata } from "next";
import { notFound } from "next/navigation";
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
  return { title: project ? `${project.data.name} · Logofolio · HippoSoft` : "HippoSoft" };
}

export default async function LogofolioProjectPage({ params }: PageProps<"/[locale]/[section]/[slug]">) {
  const { section, slug } = await params;
  const project = section === SECTION ? getLogofolioProject(slug) : undefined;
  if (!project) notFound();

  return (
    <main>
      {project.layout === "single" ? (
        <LogofolioSingleComp data={project.data} />
      ) : (
        <NewLogofolioComp data={project.data} />
      )}
    </main>
  );
}
