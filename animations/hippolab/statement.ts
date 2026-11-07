import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
// ScrollTrigger se registra una sola vez, en lib/useGsap.ts

gsap.registerPlugin(SplitText);

const MOTION = "(prefers-reduced-motion: no-preference)";
// Vuelta completa del texto del badge (segundos)
const RING_LOOP = 18;
// Sin hover (táctil): los hovers se corren solos
const TOUCH = "(hover: none)";
// Después de la entrada de las palabras, cada cuánto se activa el siguiente hover (segundos)
const TOUCH_HOVER_GAP = 0.45;

type HippoLabOptions = {
  /** Animación de entrada (palabras + badge). false al llegar desde la transición: ya está visible. */
  entrance: boolean;
};

/**
 * <HippoLabScreen />:
 * - Badge: el texto circular gira en loop.
 * - Entrada: el statement entra palabra por palabra desde abajo, cada palabra recortada por su
 *   propia máscara (SplitText, se vuelve a partir si cambia el ancho o carga la fuente); el badge
 *   aparece con un pop.
 * - Hover "plan": sacudida suave jugando con la rotación (el resto de los hovers es CSS).
 * - Pantallas táctiles (sin hover): los estados del hover se activan solos, uno por uno, como
 *   parte de la entrada (atributo data-active, ver HippoLabScreen), y "plan" se sacude.
 * Con prefers-reduced-motion: sin loop ni entrada. Devuelve la limpieza.
 */
export function createHippoLabStatement(root: HTMLElement, { entrance }: HippoLabOptions): () => void {
  const mm = gsap.matchMedia();
  // El statement y el badge arrancan ocultos en la página (clase `invisible`) para que no se vean
  // antes de la entrada; sin entrada se muestran directo.
  const hidden = root.querySelectorAll("[data-lab-statement], [data-lab-badge]");
  const reveal = () => gsap.set(hidden, { autoAlpha: 1 });

  const words = gsap.utils.toArray<HTMLElement>(root.querySelectorAll("[data-lab-word]"));
  const activate = (el: HTMLElement) => el.setAttribute("data-active", "");
  const deactivateAll = () => words.forEach((el) => el.removeAttribute("data-active"));

  mm.add("(prefers-reduced-motion: reduce)", reveal);
  mm.add(`(prefers-reduced-motion: reduce) and ${TOUCH}`, () => {
    words.forEach(activate);
    return deactivateAll;
  });

  mm.add(MOTION, () => {
    gsap.to("[data-lab-ring]", { rotate: 360, duration: RING_LOOP, ease: "none", repeat: -1, transformOrigin: "50% 50%" });

    const statement = root.querySelector<HTMLElement>("[data-lab-statement]");
    if (!entrance || !statement) reveal();
    if (entrance && statement) {
      gsap.fromTo("[data-lab-badge]", { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.8, ease: "back.out(1.7)", delay: 0.2 });
      SplitText.create(statement, {
        type: "words",
        mask: "words",
        autoSplit: true,
        onSplit: (self) => {
          gsap.set(statement, { autoAlpha: 1 });
          return gsap.from(self.words, { yPercent: 110, duration: 0.8, ease: "power3.out", stagger: 0.07, delay: 0.35 });
        },
      });
    }

    // Sacudida de "plan."
    const shake = (el: HTMLElement) =>
      gsap.fromTo(
        el,
        { rotate: 0 },
        { keyframes: { rotate: [-4, 3.5, -2.5, 1.5, 0] }, duration: 0.55, ease: "power1.inOut", overwrite: true },
      );
    const shakers = gsap.utils.toArray<HTMLElement>(root.querySelectorAll("[data-lab-shake]"));
    const handlers = shakers.map((el) => {
      const onEnter = () => shake(el);
      el.addEventListener("pointerenter", onEnter);
      return () => el.removeEventListener("pointerenter", onEnter);
    });

    // Táctil: los hovers se activan solos al terminar la entrada (o enseguida si no hubo entrada)
    let touchCalls: gsap.core.Tween[] = [];
    if (window.matchMedia(TOUCH).matches) {
      const wordCount = statement?.textContent?.trim().split(/\s+/).length ?? 0;
      const start = entrance ? 0.35 + wordCount * 0.07 + 0.6 : 0.6;
      touchCalls = words.map((el, i) =>
        gsap.delayedCall(start + i * TOUCH_HOVER_GAP, () => {
          activate(el);
          if (el.hasAttribute("data-lab-shake")) shake(el);
        }),
      );
    }

    return () => {
      handlers.forEach((remove) => remove());
      touchCalls.forEach((call) => call.kill());
      deactivateAll();
    };
  });

  return () => mm.revert();
}
