import type { ComponentType } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Locale } from "next-intl";
import { getTranslations } from "next-intl/server";
import SectionScreen from "@/components/SectionScreen";
import AboutStatement from "@/components/sections/about/AboutStatement";
import AboutTimeline from "@/components/sections/about/AboutTimeline";
import AboutWheel from "@/components/sections/about/AboutWheel";
import BrandingStatement from "@/components/sections/branding/BrandingStatement";
import BrochureCta from "@/components/sections/brochure/BrochureCta";
import BrochureDetails from "@/components/sections/brochure/BrochureDetails";
import BrochureServices from "@/components/sections/brochure/BrochureServices";
import HippoLabCards from "@/components/sections/hippolab/HippoLabCards";
import HippoLabPlayground from "@/components/sections/hippolab/HippoLabPlayground";
import LogofolioComp from "@/components/sections/Logofolio";
import PortfolioGrid from "@/components/sections/portfolio/PortfolioGrid";
import PortfolioStatement from "@/components/sections/portfolio/PortfolioStatement";
import SystemsFolder from "@/components/sections/systems-ia/SystemsFolder";
import SystemsCta from "@/components/sections/systems-ia/SystemsCta";
import SystemsStatement from "@/components/sections/systems-ia/SystemsStatement";
import WebDevStatement from "@/components/sections/web-development/WebDevStatement";
import WebDevSteps from "@/components/sections/web-development/WebDevSteps";
import WebDevStory from "@/components/sections/web-development/WebDevStory";
import { SECTIONS, getSection, type SectionSlug } from "@/lib/sections";
import { localizedMetadata } from "@/lib/seo";

// Contenido propio de cada sección, en orden, debajo de la pantalla de entrada
const SECTION_CONTENT: Partial<Record<SectionSlug, ComponentType[]>> = {
  "branding-design": [BrandingStatement, LogofolioComp],
  portfolio: [PortfolioStatement, PortfolioGrid],
  "web-development": [WebDevStatement, WebDevSteps, WebDevStory],
  "systems-ia": [SystemsStatement, SystemsFolder, SystemsCta],
  about: [AboutTimeline, AboutWheel, AboutStatement],
  brochure: [BrochureServices, BrochureDetails, BrochureCta],
  "hippo-lab": [HippoLabPlayground, HippoLabCards],
};

export const instant = false;

export function generateStaticParams() {
  return SECTIONS.map(({ slug }) => ({ section: slug }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/[section]">): Promise<Metadata> {
  const { locale, section } = await params;
  const data = getSection(section);
  if (!data) return { title: "Hippo" };
  const t = await getTranslations({ locale: locale as Locale, namespace: "Sections" });
  return { title: `${t(`${data.slug}.title`)} · Hippo`, ...localizedMetadata(`/${data.slug}`, locale as Locale) };
}

export default async function SectionPage({ params }: PageProps<"/[locale]/[section]">) {
  const { section } = await params;
  const data = getSection(section);
  if (!data) notFound();
  const content = SECTION_CONTENT[data.slug] ?? [];

  return (
    <main>
      <SectionScreen key={data.slug} section={data} />
      {content.map((Content, i) => (
        <Content key={i} />
      ))}
    </main>
  );
}
