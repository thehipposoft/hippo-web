import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { UNDERLINE_HIDDEN, UNDERLINE_SHOWN } from "@/animations/underline";

gsap.registerPlugin(ScrollTrigger);

// Segundos entre un carácter y el siguiente
const TYPE_INTERVAL = 0.03;

/**
 * Entrada de <SystemsStatement /> al llegar con el scroll: el texto se escribe carácter por carácter
 * y, al terminar, se dibujan los dos subrayados a la vez.
 * Debe llamarse dentro de un gsap.context() con scope en la sección.
 */
export function createSystemsStatement(root: HTMLElement): gsap.core.Timeline {
  const chars = root.querySelectorAll("[data-type-char]");

  return gsap
    .timeline({ scrollTrigger: { trigger: root, start: "top 60%", once: true } })
    .fromTo(chars, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01, stagger: TYPE_INTERVAL })
    .fromTo(
      "[data-systems-underline]",
      UNDERLINE_HIDDEN,
      { ...UNDERLINE_SHOWN, duration: 0.8, ease: "power2.inOut" },
      "+=0.2",
    );
}
