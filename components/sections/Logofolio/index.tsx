import LogofolioLayout from "./LogofolioLayout";
import { GRID_CONTENT_INSET, GRID_LINE_LEFT, GRID_LINE_RIGHT } from "@/lib/sectionGrid";

// Líneas de fondo: continúan las verticales de las pantallas anteriores
const LINES = [GRID_LINE_LEFT, GRID_LINE_RIGHT];

/** Branding & Design · logofolio: logos de marcas que diseñamos. */
export default function LogofolioComp() {
  return (
    <section className="relative flex h-svh w-full items-center overflow-hidden bg-white">
      {LINES.map((className) => (
        <span key={className} aria-hidden className={`absolute inset-y-0 w-px bg-brand-blue/50 ${className}`} />
      ))}

      <h2 className="sr-only">Logofolio</h2>
      <div className={`absolute inset-y-0 ${GRID_CONTENT_INSET} flex items-center justify-center`}>
        <div className="w-[min(60vw,72rem)]">
          <LogofolioLayout />
        </div>
      </div>
    </section>
  );
}
