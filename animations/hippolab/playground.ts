import { gsap } from "gsap";
import Matter from "matter-js";

// Íconos que caen: uno por click, rotando los colores
const HIPPOS = ["blue", "green", "pink", "red"].map((c) => `/assets/images/hippolab/hippo-${c}.svg`);
const MAX_HIPPOS = 60;
// Radio del hippo relativo al ancho de la sección (con mínimo y máximo en px)
const RADIUS = { ratio: 0.032, min: 30, max: 62 };
// Piso: sobre la línea horizontal de abajo, entre las dos verticales (si se van por los costados,
// caen y se pierden). Se lee la posición real de las líneas (data-grid-line); estos valores son el
// respaldo si no están.
const FLOOR = { top: 0.81, left: 56, right: 0.945, thickness: 60 };
const BODY = { restitution: 0.55, friction: 0.08, frictionAir: 0.012, density: 0.002 };

type Hippo = { body: Matter.Body; el: HTMLImageElement; r: number };

/**
 * Lluvia de hippos con física (matter-js) dentro de `root`. Los hippos son <img> en `layer`
 * (fuera de React) que siguen a sus cuerpos; chocan, rebotan y rotan entre ellos sobre un piso.
 * El loop (gsap.ticker) solo corre mientras hay hippos. Devuelve `drop()` (un hippo) y la limpieza.
 */
export function createHippoRain(root: HTMLElement, layer: HTMLElement) {
  const engine = Matter.Engine.create({ gravity: { x: 0, y: 1.1 } });
  const hippos: Hippo[] = [];
  let floor: Matter.Body | null = null;
  let running = false;

  const size = () => root.getBoundingClientRect();

  const buildFloor = () => {
    const { width, height } = size();
    if (floor) Matter.Composite.remove(engine.world, floor);
    const line = (id: string) => root.querySelector<HTMLElement>(`[data-grid-line="${id}"]`);
    const left = line("left")?.offsetLeft ?? FLOOR.left;
    const right = line("right")?.offsetLeft ?? width * FLOOR.right;
    const top = line("bottom")?.offsetTop ?? height * FLOOR.top;
    floor = Matter.Bodies.rectangle((left + right) / 2, top + FLOOR.thickness / 2, right - left, FLOOR.thickness, {
      isStatic: true,
      friction: 0.6,
    });
    Matter.Composite.add(engine.world, floor);
  };

  const remove = (hippo: Hippo) => {
    Matter.Composite.remove(engine.world, hippo.body);
    hippo.el.remove();
    hippos.splice(hippos.indexOf(hippo), 1);
  };

  const tick = (_time: number, deltaMs: number) => {
    Matter.Engine.update(engine, Math.min(deltaMs, 33));
    const { height } = size();
    for (const hippo of [...hippos]) {
      const { x, y } = hippo.body.position;
      // Se fue por un costado y cayó: se pierde
      if (y > height + hippo.r * 4) {
        remove(hippo);
        continue;
      }
      hippo.el.style.transform = `translate(${x - hippo.r}px, ${y - hippo.r}px) rotate(${hippo.body.angle}rad)`;
    }
    if (!hippos.length) stop();
  };
  const start = () => {
    if (running) return;
    running = true;
    gsap.ticker.add(tick);
  };
  const stop = () => {
    if (!running) return;
    running = false;
    gsap.ticker.remove(tick);
  };

  const spawn = (src: string) => {
    const rect = size();
    const r = gsap.utils.clamp(RADIUS.min, RADIUS.max, rect.width * RADIUS.ratio);
    // Desde arriba del viewport (o de la sección, si su borde superior está más abajo)
    const y = Math.min(-r * 2, -rect.top - r * 2);
    const x = gsap.utils.random(rect.width * 0.12, rect.width * 0.6);

    const body = Matter.Bodies.circle(x, y, r, BODY);
    Matter.Body.setVelocity(body, { x: gsap.utils.random(-3, 3), y: gsap.utils.random(0, 4) });
    Matter.Body.setAngularVelocity(body, gsap.utils.random(-0.15, 0.15));
    Matter.Composite.add(engine.world, body);

    const el = document.createElement("img");
    el.src = src;
    el.alt = "";
    el.setAttribute("aria-hidden", "true");
    el.draggable = false;
    el.style.width = el.style.height = `${r * 2}px`;
    el.className = "absolute left-0 top-0 select-none will-change-transform";
    layer.appendChild(el);

    hippos.push({ body, el, r });
    if (hippos.length > MAX_HIPPOS) remove(hippos[0]);
    start();
  };

  /** Un hippo por click; el color va rotando (arranca en uno al azar) */
  let next = Math.floor(Math.random() * HIPPOS.length);
  const drop = () => {
    spawn(HIPPOS[next]);
    next = (next + 1) % HIPPOS.length;
  };

  buildFloor();
  window.addEventListener("resize", buildFloor);

  return {
    drop,
    destroy: () => {
      window.removeEventListener("resize", buildFloor);
      stop();
      [...hippos].forEach(remove);
      Matter.Engine.clear(engine);
    },
  };
}

/**
 * Botón de máquina "con física": al apretarlo la cara baja hasta tapar exactamente su base
 * (--press-x/--press-y); al soltarlo vuelve a su lugar con retroceso elástico. Devuelve la limpieza.
 */
export function createSquishyButton(button: HTMLElement): () => void {
  const face = button.querySelector<HTMLElement>("[data-squish-face]");
  if (!face) return () => {};

  // --press-x/--press-y están en em: se convierten a px con el tamaño de letra del botón
  const offset = () => {
    const styles = getComputedStyle(button);
    const em = parseFloat(styles.fontSize);
    return {
      x: (parseFloat(styles.getPropertyValue("--press-x")) || 0) * em,
      y: (parseFloat(styles.getPropertyValue("--press-y")) || 0) * em,
    };
  };

  const press = () => {
    const { x, y } = offset();
    // Sin escala: la cara tiene que calzar exacto sobre la base
    gsap.to(face, { x, y, duration: 0.08, ease: "power3.out", overwrite: true });
  };
  const release = () =>
    gsap.to(face, { x: 0, y: 0, duration: 1.2, ease: "elastic.out(1.5, 0.25)", overwrite: true });

  button.addEventListener("pointerdown", press);
  button.addEventListener("pointerup", release);
  button.addEventListener("pointerleave", release);
  button.addEventListener("pointercancel", release);
  return () => {
    button.removeEventListener("pointerdown", press);
    button.removeEventListener("pointerup", release);
    button.removeEventListener("pointerleave", release);
    button.removeEventListener("pointercancel", release);
  };
}
