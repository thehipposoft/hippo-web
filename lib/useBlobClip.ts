"use client";

import { useEffect, useId, useMemo, useRef, type RefObject } from "react";
import { gsap } from "gsap";
import { BLOB, buildPath, computeTargets, createBaseShape, stepSprings, type Point } from "@/animations/blob";

type BlobClipOptions = {
  /** Varía la forma base irregular (p. ej. el índice de la card) */
  seed: number;
};

/**
 * Recorte que en reposo es un rectángulo recto y cuyo borde se aparta del cursor cuando se acerca
 * (física de resorte). El cursor se sigue en toda la ventana: reaccionan las cards que lo tienen cerca,
 * aunque esté afuera. `targetRef` es la capa recortada (su caja = coords 0–1 del clipPath) y además
 * recibe el foco de teclado a través de su card (el ancestro enfocable más cercano).
 * Devuelve el id del <clipPath> (para `clip-path: url(#id)`), el ref de su <path> y el `d` inicial.
 * El loop (gsap.ticker) solo corre mientras el cursor está cerca o hay movimiento.
 * Con (pointer: coarse) o prefers-reduced-motion queda la forma base, sin animación.
 */
export function useBlobClip(targetRef: RefObject<HTMLElement | null>, { seed }: BlobClipOptions) {
  const clipId = `blob-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const pathRef = useRef<SVGPathElement>(null);
  const shape = useMemo(() => createBaseShape(seed), [seed]);
  const initialPath = useMemo(() => buildPath(shape), [shape]);

  useEffect(() => {
    const target = targetRef.current;
    const path = pathRef.current;
    if (!target || !path) return;
    if (window.matchMedia("(pointer: coarse), (prefers-reduced-motion: reduce)").matches) return;

    const offsets: Point[] = shape.map(() => ({ x: 0, y: 0 }));
    const velocities: Point[] = shape.map(() => ({ x: 0, y: 0 }));
    let client: { x: number; y: number } | null = null;
    let focused = false;
    let running = false;

    // Cursor en coords de la capa; null si está lejos de la card
    const localMouse = (): Point | null => {
      if (!client) return null;
      const rect = target.getBoundingClientRect();
      const x = (client.x - rect.left) / rect.width;
      const y = (client.y - rect.top) / rect.height;
      const r = BLOB.reach;
      return x > -r && x < 1 + r && y > -r && y < 1 + r ? { x, y } : null;
    };

    const tick = () => {
      const mouse = localMouse();
      const energy = stepSprings(offsets, velocities, computeTargets(shape, mouse, focused));
      path.setAttribute("d", buildPath(shape, offsets));
      // Se apaga solo cuando el cursor está lejos, sin foco, y quedó en reposo
      if (!mouse && !focused && energy < BLOB.restEnergy) stop();
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
      offsets.forEach((o) => ((o.x = 0), (o.y = 0)));
      velocities.forEach((v) => ((v.x = 0), (v.y = 0)));
      path.setAttribute("d", initialPath);
    };

    // Cursor en toda la ventana: si se acerca a esta card, arranca el loop
    const onMove = (event: PointerEvent) => {
      client = { x: event.clientX, y: event.clientY };
      if (!running && localMouse()) start();
    };
    const onLeaveWindow = () => {
      client = null;
    };

    // Foco de teclado: lo recibe la card (el ancestro enfocable)
    const focusTarget = target.closest<HTMLElement>("a, button, [tabindex]") ?? target;
    const onFocus = () => {
      focused = focusTarget.matches(":focus-visible");
      if (focused) start();
    };
    const onBlur = () => {
      focused = false;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeaveWindow);
    focusTarget.addEventListener("focus", onFocus);
    focusTarget.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeaveWindow);
      focusTarget.removeEventListener("focus", onFocus);
      focusTarget.removeEventListener("blur", onBlur);
      gsap.ticker.remove(tick);
    };
  }, [targetRef, shape, initialPath]);

  return { clipId, pathRef, initialPath };
}
