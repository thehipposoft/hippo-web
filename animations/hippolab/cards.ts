import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Mazo cerrado: corridas y giradas apenas, para que asomen los bordes de las de abajo
// (orden del DOM: la última queda arriba)
const STACKED = [
  { x: -26, y: 10, rotate: -11 },
  { x: -12, y: 4, rotate: -5 },
  { x: 0, y: 0, rotate: 0 },
];
// Abiertas en tres (x en % del ancho de la carta)
const SPREAD = [
  { xPercent: -118, y: 0, rotate: -10 },
  { xPercent: 0, y: -6, rotate: 1.5 },
  { xPercent: 118, y: 6, rotate: 12 },
];

/**
 * Cartas de <HippoLabCards />:
 * - Cerradas: apiladas y boca abajo.
 * - Al pasar el mouse por el mazo: el fondo pasa a oscuro, las cartas se abren en tres y flotan
 *   (el hover con sombra es CSS). Al salir de la sección se cierran y vuelven boca abajo.
 * - Click en una carta: se da vuelta y muestra su hippo (otro click la vuelve a tapar).
 * En táctil no hay hover: el primer toque abre el mazo y se cierra al salir la sección de la
 * pantalla (el pointerleave del toque la cerraba enseguida, tapando la carta recién dada vuelta).
 * Debe llamarse dentro de un gsap.context() con scope en la sección. Devuelve la limpieza.
 */
export function createHippoCards(root: HTMLElement): () => void {
  const deck = root.querySelector<HTMLElement>("[data-cards-deck]");
  const cards = gsap.utils.toArray<HTMLElement>(root.querySelectorAll("[data-card]"));
  const floats = cards.map((card) => card.querySelector<HTMLElement>("[data-card-float]"));
  const flips = cards.map((card) => card.querySelector<HTMLElement>("[data-card-flip]"));
  if (!deck || !cards.length) return () => {};

  const styles = getComputedStyle(root);
  const dark = styles.getPropertyValue("--cards-dark").trim() || "#212121";
  const light = styles.backgroundColor;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  gsap.set(cards, { xPercent: 0, x: (i: number) => STACKED[i]?.x ?? 0, y: (i: number) => STACKED[i]?.y ?? 0, rotate: (i: number) => STACKED[i]?.rotate ?? 0 });

  const open = gsap
    .timeline({ paused: true, defaults: { duration: 0.7, ease: "power3.out" } })
    .to(root, { backgroundColor: dark, duration: 0.5, ease: "power2.out" }, 0)
    .to("[data-cards-title]", { color: "#ffffff", duration: 0.5, ease: "power2.out" }, 0)
    .to("[data-cards-hint]", { autoAlpha: 1, duration: 0.4 }, 0.3)
    .to(cards, {
      x: 0,
      xPercent: (i: number) => SPREAD[i]?.xPercent ?? 0,
      y: (i: number) => SPREAD[i]?.y ?? 0,
      rotate: (i: number) => SPREAD[i]?.rotate ?? 0,
      stagger: 0.05,
      ease: "back.out(1.4)",
    }, 0.05);
  gsap.set("[data-cards-hint]", { autoAlpha: 0 });

  // Flotación mientras están abiertas
  let floating: gsap.core.Tween[] = [];
  const startFloat = () => {
    if (reduced || floating.length) return;
    floating = floats.map((el, i) =>
      gsap.to(el, { y: -10, duration: 1.6 + i * 0.25, ease: "sine.inOut", repeat: -1, yoyo: true, delay: i * 0.15 }),
    );
  };
  const stopFloat = () => {
    floating.forEach((t) => t.kill());
    floating = [];
    gsap.to(floats, { y: 0, duration: 0.4, ease: "power2.out" });
  };

  const faceUp = new Set<number>();
  const flip = (i: number, up: boolean) => {
    const el = flips[i];
    if (!el) return;
    if (up) faceUp.add(i);
    else faceUp.delete(i);
    gsap.to(el, { rotationY: up ? 180 : 0, duration: reduced ? 0 : 0.75, ease: "power3.inOut", overwrite: true });
  };

  let isOpen = false;
  const openDeck = () => {
    if (isOpen) return;
    isOpen = true;
    open.timeScale(1).play();
    startFloat();
  };
  const closeDeck = () => {
    if (!isOpen) return;
    isOpen = false;
    [...faceUp].forEach((i) => flip(i, false));
    stopFloat();
    open.timeScale(1.4).reverse();
  };

  const onClick = (i: number) => () => {
    // En táctil el primer toque abre el mazo
    if (!isOpen) return openDeck();
    flip(i, !faceUp.has(i));
  };
  const clickHandlers = cards.map((card, i) => {
    const handler = onClick(i);
    card.addEventListener("click", handler);
    return () => card.removeEventListener("click", handler);
  });

  // Hover solo con mouse/lápiz: con el dedo, cada toque dispara enter y leave
  const onEnter = (event: PointerEvent) => {
    if (event.pointerType !== "touch") openDeck();
  };
  const onLeave = (event: PointerEvent) => {
    if (event.pointerType !== "touch") closeDeck();
  };
  deck.addEventListener("pointerenter", onEnter);
  root.addEventListener("pointerleave", onLeave);
  const outOfView = ScrollTrigger.create({ trigger: root, start: "top bottom", end: "bottom top", onLeave: closeDeck, onLeaveBack: closeDeck });

  return () => {
    deck.removeEventListener("pointerenter", onEnter);
    root.removeEventListener("pointerleave", onLeave);
    outOfView.kill();
    clickHandlers.forEach((remove) => remove());
    floating.forEach((t) => t.kill());
    open.kill();
    gsap.set(root, { backgroundColor: light });
  };
}
