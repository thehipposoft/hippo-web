"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { createHeroLinesDraw } from "@/animations/sectionHero";
import { takeHeroArrival } from "@/lib/heroArrival";
import { useGsap } from "@/lib/useGsap";

// Grilla de líneas de fondo. El botón de menú ocupa la primera columna (left-0 + size-14),
// por eso la primera vertical y las horizontales internas arrancan en left-14.
// El origen de cada línea es desde dónde se dibuja.
const LINES = [
  // Verticales
  { kind: "v", className: "inset-y-0 left-14 w-px origin-top" },
  { kind: "v", className: "top-0 h-[16%] left-[37%] w-px origin-top" },
  { kind: "v", className: "top-[75%] bottom-0 left-[37%] w-px origin-bottom" },
  { kind: "v", className: "inset-y-0 left-[56.5%] w-px origin-bottom" },
  { kind: "v", className: "inset-y-0 left-[63%] w-px origin-top" },
  { kind: "v", className: "top-[60%] bottom-0 left-[94.5%] w-px origin-bottom" },
  // Horizontales
  { kind: "h", className: "inset-x-0 top-[16%] h-px origin-right" },
  { kind: "h", className: "left-14 right-0 top-[30%] h-px origin-left" },
  { kind: "h", className: "left-14 right-0 top-[60%] h-px origin-right" },
  { kind: "h", className: "left-14 right-0 top-[75%] h-px origin-left" },
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
