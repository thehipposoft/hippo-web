import { defineRouting } from "next-intl/routing";

// El idioma lo define solo la URL: español sin prefijo (/, /branding-design), inglés con /en.
// Sin detección por navegador ni cookie (el cambio de idioma es solo con el switcher).
// Los slugs de sección y de logofolio son los mismos en ambos idiomas (sin `pathnames`).
export const routing = defineRouting({
  locales: ["es", "en"],
  defaultLocale: "es",
  localePrefix: "as-needed",
  localeDetection: false,
  localeCookie: false,
});
