import LogofolioLayout from "./LogofolioLayout";
import { GRID_LINE_LEFT, GRID_LINE_RIGHT } from "@/lib/sectionGrid";
import { useTranslations } from "next-intl";
import { LOGOFOLIO_ANCHOR } from "@/lib/logofolioSlugs";

// Líneas de fondo: continúan las verticales de las pantallas anteriores
const LINES = [GRID_LINE_LEFT, GRID_LINE_RIGHT];

/** Branding & Design · logofolio: logos de marcas que diseñamos. */
export default function LogofolioComp() {
  const t = useTranslations("Logofolio.ui");
  return (
    <section id={LOGOFOLIO_ANCHOR} className="relative flex min-h-svh w-full items-center overflow-hidden bg-white py-[10svh] md:h-svh md:py-0">
      {LINES.map((className) => (
        <span key={className} aria-hidden className={`absolute inset-y-0 w-px bg-brand-blue/50 ${className}`} />
      ))}

      <h2 className="sr-only">{t("label")}</h2>
      {/* Mobile: en el flujo, entre las líneas; desktop: centrado entre las dos verticales (w-auto: con w-full se pasaba de la derecha) */}
      <div className={`relative w-full px-[calc(5.5%_+_1.25rem)] md:absolute md:w-auto md:inset-y-0 md:left-14 md:right-[5.5%] md:px-0 md:flex md:items-center md:justify-center`}>
        <div className="w-full md:w-[90%] lg:w-[min(68vw,84rem)]">
          <LogofolioLayout />
        </div>
      </div>
    </section>
  );
}
