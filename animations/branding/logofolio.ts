import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Entrada del logofolio al llegar con el scroll: los logos de cada fila suben con fade, escalonados.
 * Debe llamarse dentro de un gsap.context() con scope en la sección.
 */
export function createLogofolioEntrance(root: HTMLElement): gsap.core.Timeline {
  const tl = gsap.timeline({
    scrollTrigger: { trigger: root, start: "top 60%", once: true },
    defaults: { duration: 0.8, ease: "power2.out", stagger: 0.15 },
  });

  gsap.utils.toArray<HTMLElement>(root.querySelectorAll("[data-logofolio-row]")).forEach((row, i) => {
    tl.fromTo(row.children, { autoAlpha: 0, yPercent: 35 }, { autoAlpha: 1, yPercent: 0 }, i * 0.3);
  });

  return tl;
}
