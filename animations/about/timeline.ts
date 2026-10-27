import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getLenis } from "@/lib/lenis";
// ScrollTrigger se registra una sola vez, en lib/useGsap.ts

// Escritura: segundos entre caracteres, fade de cada uno y pausa entre oraciones
const TYPE_INTERVAL = 0.045;
const CHAR_FADE = 0.20;
const SENTENCE_PAUSE = 0.2;

/**
 * Entrada de <AboutTimeline /> (una vez):
 * stickers y cuadrados de color aparecen con un "pop" al acercarse la sección. Cuando la sección
 * llega arriba de la pantalla, el scroll se traba (Lenis) mientras el texto se escribe carácter por
 * carácter, oración por oración ([data-timeline-sentence]) con una pausa entre cada una, y se libera
 * al terminar. Si se llega con la sección ya pasada (recarga más abajo), el texto aparece completo.
 * Las líneas de fondo no se animan. Con prefers-reduced-motion no se anima nada.
 * Debe llamarse dentro de un gsap.context() con scope en la sección. Devuelve la limpieza.
 */
export function createAboutTimeline(root: HTMLElement): () => void {
  const mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    const sentences = gsap.utils.toArray<HTMLElement>(root.querySelectorAll("[data-timeline-sentence]"));

    // Stickers y cuadrados: al acercarse la sección
    gsap
      .timeline({ scrollTrigger: { trigger: root, start: "top 60%", once: true } })
      .fromTo(
        "[data-timeline-sticker]",
        { scale: 0, autoAlpha: 0 },
        { scale: 1, autoAlpha: 1, duration: 0.6, ease: "back.out(1.8)", stagger: 0.12 },
        0,
      )
      .fromTo(
        "[data-timeline-swatch]",
        { scale: 0, autoAlpha: 0 },
        { scale: 1, autoAlpha: 1, duration: 0.45, ease: "back.out(2)", stagger: 0.06 },
        0.3,
      );

    // Texto: oraciones en secuencia, cada una después de la anterior + una pausa
    const typing = gsap.timeline({ paused: true, onComplete: () => unlock() });
    sentences.forEach((sentence, i) => {
      typing.fromTo(
        sentence.querySelectorAll("[data-timeline-char]"),
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: CHAR_FADE, ease: "power1.out", stagger: TYPE_INTERVAL },
        i === 0 ? 0 : `+=${SENTENCE_PAUSE}`,
      );
    });

    let locked = false;
    const unlock = () => {
      if (!locked) return;
      locked = false;
      getLenis()?.start();
    };

    ScrollTrigger.create({
      trigger: root,
      start: "top top",
      once: true,
      onEnter: (self) => {
        // Recarga con la sección ya muy pasada: sin trabar, el texto completo
        if (window.scrollY - self.start > window.innerHeight) {
          typing.progress(1);
          return;
        }
        const lenis = getLenis();
        if (lenis) {
          // Fija la sección arriba de la pantalla y traba el scroll mientras se escribe
          lenis.scrollTo(self.start, { immediate: true, force: true });
          lenis.stop();
          locked = true;
        }
        typing.play();
      },
    });

    // Al desmontar (navegar) a mitad de la escritura, liberar el scroll
    return () => unlock();
  });

  return () => mm.revert();
}
