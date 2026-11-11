import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// ScrollTrigger se registra una sola vez, en lib/useGsap.ts

const MOTION = "(prefers-reduced-motion: no-preference)";
// Giro con el que entra cada card (alternado) antes de apoyarse derecha sobre la pila
const ENTER_ROTATION = [5, -4, 4.5, -3.5];

/**
 * <PortfolioSingleProyect />:
 * - Entrada: el título del proyecto sube con fade y aparece el cartel "scroll", que queda flotando.
 * - Scroll (sección pineada, scrubbed): cada capa del proyecto es una card que sube desde abajo
 *   de la pantalla, girada, y se apoya sobre la anterior (la pila se corre un poco en cada card,
 *   ver OFFSETS en el componente). Mientras entra la primera, el título sale hacia arriba con fade;
 *   al llegar la última se va el cartel "scroll".
 * Con prefers-reduced-motion: todo visible y las cards ya apiladas, sin pin.
 * Debe llamarse dentro de un gsap.context() con scope en la sección. Devuelve la limpieza.
 */
export function createPortfolioSingle(root: HTMLElement): () => void {
  const intro = root.querySelectorAll("[data-single-intro]");
  const title = root.querySelector("[data-single-title]");
  const scrollCue = root.querySelector("[data-single-scroll]");
  const scrollFloat = root.querySelector("[data-single-scroll-float]");
  const cards = gsap.utils.toArray<HTMLElement>(root.querySelectorAll("[data-single-card]"));
  const mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: reduce)", () => {
    gsap.set([...intro, scrollCue], { autoAlpha: 1 });
  });

  mm.add(MOTION, () => {
    // Entrada
    gsap
      .timeline({ delay: 0.3 })
      .fromTo(intro, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.12 })
      .fromTo(scrollCue, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.4");
    gsap.to(scrollFloat, { y: -8, duration: 1.3, ease: "sine.inOut", repeat: -1, yoyo: true });

    if (!cards.length) return;

    // Cards: cada una ocupa una pantalla de scroll
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
    cards.forEach((card, i) => {
      tl.fromTo(
        card,
        { y: () => window.innerHeight, rotate: ENTER_ROTATION[i % ENTER_ROTATION.length] },
        { y: 0, rotate: 0, duration: 1 },
        i,
      );
    });
    // Salida del título (en el envoltorio: la entrada anima los hijos), durante la entrada de la primera card
    tl.to(title, { autoAlpha: 0, y: () => -window.innerHeight * 0.12, duration: 0.35, ease: "power1.out" }, 0);
    tl.to(scrollCue, { autoAlpha: 0, duration: 0.3 }, cards.length - 0.5);

    ScrollTrigger.create({
      animation: tl,
      trigger: root,
      start: "top top",
      end: () => `+=${cards.length * window.innerHeight}`,
      pin: true,
      scrub: 1,
      snap: { snapTo: 1 / cards.length, duration: { min: 0.3, max: 0.8 }, ease: "power2.inOut" },
      invalidateOnRefresh: true,
    });
  });

  return () => mm.revert();
}
