"use client";

import Link from "next/link";
import type { MouseEvent } from "react";
import { getSection, getSectionHref, type Section, type SectionSlug } from "@/lib/sections";

// Variables que necesita la grilla (el contenedor también tiene que definir --start-box,
// el lado de la celda central).
export const SECTION_TILES_VARS =
  "[--start-gap:0.375rem] [--start-box-final:max(3rem,min(10svh,5vw))] [--start-tile-hover-bg:var(--color-white)] [--start-tile-hover-border:#d4d4d4]";

// Recuadros de secciones, en una grilla de 5 columnas × 3 filas cuya celda central
// (col 3 / fila 2) mide --start-box.
// `from`: lado desde el que entran. `wave`: tanda de entrada (0 = primeros).
const TILES: { slug: SectionSlug; from: string; wave: number; className: string }[] = [
  { slug: "branding-design", from: "left", wave: 0, className: "col-start-2 row-span-2 row-start-2 bg-brand-pink text-brand-darkpink" },
  { slug: "web-development", from: "right", wave: 0, className: "col-start-4 row-span-2 row-start-1 bg-brand-orange text-brand-darkorange" },
  { slug: "hippo-lab", from: "top", wave: 1, className: "col-span-2 col-start-2 row-start-1 bg-brand-darkpink text-brand-pink" },
  { slug: "systems-ia", from: "bottom", wave: 1, className: "col-span-2 col-start-3 row-start-3 bg-brand-green text-brand-darkgreen" },
  { slug: "contact", from: "left", wave: 2, className: "col-start-1 row-span-2 row-start-1 bg-brand-darkblue text-white" },
  { slug: "about", from: "right", wave: 2, className: "col-start-5 row-span-2 row-start-2 bg-brand-darkorange text-brand-orange" },
  { slug: "brochure", from: "top", wave: 3, className: "col-start-5 row-start-1 bg-brand-darkgreen text-brand-green" },
  { slug: "portfolio", from: "bottom", wave: 3, className: "col-start-1 row-start-3 bg-brand-blue text-brand-darkblue" },
];

type SectionTilesProps = {
  className?: string;
  onTileClick: (event: MouseEvent<HTMLAnchorElement>, section: Section) => void;
};

/** Grilla de recuadros de secciones (inicio y menú). Arrancan sin clicks: los habilita la animación. */
export default function SectionTiles({ className = "", onTileClick }: SectionTilesProps) {
  return (
    <nav
      aria-label="Secciones"
      data-start-tiles
      className={`grid grid-cols-[1fr_1.4fr_var(--start-box)_1.4fr_1fr] grid-rows-[1fr_var(--start-box)_1fr] gap-(--start-gap) p-(--start-gap) ${className}`}
    >
      {TILES.map((tile) => {
        const section = getSection(tile.slug);
        if (!section) return null;
        return (
          <Link
            key={tile.slug}
            href={getSectionHref(tile.slug)}
            onClick={(event) => onTileClick(event, section)}
            data-start-tile
            data-from={tile.from}
            data-wave={tile.wave}
            className={`pointer-events-none rounded-xl border border-transparent p-[clamp(1rem,2vw,1.75rem)] font-display text-[clamp(1.25rem,2.6vw,2.5rem)] font-bold leading-tight ${tile.className}`}
          >
            {/* Título + copia oscura para el hover (ver animations/start/tileHover.ts) */}
            <span className="relative -my-[0.2em] block overflow-hidden py-[0.2em]">
              <span data-start-tile-title className="block origin-bottom-left">
                {section.title}
              </span>
              <span
                aria-hidden
                data-start-tile-title-hover
                className="absolute inset-0 block origin-bottom-left py-[0.2em] text-black underline decoration-[0.06em] underline-offset-[0.12em]"
              >
                {section.title}
              </span>
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
