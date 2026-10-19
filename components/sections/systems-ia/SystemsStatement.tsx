"use client";

import { useRef } from "react";
import { createSystemsStatement } from "@/animations/systems-ia/statement";
import { GRID_LINE_LEFT, GRID_LINE_RIGHT } from "@/lib/sectionGrid";
import { useGsap } from "@/lib/useGsap";

// Líneas de fondo: las verticales continúan las de <SectionHero />
const LINES = [
  `inset-y-0 ${GRID_LINE_LEFT} w-px`,
  `inset-y-0 ${GRID_LINE_RIGHT} w-px`,
  "inset-x-0 top-[15.3%] h-px",
  `${GRID_LINE_LEFT} right-0 top-[84.5%] h-px`,
];

// Renglones del texto; los tramos con `underline` llevan subrayado (con su desplazamiento)
const STATEMENT: { text: string; underline?: string }[][] = [
  [{ text: "We connect people, tools" }],
  [{ text: "and processes so things" }],
  [{ text: "keep moving " }, { text: "without the", underline: "left-[0.1em] right-0" }],
  [{ text: "busywork.", underline: "-left-[0.15em] -right-[0.3em]" }],
];

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

  useGsap((root) => {
    const tl = createSystemsStatement(root);
    return () => tl.kill();
  }, rootRef);

  return (
    <section ref={rootRef} className="relative h-svh w-full overflow-hidden bg-brand-black">
      {LINES.map((className) => (
        <span key={className} aria-hidden className={`absolute bg-brand-blue/50 ${className}`} />
      ))}

      <div className="absolute inset-y-[15.3%] left-[7.7%] right-[12%] flex items-center">
        <p className="font-display text-statement font-bold leading-[1.12] text-white">
          <span className="sr-only">{STATEMENT.flat().map((segment) => segment.text).join("")}</span>
          <span aria-hidden>
            {STATEMENT.map((line, lineIndex) => (
              <span key={lineIndex} className="block">
                {line.map((segment) =>
                  segment.underline ? (
                    <span key={segment.text} className="relative inline-block">
                      <TypedText text={segment.text} />
                      {/* Un <svg> absoluto no se estira entre left/right: lo hace el span */}
                      <span
                        data-systems-underline
                        className={`pointer-events-none absolute -bottom-[0.1em] h-[0.06em] ${segment.underline}`}
                      >
                        <svg
                          viewBox="0 0 100 4"
                          preserveAspectRatio="none"
                          fill="none"
                          className="block size-full overflow-visible text-brand-blue"
                        >
                          <path
                            d="M0 2H100"
                            stroke="currentColor"
                            strokeWidth={5}
                            strokeLinecap="round"
                            vectorEffect="non-scaling-stroke"
                          />
                        </svg>
                      </span>
                    </span>
                  ) : (
                    <TypedText key={segment.text} text={segment.text} />
                  ),
                )}
              </span>
            ))}
          </span>
        </p>
      </div>
    </section>
  );
}
