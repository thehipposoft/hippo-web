import { gsap } from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(DrawSVGPlugin, ScrollTrigger);

/**
 * Entrada de <BrandingStatement /> al llegar con el scroll:
 * los stickers aparecen con un "pop" desde scale 0 y, al terminar, se dibuja el círculo en "remember".
 * Debe llamarse dentro de un gsap.context() con scope en la sección.
 */
export function createBrandingStatement(root: HTMLElement): gsap.core.Timeline {
  return gsap
    .timeline({
      scrollTrigger: { trigger: root, start: "top 60%", once: true },
    })
    .fromTo(
      "[data-statement-sticker]",
      { scale: 0 },
      { scale: 1, duration: 0.6, ease: "back.out(1.8)", stagger: 0.12 },
    )
    .fromTo(
      "[data-statement-circle]",
      { drawSVG: "0%" },
      { drawSVG: "100%", duration: 0.9, ease: "power2.inOut" },
    );
}
