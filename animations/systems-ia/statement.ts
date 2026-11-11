import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { UNDERLINE_HIDDEN, UNDERLINE_SHOWN } from "@/animations/underline";

gsap.registerPlugin(ScrollTrigger);

// Segundos entre un carácter y el siguiente
const TYPE_INTERVAL = 0.03;
// Velocidad del trazo del subrayado (px por segundo) y pausa entre renglones
const UNDERLINE_SPEED = 900;
const UNDERLINE_LINE_GAP = 0.05;
// Trazos irregulares, como dibujados a mano (viewBox 300×12, como en <WebDevStory />), alternados por renglón
const UNDERLINE_PATHS = ["M3 7C60 5 120 4 180 5C230 6 270 7 297 8", "M3 5C55 7 115 8 175 6C225 4 268 4 297 6"];
// Posición del trazo respecto del renglón (en em): alto y cuánto baja del borde inferior de la línea
const STROKE_HEIGHT = 0.2;
const STROKE_DROP = 0.14;
const SVG_NS = "http://www.w3.org/2000/svg";

/** Un trazo del subrayado, posicionado sobre un renglón */
function createStroke(path: string): HTMLElement {
  const wrapper = document.createElement("span");
  wrapper.className = "absolute text-brand-blue";
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", "0 0 300 12");
  svg.setAttribute("preserveAspectRatio", "none");
  svg.setAttribute("fill", "none");
  svg.setAttribute("class", "block size-full overflow-visible");
  const stroke = document.createElementNS(SVG_NS, "path");
  stroke.setAttribute("d", path);
  stroke.setAttribute("stroke", "currentColor");
  stroke.setAttribute("stroke-width", "5");
  stroke.setAttribute("stroke-linecap", "round");
  stroke.setAttribute("vector-effect", "non-scaling-stroke");
  svg.append(stroke);
  wrapper.append(svg);
  return wrapper;
}

/**
 * Una caja por renglón del elemento: getClientRects() devuelve una por cada carácter (cada uno es
 * un span para el tipeo), así que se agrupan por renglón y se unen. Los espacios al final de un
 * renglón (ancho 0) no cuentan.
 */
function lineRects(element: HTMLElement): { left: number; top: number; width: number; height: number }[] {
  const lines: { left: number; right: number; top: number; height: number }[] = [];
  for (const rect of element.getClientRects()) {
    if (rect.width < 1) continue;
    const line = lines.find((item) => Math.abs(item.top - rect.top) < rect.height / 2);
    if (line) {
      line.left = Math.min(line.left, rect.left);
      line.right = Math.max(line.right, rect.right);
    } else {
      lines.push({ left: rect.left, right: rect.right, top: rect.top, height: rect.height });
    }
  }
  return lines.sort((a, b) => a.top - b.top).map(({ left, right, top, height }) => ({ left, top, width: right - left, height }));
}

/**
 * Entrada de <SystemsStatement /> al llegar con el scroll: el texto se escribe carácter por carácter
 * y, al terminar, se dibuja el subrayado.
 * El subrayado se arma midiendo los renglones reales del texto marcado ([data-systems-underline]):
 * un trazo continuo por renglón, dibujados uno tras otro en orden de lectura. Si el texto cambia de
 * ancho (resize), los trazos se vuelven a armar, ya dibujados.
 * Debe llamarse dentro de un gsap.context() con scope en la sección. Devuelve la limpieza.
 */
export function createSystemsStatement(root: HTMLElement): () => void {
  const chars = root.querySelectorAll("[data-type-char]");
  const marked = root.querySelector<HTMLElement>("[data-systems-underline]");
  const layer = root.querySelector<HTMLElement>("[data-systems-underline-layer]");
  let drawn = false;
  let drawing: gsap.core.Timeline | null = null;

  /** Arma un trazo por renglón del texto marcado; con `animate`, los dibuja en secuencia */
  const renderUnderline = (animate: boolean) => {
    if (!marked || !layer) return;
    drawing?.kill();
    layer.replaceChildren();
    const origin = layer.getBoundingClientRect();
    const styles = getComputedStyle(marked);
    const fontSize = parseFloat(styles.fontSize);
    const lineHeight = parseFloat(styles.lineHeight) || fontSize * 1.2;
    const rects = lineRects(marked);

    const strokes = rects.map((rect, i) => {
      const stroke = createStroke(UNDERLINE_PATHS[i % UNDERLINE_PATHS.length]);
      // La caja de un fragmento inline es el área de la fuente, centrada en el renglón
      const lineBottom = rect.top + (rect.height + lineHeight) / 2;
      gsap.set(stroke, {
        left: rect.left - origin.left - (i === 0 ? fontSize * 0.1 : 0),
        width: rect.width + (i === 0 ? fontSize * 0.1 : 0),
        top: lineBottom - origin.top + fontSize * (STROKE_DROP - STROKE_HEIGHT),
        height: fontSize * STROKE_HEIGHT,
        ...(animate ? UNDERLINE_HIDDEN : UNDERLINE_SHOWN),
      });
      layer.append(stroke);
      return { stroke, width: rect.width };
    });

    if (!animate) return;
    drawing = gsap.timeline();
    strokes.forEach(({ stroke, width }, i) => {
      drawing?.to(
        stroke,
        { ...UNDERLINE_SHOWN, duration: Math.max(0.2, width / UNDERLINE_SPEED), ease: i === strokes.length - 1 ? "power1.out" : "none" },
        i === 0 ? 0 : `+=${UNDERLINE_LINE_GAP}`,
      );
    });
  };

  const tl = gsap
    .timeline({ scrollTrigger: { trigger: root, start: "top 60%", once: true } })
    .fromTo(chars, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01, stagger: TYPE_INTERVAL })
    .call(
      () => {
        drawn = true;
        renderUnderline(true);
      },
      [],
      "+=0.2",
    );

  // Si cambian los renglones (resize), rearmar los trazos ya dibujados
  let lastWidth = layer?.offsetWidth ?? 0;
  const observer = new ResizeObserver(() => {
    const width = layer?.offsetWidth ?? 0;
    if (width === lastWidth) return;
    lastWidth = width;
    if (drawn) renderUnderline(false);
  });
  if (layer) observer.observe(layer);

  return () => {
    observer.disconnect();
    drawing?.kill();
    tl.kill();
    layer?.replaceChildren();
  };
}
