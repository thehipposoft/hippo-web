"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { gsap } from "gsap";
import { createMenuToggle } from "@/animations/menu";
import { createTileHover } from "@/animations/start/tileHover";
import SectionTiles, { SECTION_TILES_VARS } from "@/components/SectionTiles";
import type { Section } from "@/lib/sections";
import { useGsap } from "@/lib/useGsap";
import { useTileTransition } from "@/lib/useTileTransition";

type SectionMenuProps = {
  /** Sección actual: si se elige en el menú, solo se cierra */
  section: Section;
};

/**
 * Botón hamburguesa de las pantallas de sección + menú de recuadros.
 * Abrir/cerrar no cambia de ruta: es un timeline que va y vuelve (animations/menu.ts).
 */
export default function SectionMenu({ section }: SectionMenuProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const [open, setOpen] = useState(false);

  const { handleTileClick, overlay } = useTileTransition(() => buttonRef.current);

  useGsap((menu) => {
    const removeTileHover = createTileHover(menu);
    return () => {
      removeTileHover();
      tlRef.current?.kill();
    };
  }, menuRef);

  const openMenu = () => {
    const menu = menuRef.current;
    const button = buttonRef.current;
    if (!menu || !button) return;
    // Se mide de nuevo solo con el menú completamente cerrado (puede haber cambiado el viewport)
    if (!tlRef.current || tlRef.current.progress() === 0) {
      tlRef.current?.kill();
      tlRef.current = createMenuToggle({ menu, button });
    }
    tlRef.current.timeScale(1).play();
    setOpen(true);
  };

  const closeMenu = () => {
    tlRef.current?.timeScale(1.2).reverse();
    setOpen(false);
  };

  // Escape cierra el menú
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const onTileClick = (event: MouseEvent<HTMLAnchorElement>, target: Section) => {
    if (target.slug === section.slug) {
      event.preventDefault();
      closeMenu();
      return;
    }
    handleTileClick(event, target);
  };

  return (
    <>
      <div
        ref={menuRef}
        data-menu
        inert={!open}
        className={`invisible fixed inset-0 z-50 [--start-box:var(--start-box-final)] ${SECTION_TILES_VARS}`}
      >
        <div data-menu-backdrop className="absolute inset-0 bg-white" />
        <SectionTiles className="absolute inset-0" onTileClick={onTileClick} />
        {/* Celda central: destino del botón al abrir */}
        <div
          data-menu-slot
          aria-hidden
          className="pointer-events-none absolute left-[calc(50%_-_var(--start-box)/2)] top-[calc(50%_-_var(--start-box)/2)] size-(--start-box)"
        />
      </div>

      <button
        ref={buttonRef}
        type="button"
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={open}
        onClick={open ? closeMenu : openMenu}
        data-hero-menu
        className="fixed left-0 top-[calc(50%_-_1.75rem)] z-[60] flex size-14 origin-top-left cursor-pointer items-center justify-center rounded-r-lg bg-brand-blue"
      >
        <span data-hero-menu-icon aria-hidden className="flex w-6 flex-col gap-1.5">
          <span data-hero-menu-line className="h-0.5 rounded-full bg-white" />
          <span data-hero-menu-line className="h-0.5 rounded-full bg-white" />
          <span data-hero-menu-line className="h-0.5 rounded-full bg-white" />
        </span>
      </button>

      {overlay}
    </>
  );
}
