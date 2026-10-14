"use client";

import { useRef, useState, type MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { createTileTransition } from "@/animations/start/tileTransition";
import SectionHero from "@/components/SectionHero";
import { markHeroArrival } from "@/lib/heroArrival";
import { getSectionHref, type Section } from "@/lib/sections";
import { useGsap } from "@/lib/useGsap";

type ActiveTile = { section: Section; tile: HTMLElement };

/**
 * Click en un recuadro de sección → transición a la pantalla de sección → navegación.
 * `getBox` devuelve el elemento que se convierte en el botón de menú (caja central).
 * Devuelve el handler para los recuadros y la capa de transición a renderizar.
 */
export function useTileTransition(getBox: () => HTMLElement | null) {
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<ActiveTile | null>(null);

  useGsap(
    (overlay) => {
      if (!active) return;
      const tl = createTileTransition({
        overlay,
        tile: active.tile,
        box: getBox(),
        onComplete: () => {
          markHeroArrival();
          router.push(getSectionHref(active.section.slug));
        },
      });
      return () => tl.kill();
    },
    overlayRef,
    [active],
  );

  const handleTileClick = (event: MouseEvent<HTMLAnchorElement>, section: Section) => {
    // Abrir en otra pestaña/ventana sigue funcionando normal
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    if (active) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      router.push(getSectionHref(section.slug));
      return;
    }
    setActive({ section, tile: event.currentTarget });
  };

  const overlay = active ? (
    <div ref={overlayRef} className="invisible fixed inset-0 z-[70]">
      <SectionHero section={active.section} intro={false} />
    </div>
  ) : null;

  return { handleTileClick, overlay };
}
