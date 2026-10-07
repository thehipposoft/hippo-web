"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { createStartIntro } from "@/animations/start/intro";
import { createStartScroll } from "@/animations/start/scroll";
import { createTileHover } from "@/animations/start/tileHover";
import { useGsap } from "@/lib/useGsap";

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

// Recuadros de secciones, en una grilla de 5 columnas × 3 filas cuya celda central
// (col 3 / fila 2) mide lo mismo que la caja: los recuadros la rodean y la siguen al achicarse.
// `from`: lado desde el que entran. `wave`: tanda de entrada (0 = primeros).
const TILES = [
  { label: "Branding & Design", href: "/branding-design", from: "left", wave: 0, className: "col-start-2 row-span-2 row-start-2 bg-brand-pink text-brand-darkpink" },
  { label: "Web Development", href: "/web-development", from: "right", wave: 0, className: "col-start-4 row-span-2 row-start-1 bg-brand-orange text-brand-darkorange" },
  { label: "Hippo Lab", href: "/hippo-lab", from: "top", wave: 1, className: "col-span-2 col-start-2 row-start-1 bg-brand-darkpink text-brand-pink" },
  { label: "Automation", href: "/automation", from: "bottom", wave: 1, className: "col-span-2 col-start-3 row-start-3 bg-brand-green text-brand-darkgreen" },
  { label: "Contact", href: "/contact", from: "left", wave: 2, className: "col-start-1 row-span-2 row-start-1 bg-brand-darkblue text-white" },
  { label: "About Us", href: "/about", from: "right", wave: 2, className: "col-start-5 row-span-2 row-start-2 bg-brand-darkorange text-brand-orange" },
  { label: "Brochure", href: "/brochure", from: "top", wave: 3, className: "col-start-5 row-start-1 bg-brand-darkgreen text-brand-green" },
  { label: "Portfolio", href: "/portfolio", from: "bottom", wave: 3, className: "col-start-1 row-start-3 bg-brand-blue text-brand-darkblue" },
] as const;

export default function Start() {
  const rootRef = useRef<HTMLElement>(null);

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
    <section
      ref={rootRef}
      className="invisible relative h-svh w-full overflow-hidden bg-white [--start-box-base:min(72svh,88vw)] [--start-scale:1] [--start-t:0] [--start-box-final:max(3rem,min(10svh,5vw))] [--start-gap:0.375rem] [--start-box:calc(var(--start-box-base)*var(--start-scale)*(1_-_var(--start-t))_+_var(--start-box-final)*var(--start-t))] [--start-scale-end:0.62] [--start-tiles-zoom:1.3] [--start-line-rest:0.25] [--start-fill:var(--color-brand-blue)] [--start-ink-filled:var(--color-white)] [--start-tile-hover-bg:var(--color-white)] [--start-tile-hover-border:#d4d4d4]"
    >
      {LINES.map((line, i) => (
        <span
          key={i}
          aria-hidden
          data-start-line={line.kind}
          className={`pointer-events-none absolute bg-brand-blue ${line.className}`}
        />
      ))}

      <nav
        aria-label="Secciones"
        data-start-tiles
        className="absolute inset-0 grid grid-cols-[1fr_1.4fr_var(--start-box)_1.4fr_1fr] grid-rows-[1fr_var(--start-box)_1fr] gap-(--start-gap) p-(--start-gap)"
      >
        {TILES.map((tile) => (
          <Link
            key={tile.href}
            href={tile.href}
            data-start-tile
            data-from={tile.from}
            data-wave={tile.wave}
            className={`pointer-events-none rounded-xl border border-transparent p-[clamp(1rem,2vw,1.75rem)] font-display text-[clamp(1.25rem,2.6vw,2.5rem)] font-bold leading-tight tracking-wide ${tile.className}`}
          >
            {/* Título + copia oscura para el hover (ver animations/start/tileHover.ts) */}
            <span className="relative -my-[0.2em] block overflow-hidden py-[0.2em]">
              <span data-start-tile-title className="block origin-bottom-left">
                {tile.label}
              </span>
              <span
                aria-hidden
                data-start-tile-title-hover
                className="absolute inset-0 block origin-bottom-left py-[0.2em] text-black underline decoration-[0.06em] underline-offset-[0.12em]"
              >
                {tile.label}
              </span>
            </span>
          </Link>
        ))}
      </nav>

      <div
        data-start-box
        className="absolute left-[calc(50%_-_var(--start-box)/2)] top-[calc(50%_-_var(--start-box)/2)] size-(--start-box) overflow-hidden px-[calc(var(--start-box)*0.08)] pt-[calc(var(--start-box)*0.14)]"
      >
        <span aria-hidden data-start-fill className="absolute inset-0 bg-(--start-fill) opacity-0" />

        <div data-start-copy className="relative pl-[calc(var(--start-box)*0.015)] font-display font-bold tracking-wide text-brand-darkblue">
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
          className="invisible absolute inset-x-0 top-0 px-[calc(var(--start-box)*0.065)] pt-[calc(var(--start-box)*0.07)] font-display text-[max(0.875rem,calc(var(--start-box)*0.06))] font-bold leading-[1.45] tracking-wide text-(--start-ink-filled) opacity-0"
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
        {/* TODO: reemplazar por el logo chico definitivo */}
        <div
          data-start-mark
          role="img"
          aria-label="Hippo"
          className="invisible absolute inset-[22%] rounded-full border-2 border-dashed border-(--start-ink-filled) opacity-0"
        />
      </div>
    </section>
  );
}
