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
 * Cada palabra va además dentro de una máscara ([data-roll-rise] adentro) para una entrada que
 * suba el texto desde abajo sin tocar las letras del hover. `decorate` queda fuera de la máscara.
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
                  {/* Máscara de la palabra (entrada línea por línea: el contenido sube desde abajo).
                      El py/-my compensa el -my de las letras: recorta justo en su caja, sin mover el renglón. */}
                  <span className="-my-[0.1em] inline-block overflow-hidden py-[0.1em] align-top">
                    <span data-roll-rise className="inline-block align-top">
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
                    </span>
                  </span>
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
