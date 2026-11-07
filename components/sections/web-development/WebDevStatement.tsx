"use client";

import { useRef } from "react";
import { createWebDevStatement } from "@/animations/web-development/statement";
import { GRID_LINE_LEFT, GRID_LINE_RIGHT } from "@/lib/sectionGrid";
import { useGsap } from "@/lib/useGsap";
import { useTranslations } from "next-intl";

// Líneas de fondo: las verticales continúan las de <SectionHero />
const LINES = [
  `inset-y-0 ${GRID_LINE_LEFT} w-px`,
  `inset-y-0 ${GRID_LINE_RIGHT} w-px`,
  // Mobile: pegadas a los bordes (la de arriba, al borde inferior del botón del menú)
  "inset-x-0 top-14 h-px md:top-[16%]",
  `${GRID_LINE_LEFT} right-0 bottom-14 h-px md:bottom-auto md:top-[85%]`,
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

/**
 * Frase partida en palabras: cada una es un tramo de <Scramble /> (no se corta por dentro), así
 * el texto puede pasar de renglón en idiomas con frases más largas.
 */
function ScrambleWords({ text }: { text: string }) {
  return text.split(" ").map((word, i) => (
    <span key={i}>
      {i > 0 && " "}
      <Scramble text={word} />
    </span>
  ));
}

/** Web Development · pantalla 2: frase de entrada con efecto de tipeo. */
export default function WebDevStatement() {
  const rootRef = useRef<HTMLElement>(null);
  const t = useTranslations("WebDev.statement");

  useGsap((root) => createWebDevStatement(root), rootRef);

  return (
    <section ref={rootRef} className="relative h-svh w-full overflow-hidden bg-brand-black">
      {LINES.map((className) => (
        <span key={className} aria-hidden className={`absolute bg-brand-blue/50 ${className}`} />
      ))}

      <div className="absolute inset-y-[16%] left-[calc(5.5%_+_1.25rem)] right-[calc(5.5%_+_1.25rem)] flex items-center md:left-[8.3%] md:right-[12%]">
        <p className="font-display text-[10.5vw] font-bold leading-[1.2] text-white md:text-statement">
          <span className="sr-only">{t("full")}</span>
          <span aria-hidden>
            <span className="block">
              <ScrambleWords text={t("line1")} />
            </span>
            <span className="block">
              <ScrambleWords text={t("line2")} />{" "}
              {/* Sin corte entre lo subrayado y el punto (si no, el punto podía quedar solo en otro renglón) */}
              <span className="whitespace-nowrap">
              <span className="relative inline-block">
                <ScrambleWords text={t("marked")} />
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
          </span>
        </p>
      </div>
    </section>
  );
}
