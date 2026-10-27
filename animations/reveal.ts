import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// ScrollTrigger se registra una sola vez, en lib/useGsap.ts

/**
 * Entrada sutil al hacer scroll: los elementos [data-reveal] aparecen con fade y una leve subida
 * (los que entran juntos, escalonados). Con prefers-reduced-motion no se anima nada.
 * Debe llamarse dentro de un gsap.context() con scope en la sección. Devuelve la limpieza.
 */
export function createScrollReveal(root: HTMLElement): () => void {
  const items = gsap.utils.toArray<HTMLElement>(root.querySelectorAll("[data-reveal]"));
  const mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    gsap.set(items, { autoAlpha: 0, y: 24 });
    ScrollTrigger.batch(items, {
      start: "top 88%",
      once: true,
      onEnter: (batch) =>
        gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power2.out", stagger: 0.08, overwrite: true }),
    });
  });

  return () => mm.revert();
}
