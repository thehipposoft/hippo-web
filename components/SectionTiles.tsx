"use client";

import { Link } from "@/i18n/navigation";
import type { MouseEvent } from "react";
import { useTranslations } from "next-intl";
import { getSection, getSectionHref, type Section, type SectionSlug } from "@/lib/sections";

// Variables que necesita la grilla (el contenedor también tiene que definir --start-box,
// el lado de la celda central).
export const SECTION_TILES_VARS =
  "[--start-gap:0.375rem] [--start-box-final:max(3rem,min(10svh,5vw))] [--start-tile-hover-bg:var(--color-white)] [--start-tile-hover-border:#d4d4d4]";

// Recuadros de secciones alrededor de la celda central, que mide --start-box (ahí termina la caja
// del inicio y va el botón del menú). Columnas y filas en minmax(0, …): con `1fr` no se achican por
// debajo de su contenido y, con la caja todavía grande, la grilla se descentraba respecto de ella. Dos grillas, con el mismo "molinete" alrededor del centro:
// - mobile: 3 columnas × 5 filas (centro en col 2 / fila 3), al estilo Dropbox en vertical
// - desktop (md): 5 columnas × 3 filas (centro en col 3 / fila 2)
// `from`: lado desde el que entran. `wave`: tanda de entrada (0 = primeros).
// Clases completas (mobile + md:) para que Tailwind las genere.
const TILES: { slug: SectionSlug; from: string; wave: number; position: string; colors: string }[] = [
  {
    slug: "branding-design",
    from: "left",
    wave: 0,
    position: "col-start-1 row-span-2 row-start-2 md:col-start-2 md:row-span-2 md:row-start-2",
    colors: "bg-brand-pink text-brand-darkpink",
  },
  {
    slug: "web-development",
    from: "right",
    wave: 0,
    position: "col-start-3 row-span-2 row-start-3 md:col-start-4 md:row-span-2 md:row-start-1",
    colors: "bg-brand-orange text-brand-darkorange",
  },
  {
    slug: "hippo-lab",
    from: "top",
    wave: 1,
    position: "col-span-2 col-start-2 row-start-2 md:col-span-2 md:col-start-2 md:row-start-1",
    colors: "bg-brand-darkpink text-brand-pink",
  },
  {
    slug: "systems-ia",
    from: "bottom",
    wave: 1,
    position: "col-span-2 col-start-1 row-start-4 md:col-span-2 md:col-start-3 md:row-start-3",
    colors: "bg-brand-green text-brand-darkgreen",
  },
  {
    slug: "contact",
    from: "left",
    wave: 2,
    position: "col-span-2 col-start-1 row-start-1 md:col-span-1 md:col-start-1 md:row-span-2 md:row-start-1",
    colors: "bg-brand-darkblue text-white",
  },
  {
    slug: "about",
    from: "right",
    wave: 2,
    position: "col-span-2 col-start-2 row-start-5 md:col-span-1 md:col-start-5 md:row-span-2 md:row-start-2",
    colors: "bg-brand-darkorange text-brand-orange",
  },
  {
    slug: "brochure",
    from: "top",
    wave: 3,
    position: "col-start-3 row-start-1 md:col-start-5 md:row-start-1",
    colors: "bg-brand-darkgreen text-brand-green",
  },
  {
    slug: "portfolio",
    from: "bottom",
    wave: 3,
    position: "col-start-1 row-start-5 md:col-start-1 md:row-start-3",
    colors: "bg-brand-blue text-brand-darkblue",
  },
];

type SectionTilesProps = {
  className?: string;
  onTileClick: (event: MouseEvent<HTMLAnchorElement>, section: Section) => void;
};

/** Grilla de recuadros de secciones (inicio y menú). Arrancan sin clicks: los habilita la animación. */
export default function SectionTiles({ className = "", onTileClick }: SectionTilesProps) {
  const t = useTranslations("Sections");
  const tNav = useTranslations("Nav");
  return (
    <nav
      aria-label={tNav("sections")}
      data-start-tiles
      className={`grid grid-cols-[minmax(0,1fr)_var(--start-box)_minmax(0,1fr)] grid-rows-[minmax(0,1fr)_minmax(0,1fr)_var(--start-box)_minmax(0,1fr)_minmax(0,1fr)] gap-(--start-gap) p-(--start-gap) md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_var(--start-box)_minmax(0,1.4fr)_minmax(0,1fr)] md:grid-rows-[minmax(0,1fr)_var(--start-box)_minmax(0,1fr)] ${className}`}
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
            className={`pointer-events-none min-w-0 overflow-hidden rounded-xl border border-transparent p-[clamp(1rem,2vw,1.75rem)] font-display text-[clamp(1.25rem,2.6vw,2.5rem)] font-bold leading-tight ${tile.position} ${tile.colors}`}
          >
            {/* Título + copia oscura para el hover (ver animations/start/tileHover.ts) */}
            <span className="relative -my-[0.2em] block overflow-hidden py-[0.2em]">
              <span data-start-tile-title className="block origin-bottom-left">
                {t(`${tile.slug}.title`)}
              </span>
              <span
                aria-hidden
                data-start-tile-title-hover
                className="absolute inset-0 block origin-bottom-left py-[0.2em] text-black underline decoration-[0.06em] underline-offset-[0.12em]"
              >
                {t(`${tile.slug}.title`)}
              </span>
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
