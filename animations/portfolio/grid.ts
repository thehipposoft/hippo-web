import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Entrada de las cards del portfolio: aparecen subiendo con fade a medida que llegan con el scroll
 * (las que entran juntas, escalonadas).
 * Debe llamarse dentro de un gsap.context() con scope en la sección.
 */
export function createPortfolioGridEntrance(root: HTMLElement) {
  const items = gsap.utils.toArray<HTMLElement>(root.querySelectorAll("[data-portfolio-item]"));
  gsap.set(items, { autoAlpha: 0, y: 40 });

  return ScrollTrigger.batch(items, {
    start: "top 85%",
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power2.out", stagger: 0.12 }),
  });
}
