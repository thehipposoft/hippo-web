import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Desde dónde entra cada recuadro: completamente fuera de pantalla
const TILE_FROM: Record<string, gsap.TweenVars> = {
  top: { y: "-100vh" },
  bottom: { y: "100vh" },
  left: { x: "-100vw" },
  right: { x: "100vw" },
};

// Momentos del timeline (1 unidad ≈ 100% del alto de pantalla de scroll)
// Cada tanda de recuadros: cuándo empieza a entrar y cuándo llega a su lugar.
// Las dos primeras entran desfasadas pero llegan juntas.
const WAVES = [
  { at: 1, arrive: 2.2 }, // Branding & Design, Web Development
  { at: 1.3, arrive: 2.2 }, // Hippo Lab, Automation
  { at: 2.6, arrive: 3.6 }, // Contact, About Us
  { at: 2.85, arrive: 3.85 }, // Brochure, Portfolio
];
const SHRINK_AT = 2.2; // la caja empieza a achicarse cuando llegan las 2 primeras tandas
const SHRINK_DURATION = 1.6;

/**
 * Animación de <Start /> ligada al scroll (sección pineada).
 * Paso 2: la caja se achica, se pinta de color y cambia el texto.
 * Paso 3: entran los recuadros (laterales primero, después arriba/abajo).
 * Paso 4: se va el texto, la caja se achica hasta su tamaño final (los recuadros la siguen),
 *         entran los recuadros de los costados y el logo pasa a su versión chica.
 * Paso 5: los recuadros se vuelven clickeables.
 * Debe llamarse dentro de un gsap.context() con scope en la sección.
 */
export function createStartScroll(root: HTMLElement): gsap.core.Timeline {
  const styles = getComputedStyle(root);
  const endScale = parseFloat(styles.getPropertyValue("--start-scale-end")) || 0.62;
  const inkFilled = styles.getPropertyValue("--start-ink-filled").trim() || "#fff";
  const tilesZoom = parseFloat(styles.getPropertyValue("--start-tiles-zoom")) || 1;

  const tiles = gsap.utils.toArray<HTMLElement>("[data-start-tile]");
  const tileRadius = tiles[0] ? getComputedStyle(tiles[0]).borderRadius : "0px";

  const tl = gsap.timeline({ defaults: { ease: "none" } });

  // ── Paso 2 ──────────────────────────────────────────────────────
  tl
    .fromTo(root, { "--start-scale": 1 }, { "--start-scale": endScale, duration: 1, ease: "power2.inOut" }, 0)
    .fromTo("[data-start-fill]", { opacity: 0 }, { opacity: 1, duration: 0.6 }, 0.3)
    .fromTo("[data-start-logo-inverse]", { opacity: 0 }, { opacity: 1, duration: 0.6 }, 0.3)
    .to("[data-start-copy]", { color: inkFilled, autoAlpha: 0, duration: 0.3 }, 0.3)
    .fromTo("[data-start-copy-alt]", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 0.6);

  // ── Paso 3: recuadros ───────────────────────────────────────────
  tiles.forEach((tile) => {
    const from = TILE_FROM[tile.dataset.from ?? ""] ?? {};
    const wave = WAVES[Number(tile.dataset.wave ?? 0)] ?? WAVES[0];
    tl.fromTo(
      tile,
      from,
      { x: 0, y: 0, duration: wave.arrive - wave.at, ease: "power2.out" },
      wave.at,
    );
  });

  // ── Paso 4 ──────────────────────────────────────────────────────
  tl
    // Se va el texto y la caja se achica hasta su tamaño final
    .to("[data-start-copy-alt]", { autoAlpha: 0, duration: 0.25 }, SHRINK_AT)
    .fromTo(root, { "--start-t": 0 }, { "--start-t": 1, duration: SHRINK_DURATION, ease: "power2.inOut" }, SHRINK_AT)
    // La capa de recuadros arranca ampliada (recuadros grandes, margen proporcional alrededor)
    // y vuelve a su tamaño junto con la caja
    .fromTo(
      "[data-start-tiles]",
      { scale: tilesZoom },
      { scale: 1, duration: SHRINK_DURATION, ease: "power2.inOut" },
      SHRINK_AT,
    )
    // Logo grande → logo chico
    .to("[data-start-logo]", { autoAlpha: 0, duration: 0.25 }, SHRINK_AT + 0.9)
    .fromTo("[data-start-mark]", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, SHRINK_AT + 1.1)
    // La caja toma las esquinas de los recuadros y la grilla de líneas se retira
    .to("[data-start-fill]", { borderRadius: tileRadius, duration: 0.4 }, SHRINK_AT + 1.2)
    .to("[data-start-line]", { autoAlpha: 0, duration: 0.4 }, SHRINK_AT + 1.2);

  // ── Paso 5 ──────────────────────────────────────────────────────
  tl.set(tiles, { pointerEvents: "auto" }, tl.duration());

  // El largo del scroll acompaña la duración del timeline
  ScrollTrigger.create({
    animation: tl,
    trigger: root,
    start: "top top",
    end: () => `+=${tl.duration() * window.innerHeight}`,
    pin: true,
    scrub: 1,
    invalidateOnRefresh: true,
  });

  return tl;
}
