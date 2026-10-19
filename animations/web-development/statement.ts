import { gsap } from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { UNDERLINE_HIDDEN, UNDERLINE_SHOWN } from "@/animations/underline";

gsap.registerPlugin(ScrambleTextPlugin, ScrollTrigger);

// Caracteres por los que pasa cada letra antes de revelarse
const SCRAMBLE_CHARS = "0123456789!#$%&*()_+-=[]{}/\\|<>?.";
// Segundos por carácter (cada tramo dura según su largo)
const SECONDS_PER_CHAR = 0.11;

/**
 * Entrada de <WebDevStatement /> al llegar con el scroll: "code typing".
 * Cada tramo de texto aparece con caracteres aleatorios que se van resolviendo de izquierda
 * a derecha (el punto final aparece tal cual con el último tramo); al terminar se dibuja el subrayado.
 * Debe llamarse dentro de un gsap.context() con scope en la sección.
 */
export function createWebDevStatement(root: HTMLElement): gsap.core.Timeline {
  const segments = gsap.utils.toArray<HTMLElement>(root.querySelectorAll("[data-scramble]"));
  gsap.set([...segments, root.querySelector("[data-webdev-dot]")], { autoAlpha: 0 });

  const tl = gsap.timeline({
    scrollTrigger: { trigger: root, start: "top 60%", once: true },
    defaults: { ease: "none" },
  });

  segments.forEach((segment, i) => {
    const text = segment.dataset.scramble ?? "";
    tl.set(segment, { autoAlpha: 1 });
    // El punto acompaña al último tramo desde que empieza
    if (i === segments.length - 1) tl.set("[data-webdev-dot]", { autoAlpha: 1 });
    tl.to(segment, {
      duration: Math.max(0.6, text.length * SECONDS_PER_CHAR),
      scrambleText: { text, chars: SCRAMBLE_CHARS, revealDelay: 0.6, speed: 0.3 },
    });
  });

  return tl.fromTo(
    "[data-webdev-underline]",
    UNDERLINE_HIDDEN,
    { ...UNDERLINE_SHOWN, duration: 1.2, ease: "power2.inOut" },
    "+=0.2",
  );
}
