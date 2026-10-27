// Geometría y física del recorte "blob" (coordenadas 0–1, clipPathUnits="objectBoundingBox").
// Funciones puras: el loop y los listeners viven en lib/useBlobClip.ts.

// La capa recortada se agranda `overflow` por lado respecto de la card (clase -inset-[6%] en el
// markup): en reposo el rectángulo coincide con la card y queda margen para estirarse hacia afuera.
const OVERFLOW = 0.06;

export const BLOB = {
  /** Puntos sobre el contorno */
  points: 48,
  /** Margen del rectángulo base dentro de la capa (coords 0–1 de la capa) */
  inset: OVERFLOW / (1 + OVERFLOW * 2),
  /** Amplitud de la irregularidad de la forma base (0 = rectángulo recto en reposo) */
  wobble: 0,
  /** Repulsión: cuánto se aparta el borde del cursor y radio de influencia (gaussiana), coords de la capa */
  push: 0.09,
  radius: 0.2,
  /** Distancia del cursor a la card (coords de la capa) a partir de la cual empieza a reaccionar */
  reach: 0.35,
  /** Estiramiento hacia el centro con foco de teclado */
  focusStrength: 0.08,
  /** Resorte: rigidez y amortiguación (v = (v + (target - offset) * stiffness) * damping) */
  stiffness: 0.08,
  damping: 0.82,
  /** Por debajo de esta energía total (sin cursor encima) se apaga el loop */
  restEnergy: 0.0005,
} as const;

export type Point = { x: number; y: number };

/** Contorno base: cuadrado con inset, cada punto desplazado sobre su normal con dos senos según `seed` */
export function createBaseShape(seed: number): Point[] {
  const { points, inset, wobble } = BLOB;
  const size = 1 - inset * 2;
  const shape: Point[] = [];

  for (let i = 0; i < points; i++) {
    const t = (i / points) * 4; // 0–4: un lado por unidad (arriba, derecha, abajo, izquierda)
    const side = Math.floor(t);
    const u = t - side;
    // Punto sobre el lado y su normal hacia afuera
    const [x, y, nx, ny] =
      side === 0 ? [inset + u * size, inset, 0, -1]
      : side === 1 ? [1 - inset, inset + u * size, 1, 0]
      : side === 2 ? [1 - inset - u * size, 1 - inset, 0, 1]
      : [inset, 1 - inset - u * size, -1, 0];

    const phase = (i / points) * Math.PI * 2;
    const wave = (Math.sin(phase * 3 + seed * 1.7) + Math.sin(phase * 5 + seed * 2.9)) / 2;
    shape.push({ x: x + nx * wave * wobble, y: y + ny * wave * wobble });
  }
  return shape;
}

const f = (n: number) => n.toFixed(4);

/** Índices de las esquinas (cada lado tiene points/4 tramos) */
const isCorner = (i: number) => i % (BLOB.points / 4) === 0;

/**
 * Catmull-Rom cerrado → cúbicas Bézier, por lado: en las esquinas no se toma el punto del otro lado
 * como vecino, así las esquinas quedan en ángulo y, en reposo, los lados son rectos.
 */
export function buildPath(shape: Point[], offsets?: Point[]): string {
  const n = shape.length;
  const wrap = (i: number) => ((i % n) + n) % n;
  const p = (i: number) => {
    const k = wrap(i);
    const o = offsets?.[k];
    return { x: shape[k].x + (o?.x ?? 0), y: shape[k].y + (o?.y ?? 0) };
  };

  let d = `M${f(p(0).x)} ${f(p(0).y)}`;
  for (let i = 0; i < n; i++) {
    const p1 = p(i);
    const p2 = p(i + 1);
    const p0 = isCorner(wrap(i)) ? p1 : p(i - 1);
    const p3 = isCorner(wrap(i + 1)) ? p2 : p(i + 2);
    d += `C${f(p1.x + (p2.x - p0.x) / 6)} ${f(p1.y + (p2.y - p0.y) / 6)} ${f(p2.x - (p3.x - p1.x) / 6)} ${f(p2.y - (p3.y - p1.y) / 6)} ${f(p2.x)} ${f(p2.y)}`;
  }
  return `${d}Z`;
}

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

/**
 * Target de cada punto: se aparta del cursor (fuerza gaussiana según la distancia) y, con foco,
 * se estira hacia el centro. Limitado a la capa (más allá no hay imagen). 0 en reposo.
 */
export function computeTargets(shape: Point[], mouse: Point | null, focused: boolean): Point[] {
  const { push, radius, focusStrength } = BLOB;
  return shape.map((pt) => {
    let x = 0;
    let y = 0;
    if (mouse) {
      const dx = pt.x - mouse.x;
      const dy = pt.y - mouse.y;
      const dist = Math.hypot(dx, dy) || 1e-6;
      const force = push * Math.exp(-(dist * dist) / (2 * radius * radius));
      x += (dx / dist) * force;
      y += (dy / dist) * force;
    }
    if (focused) {
      x += (0.5 - pt.x) * focusStrength;
      y += (0.5 - pt.y) * focusStrength;
    }
    return { x: clamp01(pt.x + x) - pt.x, y: clamp01(pt.y + y) - pt.y };
  });
}

/** Un paso de resorte por punto (muta offsets/velocities). Devuelve la energía total. */
export function stepSprings(offsets: Point[], velocities: Point[], targets: Point[]): number {
  const { stiffness, damping } = BLOB;
  let energy = 0;
  for (let i = 0; i < offsets.length; i++) {
    const o = offsets[i];
    const v = velocities[i];
    const t = targets[i];
    v.x = (v.x + (t.x - o.x) * stiffness) * damping;
    v.y = (v.y + (t.y - o.y) * stiffness) * damping;
    o.x += v.x;
    o.y += v.y;
    energy += v.x * v.x + v.y * v.y + (t.x - o.x) ** 2 + (t.y - o.y) ** 2;
  }
  return energy;
}
