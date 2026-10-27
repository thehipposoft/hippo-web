import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { LOGOFOLIO_SECTION, LOGOFOLIO_SLUGS } from "./lib/logofolioSlugs";
import { SECTIONS } from "./lib/sections";

const intl = createMiddleware(routing);

const SECTION_SLUGS = new Set<string>(SECTIONS.map(({ slug }) => slug));
const FICHA_SLUGS = new Set<string>(LOGOFOLIO_SLUGS);

/**
 * ¿La ruta (sin locale) existe? Con cacheComponents, un slug no listado se sirve con la página
 * estática genérica de la ruta y el notFound() llega después, con status 200. Validarlo acá
 * permite responder un 404 real.
 */
function isKnownPath(segments: string[]): boolean {
  if (segments.length === 0) return true;
  const [section, slug, ...rest] = segments;
  if (!SECTION_SLUGS.has(section)) return false;
  if (slug === undefined) return true;
  return rest.length === 0 && section === LOGOFOLIO_SECTION && FICHA_SLUGS.has(slug);
}

export default function proxy(request: NextRequest) {
  const segments = request.nextUrl.pathname.split("/").filter(Boolean);
  const [first, ...afterLocale] = segments;
  const hasPrefix = (routing.locales as readonly string[]).includes(first);
  const locale = hasPrefix ? first : routing.defaultLocale;
  const path = hasPrefix ? afterLocale : segments;

  if (!isKnownPath(path)) {
    // Cae en app/[locale]/[...rest] (3 segmentos: no coincide con [section] ni [section]/[slug]) → 404
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/_not-found/_/_`;
    return NextResponse.rewrite(url);
  }

  return intl(request);
}

export const config = {
  // Todo menos /api, /_next, /_vercel y archivos con extensión (favicon, imágenes, sitemap.xml…)
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
