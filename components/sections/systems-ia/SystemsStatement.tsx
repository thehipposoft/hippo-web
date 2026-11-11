"use client";

import { useRef } from "react";
import { createSystemsStatement } from "@/animations/systems-ia/statement";
import { GRID_LINE_LEFT, GRID_LINE_RIGHT } from "@/lib/sectionGrid";
import { useGsap } from "@/lib/useGsap";
import { useTranslations } from "next-intl";

// Líneas de fondo: las verticales continúan las de <SectionHero />
const LINES = [
  `inset-y-0 ${GRID_LINE_LEFT} w-px`,
  `inset-y-0 ${GRID_LINE_RIGHT} w-px`,
  // Mobile: pegadas a los bordes (la de arriba, al borde inferior del botón del menú)
  "inset-x-0 top-14 h-px md:top-[15.3%]",
  `${GRID_LINE_LEFT} right-0 bottom-14 h-px md:bottom-auto md:top-[84.5%]`,
];

// Tramos del texto (fluyen seguidos, sin renglones fijos): cada tramo es una clave de Systems.statement.
type StatementKey = "line1" | "line2" | "marked";
const STATEMENT: { key: StatementKey; underline?: boolean }[][] = [
  [{ key: "line1" }],
  [{ key: "line2" }, { key: "marked", underline: true }],
];
/**
 * Texto subrayado: el span marca qué se subraya. El trazo no va acá: animations/systems-ia/statement.ts
 * mide los renglones reales del span y dibuja un trazo continuo por renglón (en
 * [data-systems-underline-layer]). La puntuación final queda afuera del subrayado.
 */
function UnderlinedText({ text }: { text: string }) {
  const [, body = text, punctuation = ""] = text.match(/^(.*?)([.,;:!?]*)$/) ?? [];
  return (
    <>
      <span data-systems-underline>
        <TypedText text={body} />
      </span>
      <TypedText text={punctuation} />
    </>
  );
}

/** Caracteres sueltos para la animación de tipeo (los espacios también ocupan su lugar) */
function TypedText({ text }: { text: string }) {
  return Array.from(text).map((char, i) => (
    <span key={i} data-type-char>
      {char}
    </span>
  ));
}

/** Systems & IA · pantalla 2: frase de entrada que se escribe sola. */
export default function SystemsStatement() {
  const rootRef = useRef<HTMLElement>(null);
  const t = useTranslations("Systems.statement");

  useGsap((root) => createSystemsStatement(root), rootRef);

  return (
    <section ref={rootRef} className="relative h-svh w-full overflow-hidden bg-brand-black">
      {LINES.map((className) => (
        <span key={className} aria-hidden className={`absolute bg-brand-blue/50 ${className}`} />
      ))}

      <div className="absolute inset-y-[15.3%] left-[calc(5.5%_+_1.25rem)] right-[calc(5.5%_+_1.25rem)] flex items-center md:left-[7.7%] md:right-[12%]">
        <div>
          <p className="relative font-display text-[8.5vw] font-bold leading-[1.12] text-white md:text-[clamp(2rem,4.2vw,4.5rem)]">
            <span data-systems-underline-layer aria-hidden className="pointer-events-none absolute inset-0" />
            <span className="sr-only">{STATEMENT.map((line) => line.map((segment) => t(segment.key)).join("")).join(" ")}</span>
            <span aria-hidden>
              {STATEMENT.map((line, lineIndex) => (
                // Tramos seguidos (sin cortes fijos): la frase se acomoda sola al ancho
                <span key={lineIndex}>
                  {lineIndex > 0 && " "}
                  {line.map((segment) =>
                    segment.underline ? (
                      <UnderlinedText key={segment.key} text={t(segment.key)} />
                    ) : (
                      <TypedText key={segment.key} text={t(segment.key)} />
                    ),
                  )}
                </span>
              ))}
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
