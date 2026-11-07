"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { createHeroLinesDraw } from "@/animations/sectionHero";
import { takeHeroArrival } from "@/lib/heroArrival";
import { useGsap } from "@/lib/useGsap";
import { GRID_LINE_LEFT, GRID_LINE_RIGHT } from "@/lib/sectionGrid";

// Grilla de líneas de fondo. El botón de menú ocupa la primera columna (left-0 + size-14),
// por eso la primera vertical y las horizontales internas arrancan en left-14.
// El origen de cada línea es desde dónde se dibuja.
const LINES = [
  // ── Mobile: simétricas; enmarcan el título (30%–70%) y dejan el botón del menú arriba al centro
  { kind: "v", className: "inset-y-0 left-[5.5%] w-px origin-top md:hidden" },
  { kind: "v", className: "inset-y-0 left-[94.5%] w-px origin-bottom md:hidden" },
  { kind: "v", className: "top-0 h-[30%] left-1/2 w-px origin-top md:hidden" },
  { kind: "v", className: "top-[70%] bottom-0 left-1/2 w-px origin-bottom md:hidden" },
  { kind: "h", className: "inset-x-0 top-14 h-px origin-right md:hidden" },
  { kind: "h", className: "left-[5.5%] right-[5.5%] top-[30%] h-px origin-left md:hidden" },
  { kind: "h", className: "left-[5.5%] right-[5.5%] top-[70%] h-px origin-right md:hidden" },
  { kind: "h", className: "inset-x-0 bottom-14 h-px origin-left md:hidden" },
  // ── Desktop
  { kind: "v", className: `hidden inset-y-0 ${GRID_LINE_LEFT} w-px origin-top md:block` },
  { kind: "v", className: "hidden top-0 h-[16%] left-[37%] w-px origin-top md:block" },
  { kind: "v", className: "hidden top-[75%] bottom-0 left-[37%] w-px origin-bottom md:block" },
  { kind: "v", className: "hidden inset-y-0 left-[56.5%] w-px origin-bottom md:block" },
  { kind: "v", className: "hidden inset-y-0 left-[63%] w-px origin-top md:block" },
  { kind: "v", className: `hidden top-[60%] bottom-0 ${GRID_LINE_RIGHT} w-px origin-bottom md:block` },
  { kind: "h", className: "hidden inset-x-0 top-[16%] h-px origin-right md:block" },
  { kind: "h", className: `hidden ${GRID_LINE_LEFT} right-0 top-[30%] h-px origin-left md:block` },
  { kind: "h", className: `hidden ${GRID_LINE_LEFT} right-0 top-[60%] h-px origin-right md:block` },
  { kind: "h", className: `hidden ${GRID_LINE_LEFT} right-0 top-[75%] h-px origin-left md:block` },
] as const;

type SectionHeroLinesProps = {
  /** false cuando otra animación se encarga de dibujarlas (capa de transición) */
  intro: boolean;
};

export default function SectionHeroLines({ intro }: SectionHeroLinesProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGsap(
    (container) => {
      if (!intro) return;
      // Llegando desde la transición ya están dibujadas
      if (takeHeroArrival()) {
        gsap.set(container, { autoAlpha: 1 });
        return;
      }
      const tl = createHeroLinesDraw(container);
      return () => tl.kill();
    },
    ref,
  );

  return (
    <div ref={ref} data-hero-lines aria-hidden className="invisible absolute inset-0">
      {LINES.map((line) => (
        <span
          key={line.className}
          data-hero-line={line.kind}
          className={`absolute bg-brand-blue/50 ${line.className}`}
        />
      ))}
    </div>
  );
}
