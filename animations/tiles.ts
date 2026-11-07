import type { gsap } from "gsap";

// Desde dónde entra cada recuadro de secciones: completamente fuera de pantalla.
// El desplazamiento es la pantalla + el tamaño del propio recuadro, así no asoma nunca
// (aunque el recuadro sea más ancho que el hueco que lo separa del borde).
// Lo usan el scroll de <Start /> y la apertura del menú.
const offsetX = (_: number, el: HTMLElement) => window.innerWidth + el.offsetWidth;
const offsetY = (_: number, el: HTMLElement) => window.innerHeight + el.offsetHeight;

export const TILE_FROM: Record<string, gsap.TweenVars> = {
  top: { y: (i: number, el: HTMLElement) => -offsetY(i, el) },
  bottom: { y: offsetY },
  left: { x: (i: number, el: HTMLElement) => -offsetX(i, el) },
  right: { x: offsetX },
};
