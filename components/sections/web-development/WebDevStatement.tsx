"use client";

import { useRef } from "react";
import { createWebDevStatement } from "@/animations/web-development/statement";
import { GRID_LINE_LEFT, GRID_LINE_RIGHT } from "@/lib/sectionGrid";
import { useGsap } from "@/lib/useGsap";

// Líneas de fondo: las verticales continúan las de <SectionHero />
const LINES = [
  `inset-y-0 ${GRID_LINE_LEFT} w-px`,
  `inset-y-0 ${GRID_LINE_RIGHT} w-px`,
  "inset-x-0 top-[16%] h-px",
  `${GRID_LINE_LEFT} right-0 top-[85%] h-px`,
];

/**
 * Tramo de texto con efecto "code typing": la copia invisible reserva el ancho del texto final
 * (así no salta el renglón) y encima se animan los caracteres.
 */
function Scramble({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span className={`relative inline-block whitespace-nowrap ${className}`}>
      <span className="invisible">{text}</span>
      <span data-scramble={text} className="absolute left-0 top-0">
        {text}
      </span>
    </span>
  );
}

/** Web Development · pantalla 2: frase de entrada con efecto de tipeo. */
export default function WebDevStatement() {
  const rootRef = useRef<HTMLElement>(null);

  useGsap((root) => {
    const tl = createWebDevStatement(root);
    return () => tl.kill();
  }, rootRef);

  return (
    <section ref={rootRef} className="relative h-svh w-full overflow-hidden bg-brand-black">
      {LINES.map((className) => (
        <span key={className} aria-hidden className={`absolute bg-brand-blue/50 ${className}`} />
      ))}

      <div className="absolute inset-y-[16%] left-[8.3%] right-[12%] flex items-center">
        <p className="font-display text-statement font-bold leading-[1.2] text-white">
          <span className="sr-only">Designed to look good. Built to work even better.</span>
          <span aria-hidden>
            <span className="block">
              <Scramble text="Designed to look good" />
            </span>
            <span className="block">
              <Scramble text="Built to work" />{" "}
              <span className="relative inline-block">
                <Scramble text="even better" />
                {/* Subrayado a mano */}
                <svg
                  data-webdev-underline
                  viewBox="0 0 300 12"
                  preserveAspectRatio="none"
                  fill="none"
                  className="pointer-events-none absolute -bottom-[0.12em] left-0 h-[0.2em] w-full overflow-visible text-brand-green"
                >
                  <path
                    d="M2 7C60 5 120 4 180 5C230 6 270 7 298 8"
                    stroke="currentColor"
                    strokeWidth={3.5}
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
              </span>
              {/* El punto no pasa por caracteres aleatorios: aparece tal cual con el último tramo */}
              <span data-webdev-dot className="text-brand-green">
                .
              </span>
            </span>
          </span>
        </p>
      </div>
    </section>
  );
}
