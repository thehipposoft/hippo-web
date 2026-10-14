import { gsap } from "gsap";

const CHAR_STAGGER = 0.01;

/**
 * Hover por palabra: cada letra sale de su recorte y entra su copia desde el lado opuesto,
 * alternando la dirección (pares bajan, impares suben).
 * Marcado esperado (ver <RollText />): [data-roll-word] > [data-roll-char] > original + copia.
 * Devuelve una función que quita los listeners.
 */
export function createCharRoll(root: HTMLElement): () => void {
  const words = gsap.utils.toArray<HTMLElement>(root.querySelectorAll("[data-roll-word]"));

  const cleanups = words.map((word) => {
    const tl = gsap.timeline({ paused: true, defaults: { duration: 0.4, ease: "power1.inOut" } });

    word.querySelectorAll<HTMLElement>("[data-roll-char]").forEach((char, i) => {
      const direction = char.dataset.rollChar === "down" ? 1 : -1;
      // Original y copia se mueven juntos: el original sale, la copia ocupa su lugar
      tl.to(char.children, { yPercent: direction * 100 }, i * CHAR_STAGGER);
    });

    const enter = () => tl.play();
    const leave = () => tl.reverse();
    word.addEventListener("mouseenter", enter);
    word.addEventListener("mouseleave", leave);

    return () => {
      word.removeEventListener("mouseenter", enter);
      word.removeEventListener("mouseleave", leave);
      tl.kill();
    };
  });

  return () => cleanups.forEach((cleanup) => cleanup());
}
