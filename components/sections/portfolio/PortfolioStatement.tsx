"use client";

import { useRef } from "react";
import { createPortfolioStatement } from "@/animations/portfolio/statement";
import { GRID_CONTENT_INSET, GRID_LINE_LEFT, GRID_LINE_RIGHT } from "@/lib/sectionGrid";
import { useGsap } from "@/lib/useGsap";
import { useTranslations } from "next-intl";

// Líneas de fondo: las verticales continúan las de <SectionHero />
const LINES = [
  `inset-y-0 ${GRID_LINE_LEFT} w-px`,
  `inset-y-0 ${GRID_LINE_RIGHT} w-px`,
  "inset-x-0 top-[17%] h-px",
  `${GRID_LINE_LEFT} right-0 top-[86%] h-px`,
]

/**
 * Portfolio · pantalla 2: la frase en tres "capas" que se pliegan con el scroll como un acordeón
 * (animations/portfolio/statement.ts). Cada capa recorta su contenido (overflow-hidden) y tiene el
 * alto justo para sus letras con colas (g, p, y); el margen negativo las pega entre sí.
 */
export default function PortfolioStatement() {
  const t = useTranslations("Portfolio");
  const lines = t.raw("statement") as string[];
  const rootRef = useRef<HTMLElement>(null);

  useGsap((root) => createPortfolioStatement(root), rootRef);

  return (
    <section ref={rootRef} className="relative h-svh w-full overflow-hidden bg-brand-black">
      {LINES.map((className) => (
        <span key={className} aria-hidden className={`absolute bg-brand-blue/50 ${className}`} />
      ))}

      {/* Centrado en el recuadro que forman las líneas (verticales compartidas + horizontales 17% / 86%) */}
      <div className={`absolute inset-y-[17%] ${GRID_CONTENT_INSET} flex items-center justify-center`}>
        <p className="text-center font-display text-[clamp(2.25rem,5.6vw,6.5rem)] font-bold text-white">
          {lines.map((line, i) => (
            <span
              key={line}
              data-portfolio-layer
              className={`block overflow-hidden leading-[1.12] md:whitespace-nowrap ${i < lines.length - 1 ? "-mb-[0.22em]" : ""}`}
            >
              {line}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
