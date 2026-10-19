"use client";

import { useRef } from "react";
import Image from "next/image";
import { createStartIntro } from "@/animations/start/intro";
import { createStartScroll } from "@/animations/start/scroll";
import { createTileHover } from "@/animations/start/tileHover";
import SectionTiles, { SECTION_TILES_VARS } from "@/components/SectionTiles";
import { useGsap } from "@/lib/useGsap";
import { useTileTransition } from "@/lib/useTileTransition";

// Posiciones en función de --start-box (lado actual de la caja central, cambia con el scroll).
// La grilla secundaria se ubica según --start-box-base (tamaño inicial), así queda fija
// y divide la caja inicial en 31.5% / 37% / 31.5%.
const LINES = [
  // Caja principal
  { kind: "main-v", className: "inset-y-0 left-[calc(50%_-_var(--start-box)/2)] w-px origin-top" },
  { kind: "main-v", className: "inset-y-0 left-[calc(50%_+_var(--start-box)/2)] w-px origin-bottom" },
  { kind: "main-h", className: "inset-x-0 top-[calc(50%_-_var(--start-box)/2)] h-px origin-right" },
  { kind: "main-h", className: "inset-x-0 top-[calc(50%_+_var(--start-box)/2)] h-px origin-left" },
  // Grilla vertical (arriba y abajo de la caja)
  { kind: "grid-v", className: "top-0 h-[calc(50%_-_var(--start-box)/2)] left-[calc(50%_-_var(--start-box-base)*0.185)] w-px origin-bottom" },
  { kind: "grid-v", className: "top-0 h-[calc(50%_-_var(--start-box)/2)] left-[calc(50%_+_var(--start-box-base)*0.185)] w-px origin-bottom" },
  { kind: "grid-v", className: "bottom-0 h-[calc(50%_-_var(--start-box)/2)] left-[calc(50%_-_var(--start-box-base)*0.185)] w-px origin-top" },
  { kind: "grid-v", className: "bottom-0 h-[calc(50%_-_var(--start-box)/2)] left-[calc(50%_+_var(--start-box-base)*0.185)] w-px origin-top" },
  // Grilla horizontal (izquierda y derecha de la caja)
  { kind: "grid-h", className: "left-0 w-[calc(50%_-_var(--start-box)/2)] top-[calc(50%_-_var(--start-box-base)*0.185)] h-px origin-right" },
  { kind: "grid-h", className: "left-0 w-[calc(50%_-_var(--start-box)/2)] top-[calc(50%_+_var(--start-box-base)*0.185)] h-px origin-right" },
  { kind: "grid-h", className: "right-0 w-[calc(50%_-_var(--start-box)/2)] top-[calc(50%_-_var(--start-box-base)*0.185)] h-px origin-left" },
  { kind: "grid-h", className: "right-0 w-[calc(50%_-_var(--start-box)/2)] top-[calc(50%_+_var(--start-box-base)*0.185)] h-px origin-left" },
] as const;

export default function Start() {
  const rootRef = useRef<HTMLElement>(null);
  const { handleTileClick, overlay } = useTileTransition(
    () => rootRef.current?.querySelector<HTMLElement>("[data-start-box]") ?? null,
  );

  useGsap((root) => {
    const intro = createStartIntro(root);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) intro.progress(1);
    const scroll = createStartScroll(root);
    const removeTileHover = createTileHover(root);
    return () => {
      intro.kill();
      scroll.kill();
      removeTileHover();
    };
  }, rootRef);

  return (
    <>
      <section
        ref={rootRef}
        className={`invisible relative h-svh w-full overflow-hidden bg-white ${SECTION_TILES_VARS} [--start-box-base:min(72svh,88vw)] [--start-scale:1] [--start-t:0] [--start-box:calc(var(--start-box-base)*var(--start-scale)*(1_-_var(--start-t))_+_var(--start-box-final)*var(--start-t))] [--start-scale-end:0.62] [--start-tiles-zoom:1.3] [--start-line-rest:0.25] [--start-fill:var(--color-brand-blue)] [--start-ink-filled:var(--color-white)]`}
      >
        {LINES.map((line, i) => (
          <span
            key={i}
            aria-hidden
            data-start-line={line.kind}
            className={`pointer-events-none absolute bg-brand-blue ${line.className}`}
          />
        ))}

        <SectionTiles className="absolute inset-0" onTileClick={handleTileClick} />

        <div
          data-start-box
          className="absolute left-[calc(50%_-_var(--start-box)/2)] top-[calc(50%_-_var(--start-box)/2)] size-(--start-box) overflow-hidden px-[calc(var(--start-box)*0.08)] pt-[calc(var(--start-box)*0.14)]"
        >
          <span aria-hidden data-start-fill className="absolute inset-0 bg-(--start-fill) opacity-0" />

          <div data-start-copy className="relative pl-[calc(var(--start-box)*0.015)] font-display font-bold text-brand-darkblue">
            <h1
              data-start-text
              className="text-[max(0.875rem,calc(var(--start-box)*0.045))] leading-[1.45]"
            >
              We create to connect.
            </h1>
            <p
              data-start-text
              className="mt-[1.45em] max-w-[65%] text-[max(0.875rem,calc(var(--start-box)*0.045))] leading-[1.45]"
            >
              We turn ideas into digital experiences through design, technology and intelligent
              automation.
            </p>
            <p
              data-start-text
              className="mt-[calc(var(--start-box)*0.065)] text-[max(0.75rem,calc(var(--start-box)*0.030))]"
            >
              Design · Technology · Automation
            </p>
          </div>

          <p
            data-start-copy-alt
            className="invisible absolute inset-x-0 top-0 px-[calc(var(--start-box)*0.065)] pt-[calc(var(--start-box)*0.07)] font-display text-[max(0.875rem,calc(var(--start-box)*0.06))] font-bold leading-[1.45] text-(--start-ink-filled) opacity-0"
          >
            From identity to digital experiences, from websites to automation, we create the systems
            that help businesses connect, evolve, and work better.
          </p>

          <div
            data-start-logo
            className="absolute bottom-[calc(var(--start-box)*0.06)] left-[calc(var(--start-box)*0.08)] w-[calc(var(--start-box)*0.21)]"
          >
            <Image
              src="/assets/images/logo-fullcolor.png"
              alt="Hippo"
              width={1870}
              height={490}
              priority
              className="h-auto w-full"
            />
            <Image
              data-start-logo-inverse
              src="/assets/images/logo-fullcolor.png"
              alt=""
              aria-hidden
              width={1870}
              height={490}
              className="absolute inset-0 h-auto w-full opacity-0 brightness-0 invert"
            />
          </div>
          <Image
          data-start-mark
          src="/assets/images/hippo-small.svg"
          alt=""
          aria-hidden
          width={49}
          height={46}
          className="invisible absolute left-[20%] top-[20%] size-[60%] object-contain opacity-0"
        />
        </div>
      </section>

      {overlay}
    </>
  );
}
