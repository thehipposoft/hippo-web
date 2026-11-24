import { gsap } from "gsap";

/**
 * Flotación del cartel "scroll" (<ScrollCue />): sube y baja en loop.
 * Debe llamarse dentro de un gsap.context(). Respetar prefers-reduced-motion desde quien lo llama.
 */
export function createScrollCueFloat(cue: Element | null): gsap.core.Tween | null {
  const float = cue?.querySelector("[data-scroll-cue-float]");
  if (!float) return null;
  return gsap.to(float, { y: -8, duration: 1.3, ease: "sine.inOut", repeat: -1, yoyo: true });
}
