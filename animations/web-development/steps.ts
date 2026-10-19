import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

// Giro con el que queda apoyada cada tarjeta sobre la pila (la primera ya está en su lugar)
const CARD_ROTATION = [0, -2.5, 2, -1.5];
// Tarjetas tapadas (efecto mazo): por cada nivel de profundidad se achican y oscurecen un poco más
const COVERED_SCALE_STEP = 0.08;
const COVERED_SHADE_STEP = 0.3;
const COVERED_SHADE_MAX = 0.6;

/**
 * <WebDevSteps />: la sección se pinea y el scroll recorre los pasos.
 * - Scrubbed: cada tarjeta (marco + ícono) sube desde el borde inferior de su caja (que la recorta)
 *   y se apila sobre la anterior; las de abajo se achican y oscurecen (mazo de cartas).
 * - Al cambiar de paso: se resaltan el texto del paso y su botón, y la descripción cambia con fade.
 * - Los botones llevan con scroll suave a su paso.
 * Debe llamarse dentro de un gsap.context() con scope en la sección. Devuelve la limpieza de listeners.
 */
export function createWebDevSteps(root: HTMLElement): () => void {
  const q = gsap.utils.selector(root);
  const cards = q("[data-step-card]");
  const labels = q("[data-step-label]");
  const buttons = q<HTMLButtonElement>("[data-step-button]");
  const descriptions = q("[data-step-description]");
  const lastStep = cards.length - 1;

  const styles = getComputedStyle(root);
  const activeColor = styles.getPropertyValue("--steps-active").trim() || "#000";
  const mutedColor = styles.getPropertyValue("--steps-muted").trim() || "#a3a3a3";

  // Estado inicial: paso 1 visible, el resto de las tarjetas fuera de pantalla
  gsap.set(cards[0], { rotate: CARD_ROTATION[0] });
  gsap.set(descriptions, { autoAlpha: 0 });
  gsap.set(descriptions[0], { autoAlpha: 1 });

  const shades = cards.map((card) => card.querySelector("[data-step-shade]"));

  const tl = gsap.timeline({ defaults: { ease: "power2.out" } }).addLabel("step0", 0);
  cards.slice(1).forEach((card, i) => {
    const step = i + 1;
    tl.fromTo(
      card,
      { yPercent: 105, rotate: 10 },
      { yPercent: 0, rotate: CARD_ROTATION[step] ?? 0, duration: 1 },
      step - 1,
    );
    // Mientras entra, las tarjetas de abajo bajan un nivel en el mazo
    for (let k = 0; k < step; k++) {
      const depth = step - k;
      tl.to(cards[k], { scale: 1 - COVERED_SCALE_STEP * depth, duration: 1, ease: "power2.inOut" }, step - 1).to(
        shades[k],
        { opacity: Math.min(COVERED_SHADE_MAX, COVERED_SHADE_STEP * depth), duration: 1, ease: "power2.inOut" },
        step - 1,
      );
    }
    tl.addLabel(`step${step}`, step);
  });

  let current = 0;
  const goToStep = (step: number) => {
    if (step === current) return;
    current = step;
    gsap.to(labels, { color: (k: number) => (k === step ? activeColor : mutedColor), duration: 0.4, overwrite: "auto" });
    gsap.to(buttons, {
      backgroundColor: (k: number) => (k === step ? activeColor : mutedColor),
      duration: 0.4,
      overwrite: "auto",
    });
    buttons.forEach((button, k) => {
      if (k === step) button.setAttribute("aria-current", "step");
      else button.removeAttribute("aria-current");
    });
    descriptions.forEach((description, k) => {
      gsap.to(description, {
        autoAlpha: k === step ? 1 : 0,
        duration: k === step ? 0.7 : 0.3,
        delay: k === step ? 0.2 : 0,
        ease: "power1.out",
        overwrite: "auto",
      });
    });
  };

  const st = ScrollTrigger.create({
    animation: tl,
    trigger: root,
    start: "top top",
    end: () => `+=${lastStep * window.innerHeight}`,
    pin: true,
    scrub: 1,
    snap: { snapTo: "labels", duration: { min: 0.3, max: 0.8 }, ease: "power2.inOut" },
    invalidateOnRefresh: true,
    onUpdate: (self) => goToStep(Math.round(self.progress * lastStep)),
  });

  // Botones: scroll suave hasta el paso
  const handlers = buttons.map((button, step) => {
    const onClick = () =>
      gsap.to(window, {
        scrollTo: st.start + ((st.end - st.start) * step) / lastStep,
        duration: 1,
        ease: "power2.inOut",
      });
    button.addEventListener("click", onClick);
    return () => button.removeEventListener("click", onClick);
  });

  return () => handlers.forEach((remove) => remove());
}
