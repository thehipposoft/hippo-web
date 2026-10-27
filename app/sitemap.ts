import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { LOGOFOLIO_SECTION, LOGOFOLIO_SLUGS } from "@/lib/logofolioSlugs";
import { SECTIONS } from "@/lib/sections";
import { SITE_URL, localizedPath } from "@/lib/seo";

// Una entrada por URL y por idioma, cada una con sus alternates (es sin prefijo, en con /en)
export default function sitemap(): MetadataRoute.Sitemap {
  const hrefs = [
    "/",
    ...SECTIONS.map(({ slug }) => `/${slug}`),
    ...LOGOFOLIO_SLUGS.map((slug) => `/${LOGOFOLIO_SECTION}/${slug}`),
  ];

  return hrefs.flatMap((href) => {
    const languages = Object.fromEntries(routing.locales.map((l) => [l, `${SITE_URL}${localizedPath(href, l)}`]));
    return routing.locales.map((locale) => ({
      url: `${SITE_URL}${localizedPath(href, locale)}`,
      alternates: { languages: { ...languages, "x-default": languages[routing.defaultLocale] } },
    }));
  });
}
