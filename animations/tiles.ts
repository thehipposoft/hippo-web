import type { gsap } from "gsap";

// Desde dónde entra cada recuadro de secciones: completamente fuera de pantalla.
// Lo usan el scroll de <Start /> y la apertura del menú.
export const TILE_FROM: Record<string, gsap.TweenVars> = {
  top: { y: "-100vh" },
  bottom: { y: "100vh" },
  left: { x: "-100vw" },
  right: { x: "100vw" },
};
