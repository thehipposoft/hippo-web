import type { HTMLAttributes } from "react";

type ScrollCueProps = HTMLAttributes<HTMLDivElement> & {
  label: string;
};

/**
 * Cartel "scroll" + flecha hacia abajo. Arranca oculto (invisible): lo muestra la animación de quien
 * lo usa, y la flotación sale de animations/scrollCue.ts. Posición y tamaño de letra van en `className`.
 * Se le pueden pasar data-* para seleccionarlo desde la animación.
 */
export default function ScrollCue({ label, className = "", ...rest }: ScrollCueProps) {
  return (
    <div aria-hidden {...rest} className={`invisible ${className}`}>
      <span data-scroll-cue-float className="flex flex-col items-center gap-1 font-display font-bold">
        {label}
        <svg viewBox="0 0 24 24" fill="none" className="h-[0.7em] w-auto">
          <path d="M4 8l8 8 8-8" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </div>
  );
}
