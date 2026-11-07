import { gsap } from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { UNDERLINE_HIDDEN, UNDERLINE_SHOWN } from "@/animations/underline";
import { getLenis } from "@/lib/lenis";

gsap.registerPlugin(ScrambleTextPlugin, ScrollTrigger);

// Caracteres por los que pasa cada letra antes de revelarse
const SCRAMBLE_CHARS = "0123456789!#$%&*()_+-=[]{}/\\|<>?.";
// Segundos por carácter (cada tramo dura según su largo)
const SECONDS_PER_CHAR = 0.05;
// Parte de cada tramo que pasa solo con caracteres aleatorios antes de empezar a revelar.
// Proporcional a la duración: con una espera fija, las palabras cortas terminaban sin revelarse.
const REVEAL_DELAY_RATIO = 0.35;

/**
 * Entrada de <WebDevStatement />: "code typing". Cuando la sección llega arriba de la pantalla, el
 * scroll se traba (Lenis) mientras cada tramo aparece con caracteres aleatorios que se resuelven de
 * izquierda a derecha (el punto final aparece tal cual con el último tramo); al terminar se dibuja
 * el subrayado y se libera el scroll. Si se llega con la sección ya pasada, aparece completo.
 * Debe llamarse dentro de un gsap.context() con scope en la sección. Devuelve la limpieza.
 */
export function createWebDevStatement(root: HTMLElement): () => void {
  const segments = gsap.utils.toArray<HTMLElement>(root.querySelectorAll("[data-scramble]"));
  const dot = root.querySelector("[data-webdev-dot]");
  gsap.set([...segments, dot], { autoAlpha: 0 });

  let locked = false;
  const unlock = () => {
    if (!locked) return;
    locked = false;
    getLenis()?.start();
  };

  const tl = gsap.timeline({ paused: true, defaults: { ease: "none" }, onComplete: unlock });

  segments.forEach((segment, i) => {
    const text = segment.dataset.scramble ?? "";
    const duration = Math.max(0.2, text.length * SECONDS_PER_CHAR);
    tl.set(segment, { autoAlpha: 1 });
    // El punto acompaña al último tramo desde que empieza
    if (i === segments.length - 1) tl.set(dot, { autoAlpha: 1 });
    tl.to(segment, {
      duration,
      scrambleText: { text, chars: SCRAMBLE_CHARS, revealDelay: duration * REVEAL_DELAY_RATIO, speed: 0.4 },
    });
  });

  tl.fromTo("[data-webdev-underline]", UNDERLINE_HIDDEN, { ...UNDERLINE_SHOWN, duration: 0.7, ease: "power2.inOut" }, "+=0.1");

  const st = ScrollTrigger.create({
    trigger: root,
    start: "top top",
    once: true,
    onEnter: (self) => {
      // Recarga con la sección ya muy pasada: sin trabar, el texto completo
      if (window.scrollY - self.start > window.innerHeight) {
        tl.progress(1);
        return;
      }
      const lenis = getLenis();
      if (lenis) {
        // Fija la sección arriba de la pantalla y traba el scroll mientras se escribe
        lenis.scrollTo(self.start, { immediate: true, force: true });
        lenis.stop();
        locked = true;
      }
      tl.play();
    },
  });

  return () => {
    unlock();
    st.kill();
    tl.kill();
  };
}
