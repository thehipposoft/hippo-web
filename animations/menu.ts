import { gsap } from "gsap";
import { TILE_FROM } from "@/animations/tiles";

const TILE_WAVE_DELAY = 0.08;

type MenuToggleOptions = {
  /** Capa del menú: fondo, grilla de recuadros y la celda central de referencia */
  menu: HTMLElement;
  /** Botón hamburguesa: viaja al centro y se convierte en la X */
  button: HTMLElement;
};

/**
 * Apertura del menú en las pantallas de sección (timeline pausado y reversible:
 * play() abre, reverse() cierra y deja todo como estaba).
 * Debe crearse con el menú cerrado, para medir el botón en su lugar.
 */
export function createMenuToggle({ menu, button }: MenuToggleOptions): gsap.core.Timeline {
  const backdrop = menu.querySelector("[data-menu-backdrop]");
  const slot = menu.querySelector<HTMLElement>("[data-menu-slot]");
  const tiles = gsap.utils.toArray<HTMLElement>(menu.querySelectorAll("[data-start-tile]"));
  const lines = gsap.utils.toArray<HTMLElement>(button.querySelectorAll("[data-hero-menu-line]"));

  const tl = gsap.timeline({ paused: true, defaults: { duration: 0.9, ease: "power3.inOut" } });
  if (!slot) return tl;

  // Botón → celda central (escala uniforme: ambos son cuadrados)
  const b = button.getBoundingClientRect();
  const s = slot.getBoundingClientRect();
  const scale = s.width / b.width;
  // Esquinas: del botón (solo redondeado a la derecha) a las de los recuadros, compensando la escala
  const buttonStyles = getComputedStyle(button);
  const buttonRadius = [
    buttonStyles.borderTopLeftRadius,
    buttonStyles.borderTopRightRadius,
    buttonStyles.borderBottomRightRadius,
    buttonStyles.borderBottomLeftRadius,
  ].join(" ");
  const tileRadius = (parseFloat(tiles[0] ? getComputedStyle(tiles[0]).borderTopLeftRadius : "0") || 0) / scale;
  const slotRadius = `${tileRadius}px ${tileRadius}px ${tileRadius}px ${tileRadius}px`;
  // Distancia entre líneas del ícono, para cruzar la de arriba y la de abajo en X
  const lineGap = lines.length === 3 ? lines[1].offsetTop - lines[0].offsetTop : 0;

  tl.set(menu, { autoAlpha: 1 }, 0)
    .fromTo(backdrop, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35, ease: "power1.out" }, 0)
    .fromTo(
      button,
      { x: 0, y: 0, scale: 1, borderRadius: buttonRadius, transformOrigin: "0 0" },
      { x: s.left - b.left, y: s.top - b.top, scale, borderRadius: slotRadius },
      0,
    );

  if (lines.length === 3) {
    tl.to(lines[0], { y: lineGap, rotate: 45, duration: 0.35 }, 0.5)
      .to(lines[1], { autoAlpha: 0, duration: 0.2 }, 0.5)
      .to(lines[2], { y: -lineGap, rotate: -45, duration: 0.35 }, 0.5);
  }

  // Recuadros: entran desde su lado, por tandas
  tiles.forEach((tile) => {
    const from = TILE_FROM[tile.dataset.from ?? ""] ?? {};
    const wave = Number(tile.dataset.wave ?? 0);
    tl.fromTo(tile, from, { x: 0, y: 0, ease: "power3.out" }, 0.1 + wave * TILE_WAVE_DELAY);
  });

  // Con todo en su lugar, los recuadros se vuelven clickeables
  tl.set(tiles, { pointerEvents: "auto" }, tl.duration());

  return tl;
}
