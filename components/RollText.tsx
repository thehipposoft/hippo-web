import type { ReactNode } from "react";

type RollTextProps = {
  /** Renglones de texto; cada renglón se corta en palabras por espacios */
  lines: string[];
  /** Contenido extra dentro de una palabra (p. ej. un trazo alrededor), por palabra exacta */
  decorate?: Record<string, ReactNode>;
};

/**
 * Texto preparado para el hover de letras (animations/charRoll.ts).
 * Cada letra va recortada, con una copia arriba (letras pares) o abajo (impares).
 * Los lectores de pantalla leen el texto plano.
 */
export default function RollText({ lines, decorate = {} }: RollTextProps) {
  return (
    <>
      <span className="sr-only">{lines.join(" ")}</span>
      <span aria-hidden className="flex flex-col gap-4">
        {lines.map((line, lineIndex) => (
          <span key={lineIndex} className="block">
            {line.split(" ").map((word, wordIndex) => (
              <span key={wordIndex}>
                {wordIndex > 0 && " "}
                <span data-roll-word className="relative inline-block whitespace-nowrap cursor-crosshair">
                  {Array.from(word).map((char, charIndex) => {
                    const down = charIndex % 2 === 0;
                    return (
                      <span
                        key={charIndex}
                        data-roll-char={down ? "down" : "up"}
                        className="relative -my-[0.1em] inline-block overflow-hidden align-top"
                      >
                        <span className="block py-[0.1em]">{char}</span>
                        <span
                          className={`absolute inset-x-0 block py-[0.1em] ${down ? "bottom-full" : "top-full"}`}
                        >
                          {char}
                        </span>
                      </span>
                    );
                  })}
                  {decorate[word]}
                </span>
              </span>
            ))}
          </span>
        ))}
      </span>
    </>
  );
}
