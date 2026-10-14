import { gsap } from "gsap";
import { createHeroLinesDraw } from "@/animations/sectionHero";

type TileTransitionOptions = {
  /** Capa fija que contiene el <SectionHero /> de destino */
  overlay: HTMLElement;
  /** Recuadro clickeado */
  tile: HTMLElement;
  /** Caja central de <Start />: se convierte en el botón de menú */
  box: HTMLElement | null;
  onComplete: () => void;
};

/**
 * Transición recuadro → pantalla de sección.
 * El <SectionHero /> de la capa ya está maquetado en su estado final; acá se lo lleva
 * a la posición del recuadro (fondo recortado, título y botón) y se anima hasta su lugar.
 * Debe llamarse dentro de un gsap.context() con scope en la capa.
 */
export function createTileTransition({ overlay, tile, box, onComplete }: TileTransitionOptions) {
  const panel = overlay.querySelector<HTMLElement>("[data-hero-panel]");
  const lines = overlay.querySelector<HTMLElement>("[data-hero-lines]");
  const title = overlay.querySelector<HTMLElement>("[data-hero-title]");
  const menu = overlay.querySelector<HTMLElement>("[data-hero-menu]");
  const menuIcon = overlay.querySelector<HTMLElement>("[data-hero-menu-icon]");
  const tileTitle = tile.querySelector<HTMLElement>("[data-start-tile-title-hover]");

  const tl = gsap.timeline({
    defaults: { duration: 1, ease: "power3.inOut" },
    onComplete,
  });
  if (!panel || !title || !menu || !tileTitle) return tl.call(onComplete);

  const view = overlay.getBoundingClientRect();
  const tileStyles = getComputedStyle(tile);

  // Fondo: arranca recortado al recuadro (con su color y esquinas) y se abre a pantalla completa
  const t = tile.getBoundingClientRect();
  const radius = parseFloat(tileStyles.borderTopLeftRadius) || 0;
  const fromClip = `inset(${t.top - view.top}px ${view.right - t.right}px ${view.bottom - t.bottom}px ${t.left - view.left}px round ${radius}px)`;
  const toClip = "inset(0px 0px 0px 0px round 0px)";
  const fromBg = tileStyles.backgroundColor;
  const toBg = getComputedStyle(panel).backgroundColor;

  // Título: arranca encima del título del recuadro (mismo tamaño y posición del primer renglón)
  const srcStyles = getComputedStyle(tileTitle);
  const dstStyles = getComputedStyle(title);
  const srcFont = parseFloat(srcStyles.fontSize);
  const dstFont = parseFloat(dstStyles.fontSize);
  const scale = srcFont / dstFont;
  const srcRect = tileTitle.getBoundingClientRect();
  const dstRect = title.getBoundingClientRect();
  const srcHalfLeading = (parseFloat(srcStyles.lineHeight) - srcFont) / 2;
  const dstHalfLeading = (parseFloat(dstStyles.lineHeight) - dstFont) / 2;
  const srcTop = srcRect.top + parseFloat(srcStyles.paddingTop) + srcHalfLeading;
  const titleFrom = {
    x: srcRect.left - dstRect.left,
    y: srcTop - (dstRect.top + dstHalfLeading * scale),
    scale,
    color: srcStyles.color,
  };
  const titleTo = { x: 0, y: 0, scale: 1, color: dstStyles.color };

  tl.set(overlay, { autoAlpha: 1 }, 0)
    .fromTo(panel, { clipPath: fromClip, backgroundColor: fromBg }, { clipPath: toClip, backgroundColor: toBg }, 0)
    .fromTo(title, titleFrom, { ...titleTo, duration: 1.1 }, 0);

  // Las líneas se dibujan mientras termina de abrirse el fondo
  if (lines) tl.add(createHeroLinesDraw(lines).timeScale(1.6), 0.4);

  // Caja central → botón de menú (se desplaza a la izquierda y se achica)
  if (box) {
    const b = box.getBoundingClientRect();
    const m = menu.getBoundingClientRect();
    const scaleX = b.width / m.width;
    // Esquinas: arranca con las de la caja (compensando la escala) y termina con las del botón
    const boxRadius = parseFloat(
      getComputedStyle(box.querySelector("[data-start-fill]") ?? box).borderTopLeftRadius,
    ) || 0;
    const from = `${boxRadius / scaleX}px`;
    const menuStyles = getComputedStyle(menu);
    const menuRadius = [
      menuStyles.borderTopLeftRadius,
      menuStyles.borderTopRightRadius,
      menuStyles.borderBottomRightRadius,
      menuStyles.borderBottomLeftRadius,
    ].join(" ");
    tl.set(box, { autoAlpha: 0 }, 0)
      .fromTo(
        menu,
        {
          x: b.left - m.left,
          y: b.top - m.top,
          scaleX,
          scaleY: b.height / m.height,
          borderRadius: `${from} ${from} ${from} ${from}`,
        },
        { x: 0, y: 0, scaleX: 1, scaleY: 1, borderRadius: menuRadius },
        0,
      )
      .fromTo(menuIcon, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, ease: "power1.out" }, 0.8);
  }

  return tl;
}
