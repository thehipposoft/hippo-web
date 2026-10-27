import type { Metadata } from "next";
import type { Locale } from "next-intl";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

// URL pública del sitio (canonical, alternates, sitemap). Se puede pisar con NEXT_PUBLIC_SITE_URL.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.thehipposoft.com").replace(/\/$/, "");

const OG_LOCALE: Record<Locale, string> = { es: "es_AR", en: "en_US" };

/** Ruta de `href` (sin locale, p. ej. "/about") en un idioma: es sin prefijo, en con /en */
export function localizedPath(href: string, locale: Locale): string {
  return getPathname({ href, locale });
}

/** canonical + alternates (es, en, x-default → sin prefijo) + openGraph.locale para una ruta */
export function localizedMetadata(href: string, locale: Locale): Pick<Metadata, "alternates" | "openGraph"> {
  return {
    alternates: {
      canonical: localizedPath(href, locale),
      languages: {
        ...Object.fromEntries(routing.locales.map((l) => [l, localizedPath(href, l)])),
        "x-default": localizedPath(href, routing.defaultLocale),
      },
    },
    openGraph: {
      locale: OG_LOCALE[locale],
      alternateLocale: routing.locales.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
      url: localizedPath(href, locale),
      siteName: "Hippo",
    },
  };
}
