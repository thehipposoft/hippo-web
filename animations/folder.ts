import { gsap } from "gsap";

/**
 * Pestañas de <Folder />: se levantan con el hover y "rebotan" al apretarlas.
 * Debe llamarse dentro de un gsap.context() con scope en el folder. Devuelve la limpieza de listeners.
 */
export function createFolderTabs(root: HTMLElement): () => void {
  const tabs = gsap.utils.toArray<HTMLElement>(root.querySelectorAll("[data-folder-tab]"));
  gsap.set(tabs, { transformOrigin: "50% 100%" });

  const cleanups = tabs.map((tab) => {
    const handlers: [string, () => void][] = [
      ["pointerenter", () => gsap.to(tab, { y: -4, duration: 0.3, ease: "power2.out", overwrite: "auto" })],
      ["pointerleave", () => gsap.to(tab, { y: 0, scale: 1, duration: 0.35, ease: "power2.out", overwrite: "auto" })],
      ["pointerdown", () => gsap.to(tab, { scale: 0.93, duration: 0.12, ease: "power2.out", overwrite: "auto" })],
      ["pointerup", () => gsap.to(tab, { scale: 1, duration: 0.5, ease: "back.out(3)", overwrite: "auto" })],
    ];
    handlers.forEach(([type, fn]) => tab.addEventListener(type, fn));
    return () => handlers.forEach(([type, fn]) => tab.removeEventListener(type, fn));
  });

  return () => cleanups.forEach((cleanup) => cleanup());
}

/** Entrada suave del contenido de la pestaña elegida */
export function showFolderPanel(panel: HTMLElement): gsap.core.Tween {
  return gsap.fromTo(panel, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: "power2.out" });
}
