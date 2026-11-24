import { gsap } from "gsap";
// ScrollTrigger se registra una sola vez, en lib/useGsap.ts

const MOTION = "(prefers-reduced-motion: no-preference)";
// Tramo de scroll (sin pin) y suavizado del scrub. Empieza con la sección casi entera en pantalla
// (la frase ya se leyó completa) y termina con el texto todavía visible, antes de la sección siguiente.
const FOLD_START = "top 20%";
const FOLD_END = "bottom 70%";
const SCRUB = 1.2;

/**
 * <PortfolioStatement />: la frase se pliega en "capas" con el scroll, como un acordeón.
 * Sin pin: mientras la sección cruza la pantalla, cada capa [data-portfolio-layer] (menos la última)
 * se cierra de abajo hacia arriba (altura → 0, recortada por su overflow) y la siguiente sube a
 * ocupar su lugar; al final la última se desvanece hasta fundirse con el fondo.
 * Scrub suavizado: al volver hacia arriba todo se expande y reaparece.
 * Con prefers-reduced-motion no se anima (la frase queda completa).
 * Debe llamarse dentro de un gsap.context(). Devuelve la limpieza.
 */
export function createPortfolioStatement(root: HTMLElement): () => void {
  const layers = gsap.utils.toArray<HTMLElement>(root.querySelectorAll("[data-portfolio-layer]"));
  const folding = layers.slice(0, -1);
  const last = layers[layers.length - 1];
  const mm = gsap.matchMedia();

  mm.add(MOTION, () => {
    if (!folding.length) return;
    const tl = gsap.timeline({
      defaults: { ease: "none", duration: 1 },
      scrollTrigger: {
        trigger: root,
        start: FOLD_START,
        end: FOLD_END,
        scrub: SCRUB,
        invalidateOnRefresh: true,
      },
    });
    // Se pliega la altura y también el margen negativo, así la capa siguiente termina
    // exactamente donde empezaba la que se cerró
    folding.forEach((layer, i) => tl.to(layer, { height: 0, marginBottom: 0 }, i));
    // La última capa se funde con el fondo
    if (last) tl.to(last, { opacity: 0, duration: 0.8 }, folding.length);
  });

  return () => mm.revert();
}
