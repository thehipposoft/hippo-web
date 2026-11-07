import { gsap } from "gsap";
// ScrollTrigger se registra una sola vez, en lib/useGsap.ts

const ACTIVE_SCALE = 2;
// Geometría: separación entre años sobre el círculo (grados), radio y altura del punto más alto
// del arco (donde va el activo) relativos a la sección, y distancia del año hacia adentro del
// círculo (px; negativa = por fuera).
// Mobile: rueda más grande que la pantalla (arco abierto) con los años por fuera, para que el
// contenido del activo tenga todo el ancho debajo.
const GEOMETRY = {
  desktop: { stepDeg: 30, radiusW: 0.36, radiusH: 0.95, topY: 0.36, labelInset: 64 },
  mobile: { stepDeg: 24, radiusW: 0.62, radiusH: 0.95, topY: 0.26, labelInset: -34 },
};
const MOBILE = "(max-width: 767px)";

type Wheel = { goTo: (index: number) => void; destroy: () => void };

/**
 * Rueda de años de <AboutWheel />, en loop. El año activo queda siempre arriba al medio; al elegir
 * otro, la rueda gira por el camino más corto (se anima un único valor `pos` y cada recuadro se
 * recoloca sobre el círculo en cada cuadro). Cada año se ubica a su distancia "envuelta" del activo,
 * así siempre se ven todos: el que sale por un extremo entra por el otro (con fade en el cruce).
 * Al llegar, el recuadro se agranda y aparece su contenido.
 * Marcado: [data-wheel-circle], [data-wheel-box], [data-wheel-label], [data-wheel-content] (mismo orden).
 * Debe llamarse dentro de un gsap.context() con scope en la sección.
 */
export function createWheel(root: HTMLElement, initial = 0): Wheel {
  const circle = root.querySelector<HTMLElement>("[data-wheel-circle]");
  const boxes = gsap.utils.toArray<HTMLElement>(root.querySelectorAll("[data-wheel-box]"));
  const labels = gsap.utils.toArray<HTMLElement>(root.querySelectorAll("[data-wheel-label]"));
  const contents = gsap.utils.toArray<HTMLElement>(root.querySelectorAll("[data-wheel-content]"));
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const state = { pos: initial };
  let current = initial;
  let tl: gsap.core.Timeline | null = null;

  const count = boxes.length;
  // Distancia de un año al activo, envuelta a [-count/2, count/2)
  const wrapOffset = (i: number) => {
    const half = count / 2;
    return ((((i - state.pos + half) % count) + count) % count) - half;
  };
  // Cerca del punto de cruce (±count/2) el año se desvanece, para que el salto no se vea
  const edgeOpacity = (offset: number) => gsap.utils.clamp(0, 1, (count / 2 - Math.abs(offset)) * 2);

  const layout = () => {
    const { width, height } = root.getBoundingClientRect();
    const { stepDeg, radiusW, radiusH, topY, labelInset } = window.matchMedia(MOBILE).matches ? GEOMETRY.mobile : GEOMETRY.desktop;
    const r = Math.min(width * radiusW, height * radiusH);
    const cx = width / 2;
    const cy = height * topY + r;

    if (circle) gsap.set(circle, { width: r * 2, height: r * 2, x: cx - r, y: cy - r });

    boxes.forEach((box, i) => {
      const offset = wrapOffset(i);
      const deg = -90 + offset * stepDeg;
      const rad = (deg * Math.PI) / 180;
      // El recuadro sigue la curva (tangente); el año queda derecho, hacia adentro del círculo
      const edge = edgeOpacity(offset);
      gsap.set(box, { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad), rotate: deg + 90, opacity: edge });
      // El año del activo lo oculta su propio tween (autoAlpha); acá solo el desvanecido del cruce
      gsap.set(labels[i], {
        x: cx + (r - labelInset) * Math.cos(rad),
        y: cy + (r - labelInset) * Math.sin(rad),
        "--edge": edge,
      });
    });
  };

  // Estado inicial
  gsap.set([...boxes, ...labels], { xPercent: -50, yPercent: -50, left: 0, top: 0 });
  gsap.set(boxes, { scale: (i: number) => (i === initial ? ACTIVE_SCALE : 1) });
  gsap.set(labels, { autoAlpha: (i: number) => (i === initial ? 0 : 1) });
  gsap.set(contents, { autoAlpha: (i: number) => (i === initial ? 1 : 0) });
  layout();

  const goTo = (index: number) => {
    if (index === current || index < 0 || index >= count) return;
    current = index;
    tl?.kill();

    const others = (list: HTMLElement[]) => list.filter((_, i) => i !== index);
    // Camino más corto: el destino es `pos` + la distancia envuelta del año elegido
    const delta = wrapOffset(index);
    const target = state.pos + delta;
    const spin = 0.8 + Math.abs(delta) * 0.15; // más años de distancia, giro un poco más largo

    tl = gsap
      .timeline({ defaults: { ease: "power2.out" } })
      // Se va el contenido anterior y los demás recuadros vuelven a su tamaño
      .to(others(contents), { autoAlpha: 0, y: -10, duration: 0.25 }, 0)
      .to(others(boxes), { scale: 1, duration: 0.5 }, 0)
      .to(others(labels), { autoAlpha: 1, duration: 0.3 }, 0.2)
      .to(labels[index], { autoAlpha: 0, duration: 0.2 }, 0)
      // Gira la rueda
      .to(state, { pos: target, duration: spin, ease: "power3.inOut", onUpdate: layout }, 0)
      // Al llegar al medio: se agranda y despliega su contenido
      .to(boxes[index], { scale: ACTIVE_SCALE, duration: 0.6, ease: "back.out(1.6)" }, spin - 0.25)
      .fromTo(contents[index], { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.5 }, spin - 0.1);

    if (reduced) tl.progress(1);
  };

  window.addEventListener("resize", layout);
  // NewBlack puede cargar después y cambiar el tamaño de los textos
  document.fonts?.ready.then(layout);

  return {
    goTo,
    destroy: () => {
      tl?.kill();
      window.removeEventListener("resize", layout);
    },
  };
}
