import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Todo menos /api, /_next, /_vercel y archivos con extensión (favicon, imágenes, sitemap.xml…)
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
