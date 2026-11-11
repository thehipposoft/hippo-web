import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
// ScrollTrigger se registra una sola vez, en lib/useGsap.ts

gsap.registerPlugin(SplitText);

const MOTION = "(prefers-reduced-motion: no-preference)";

/**
 * Entrada de <PortfolioStatement />: la frase [data-portfolio-lines] entra línea por línea desde
 * abajo, cada línea recortada por su propia máscara (como el cierre de About). SplitText vuelve a
 * partir las líneas si cambia el ancho o carga la fuente.
 * Con prefers-reduced-motion no se anima. Debe llamarse dentro de un gsap.context(). Devuelve la limpieza.
 */
export function createPortfolioStatement(root: HTMLElement): () => void {
  const text = root.querySelector<HTMLElement>("[data-portfolio-lines]");
  const mm = gsap.matchMedia();

  mm.add(MOTION, () => {
    if (!text) return;
    SplitText.create(text, {
      type: "lines",
      mask: "lines",
      autoSplit: true,
      onSplit: (self) =>
        gsap.from(self.lines, {
          yPercent: 105,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: text, start: "top 80%", once: true },
        }),
    });
  });

  return () => mm.revert();
}
