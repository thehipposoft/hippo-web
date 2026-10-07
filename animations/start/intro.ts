import { gsap } from "gsap";

const LOGO_CENTER_WIDTH = 0.5; // ancho del logo centrado, relativo a la caja

/**
 * Animación de entrada de <Start />.
 * Debe llamarse dentro de un gsap.context() con scope en la sección.
 */
export function createStartIntro(root: HTMLElement): gsap.core.Timeline {
  const box = root.querySelector<HTMLElement>("[data-start-box]");
  const logo = root.querySelector<HTMLElement>("[data-start-logo]");
  const tl = gsap.timeline({ defaults: { ease: "power3.inOut" } });
  if (!box || !logo) return tl;

  // El logo arranca centrado y grande en la caja; termina en su lugar (abajo a la izquierda).
  const boxRect = box.getBoundingClientRect();
  const logoRect = logo.getBoundingClientRect();
  const fromX = boxRect.left + boxRect.width / 2 - (logoRect.left + logoRect.width / 2);
  const fromY = boxRect.top + boxRect.height / 2 - (logoRect.top + logoRect.height / 2);
  const fromScale = (boxRect.width * LOGO_CENTER_WIDTH) / logoRect.width;

  const restOpacity =
    parseFloat(getComputedStyle(root).getPropertyValue("--start-line-rest")) || 1;

  tl.set(root, { autoAlpha: 1 })
    // Líneas principales: dibujan la caja
    .fromTo("[data-start-line='main-v']", { scaleY: 0 }, { scaleY: 1, duration: 1.4, stagger: 0.15 }, 0)
    .fromTo("[data-start-line='main-h']", { scaleX: 0 }, { scaleX: 1, duration: 1.4, stagger: 0.15 }, 0.1)
    // Logo: aparece en el centro…
    .fromTo(
      logo,
      { autoAlpha: 0, x: fromX, y: fromY, scale: fromScale },
      { autoAlpha: 1, duration: 0.8, ease: "power2.out" },
      0.2,
    )
    // …y se ubica abajo a la izquierda antes de que terminen las líneas
    .to(logo, { x: 0, y: 0, scale: 1, duration: 0.9 }, 1)
    // Grilla secundaria: sale desde la caja hacia afuera
    .fromTo("[data-start-line='grid-v']", { scaleY: 0 }, { scaleY: 1, duration: 0.8, stagger: 0.05 }, 1.1)
    .fromTo("[data-start-line='grid-h']", { scaleX: 0 }, { scaleX: 1, duration: 0.8, stagger: 0.05 }, 1.15)
    // Texto
    .fromTo(
      "[data-start-text]",
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 1.5, ease: "power2.out" },
      1.5,
    )
    // Las líneas bajan de intensidad y quedan como grilla de fondo
    .to("[data-start-line]", { opacity: restOpacity, duration: 0.8, ease: "power1.out" }, ">-0.3");

  return tl;
}
