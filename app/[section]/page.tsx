import type { ComponentType } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SectionHero from "@/components/SectionHero";
import BrandingStatement from "@/components/sections/branding/BrandingStatement";
import LogofolioComp from "@/components/sections/Logofolio";
import { SECTIONS, getSection, type SectionSlug } from "@/lib/sections";

// Contenido propio de cada sección, en orden, debajo de la pantalla de entrada
const SECTION_CONTENT: Partial<Record<SectionSlug, ComponentType[]>> = {
  "branding-design": [BrandingStatement, LogofolioComp],
};

export const instant = false;

export function generateStaticParams() {
  return SECTIONS.map(({ slug }) => ({ section: slug }));
}

export async function generateMetadata({ params }: PageProps<"/[section]">): Promise<Metadata> {
  const { section } = await params;
  const data = getSection(section);
  return { title: data ? `${data.title} · HippoSoft` : "HippoSoft" };
}

export default async function SectionPage({ params }: PageProps<"/[section]">) {
  const { section } = await params;
  const data = getSection(section);
  if (!data) notFound();
  const content = SECTION_CONTENT[data.slug] ?? [];

  return (
    <main>
      <SectionHero key={data.slug} section={data} />
      {content.map((Content, i) => (
        <Content key={i} />
      ))}
    </main>
  );
}
