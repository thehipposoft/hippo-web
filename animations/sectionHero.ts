import { gsap } from "gsap";

/**
 * Las líneas de la grilla de <SectionHero /> se dibujan (verticales y horizontales
 * crecen desde su origen). Lo usan la entrada de la página y la transición desde un recuadro.
 */
export function createHeroLinesDraw(container: HTMLElement): gsap.core.Timeline {
  const vertical = container.querySelectorAll("[data-hero-line='v']");
  const horizontal = container.querySelectorAll("[data-hero-line='h']");

  return gsap
    .timeline({ defaults: { duration: 1.2, ease: "power3.inOut" } })
    .set(container, { autoAlpha: 1 }, 0)
    .fromTo(vertical, { scaleY: 0 }, { scaleY: 1, stagger: 0.08 }, 0)
    .fromTo(horizontal, { scaleX: 0 }, { scaleX: 1, stagger: 0.08 }, 0.1);
}
