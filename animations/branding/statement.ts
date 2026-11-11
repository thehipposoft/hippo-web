import { gsap } from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(DrawSVGPlugin, ScrollTrigger);

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

/**
 * Agrupa elementos inline por renglón visual (misma posición vertical), en orden de lectura.
 * Se mide al disparar la entrada: la fuente ya cargó y los cortes de renglón son los reales.
 */
function groupByLine(elements: HTMLElement[]): HTMLElement[][] {
  const lines: { top: number; items: HTMLElement[] }[] = [];
  for (const element of elements) {
    const { top, height } = element.getBoundingClientRect();
    const line = lines.find((item) => Math.abs(item.top - top) < height / 2);
    if (line) line.items.push(element);
    else lines.push({ top, items: [element] });
  }
  return lines.sort((a, b) => a.top - b.top).map((line) => line.items);
}

/**
 * Entrada de <BrandingStatement /> al llegar con el scroll:
 * 1. El texto sube línea por línea desde abajo, cada palabra dentro de su máscara (<RollText />,
 *    [data-roll-rise]). Se anima la palabra, no las letras: el hover de letras sigue funcionando.
 * 2. Los stickers aparecen con un "pop" desde scale 0.
 * 3. Se dibuja el círculo en la palabra marcada.
 * Con prefers-reduced-motion, el texto no se anima (stickers y círculo sí, como antes).
 * Debe llamarse dentro de un gsap.context() con scope en la sección. Devuelve la limpieza.
 */
export function createBrandingStatement(root: HTMLElement): () => void {
  const words = gsap.utils.toArray<HTMLElement>(root.querySelectorAll("[data-roll-word]"));
  const stickers = root.querySelectorAll("[data-statement-sticker]");
  const circle = root.querySelector("[data-statement-circle]");
  const animateText = !window.matchMedia(REDUCED_MOTION).matches;
  let tl: gsap.core.Timeline | null = null;

  // Estado inicial (antes de llegar): texto abajo de sus máscaras, stickers en 0, círculo sin dibujar
  if (animateText) gsap.set(root.querySelectorAll("[data-roll-rise]"), { yPercent: 110 });
  gsap.set(stickers, { scale: 0 });
  if (circle) gsap.set(circle, { drawSVG: "0%" });

  const trigger = ScrollTrigger.create({
    trigger: root,
    start: "top 60%",
    once: true,
    onEnter: () => {
      tl = gsap.timeline();
      if (animateText) {
        groupByLine(words).forEach((line, i) => {
          const rises = line.map((word) => word.querySelector("[data-roll-rise]"));
          tl?.to(rises, { yPercent: 0, duration: 0.9, ease: "power3.out" }, i * 0.12);
        });
      }
      tl.to(stickers, { scale: 1, duration: 0.6, ease: "back.out(1.8)", stagger: 0.12 }, animateText ? "-=0.5" : 0);
      if (circle) tl.to(circle, { drawSVG: "100%", duration: 0.9, ease: "power2.inOut" });
    },
  });

  return () => {
    trigger.kill();
    tl?.kill();
  };
}
