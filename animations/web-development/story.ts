import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { UNDERLINE_HIDDEN, UNDERLINE_SHOWN } from "@/animations/underline";
// ScrollTrigger se registra una sola vez, en lib/useGsap.ts

gsap.registerPlugin(SplitText);

const MOTION = "(prefers-reduced-motion: no-preference)";
// Pausa entre la primera y la segunda frase del título (segundos)
const TITLE_PAUSE = 0.45;
const MASKED_LINE = { yPercent: 105, duration: 0.9, ease: "power3.out", stagger: 0.12 };
// Mobile: los bloques arrancan apenas asoman y van más rápido (con el scroll del celular
// la cola se atrasaba y los textos entraban tarde)
const MOBILE = "(max-width: 767px)";
const MOBILE_SPEED = 1.6;
const FOCUS_LINE = { autoAlpha: 0, y: 24, filter: "blur(10px)", duration: 1, ease: "power2.out", stagger: 0.15 };

/**
 * <WebDevStory />, en tono de storytelling. Los bloques se animan SIEMPRE en orden: cada uno se
 * encola al llegar con el scroll y espera a que termine el anterior (aunque se scrollee rápido).
 * 1. Título: línea por línea con máscara; primero la primera frase, una pausa y la segunda.
 * 2–4. Párrafos: cada línea entra en foco (de borrosa a nítida mientras sube). Al terminar, el
 *      segundo subraya en rojo [data-story-red] y el tercero resalta en verde [data-story-mark].
 * 5. Cierre: línea por línea con máscara y subrayado; después aparece el CTA.
 * Se parte el texto una vez cargada la fuente (los cortes de línea dependen de ella). Las piezas
 * resaltadas se buscan DESPUÉS de partir: SplitText las divide en una por línea.
 * Con prefers-reduced-motion todo queda visible. Debe llamarse dentro de un gsap.context(). Devuelve la limpieza.
 */
export function createWebDevStory(root: HTMLElement): () => void {
  const q = (selector: string) => root.querySelector<HTMLElement>(selector);
  const blocks = {
    title1: q("[data-story-title1]"),
    title2: q("[data-story-title2]"),
    p1: q("[data-story-p1]"),
    p2: q("[data-story-p2]"),
    p3: q("[data-story-p3]"),
    closing: q("[data-story-closing]"),
    cta: q("[data-story-cta]"),
  };
  const all = Object.values(blocks).filter((el): el is HTMLElement => Boolean(el));

  const mm = gsap.matchMedia();

  mm.add(MOTION, (context) => {
    // Ocultos hasta que les toque (cada timeline los vuelve a mostrar al arrancar)
    gsap.set(all, { autoAlpha: 0 });

    const mobile = window.matchMedia(MOBILE).matches;

    // Cola: un bloque a la vez, en orden
    const queue: gsap.core.Timeline[] = [];
    let running = false;
    const runNext = () => {
      const tl = queue.shift();
      running = Boolean(tl);
      if (!tl) return;
      if (mobile) tl.timeScale(MOBILE_SPEED);
      tl.eventCallback("onComplete", runNext);
      tl.play();
    };
    const enqueue = (tl: gsap.core.Timeline) => {
      queue.push(tl);
      if (!running) runNext();
    };
    const onEnter = (trigger: HTMLElement, tl: gsap.core.Timeline) =>
      ScrollTrigger.create({ trigger, start: mobile ? "top 92%" : "top 75%", once: true, onEnter: () => enqueue(tl) });

    const build = () => {
      const { title1, title2, p1, p2, p3, closing } = blocks;

      // 1. Título
      if (title1 && title2) {
        const lines1 = SplitText.create(title1, { type: "lines", mask: "lines" }).lines;
        const lines2 = SplitText.create(title2, { type: "lines", mask: "lines" }).lines;
        const tl = gsap
          .timeline({ paused: true })
          .set([title1, title2], { autoAlpha: 1 })
          .from(lines1, MASKED_LINE)
          .from(lines2, MASKED_LINE, `+=${TITLE_PAUSE}`);
        onEnter(title1, tl);
      }

      // 2–4. Párrafos
      const focus = (el: HTMLElement) => {
        const lines = SplitText.create(el, { type: "lines" }).lines;
        return gsap.timeline({ paused: true }).set(el, { autoAlpha: 1 }).from(lines, FOCUS_LINE);
      };
      if (p1) onEnter(p1, focus(p1));
      if (p2) {
        const tl = focus(p2);
        const reds = p2.querySelectorAll("[data-story-red]");
        if (reds.length) {
          gsap.set(reds, UNDERLINE_HIDDEN);
          tl.to(reds, { ...UNDERLINE_SHOWN, duration: 0.5, ease: "power2.inOut", stagger: 0.25 }, "+=0.1");
        }
        onEnter(p2, tl);
      }
      if (p3) {
        const tl = focus(p3);
        const marks = p3.querySelectorAll("[data-story-mark]");
        if (marks.length) {
          gsap.set(marks, { backgroundSize: "0% 100%" });
          // Una pieza por línea: se barren una detrás de otra, como un solo resaltado
          tl.to(marks, { backgroundSize: "100% 100%", duration: 0.5, ease: "none", stagger: 0.5 }, "+=0.1");
        }
        onEnter(p3, tl);
      }

      // 5. Cierre + subrayado
      if (closing) {
        const lines = SplitText.create(closing, { type: "lines", mask: "lines" }).lines;
        const tl = gsap.timeline({ paused: true }).set(closing, { autoAlpha: 1 }).from(lines, MASKED_LINE);
        const underline = closing.querySelector("[data-story-underline]");
        if (underline) {
          gsap.set(underline, UNDERLINE_HIDDEN);
          tl.to(underline, { ...UNDERLINE_SHOWN, duration: 0.8, ease: "power2.inOut" }, "+=0.05");
        }
        if (blocks.cta) tl.fromTo(blocks.cta, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.3");
        onEnter(closing, tl);
      }

      ScrollTrigger.refresh();
    };

    // Dentro del contexto del matchMedia, así se revierte todo al desmontar
    let alive = true;
    (document.fonts?.ready ?? Promise.resolve()).then(() => {
      if (alive) context.add(build);
    });
    return () => {
      alive = false;
    };
  });

  return () => mm.revert();
}
