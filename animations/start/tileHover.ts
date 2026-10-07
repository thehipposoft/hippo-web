import { gsap } from "gsap";

/**
 * Hover de los recuadros de <Start />: fondo blanco, borde gris y el título
 * sale hacia arriba (con leve giro a la izquierda) mientras entra su copia oscura desde abajo.
 * Devuelve una función que quita los listeners.
 * Debe llamarse dentro de un gsap.context() con scope en la sección.
 */
export function createTileHover(root: HTMLElement): () => void {
  const styles = getComputedStyle(root);
  const hoverBg = styles.getPropertyValue("--start-tile-hover-bg").trim() || "#fff";
  const hoverBorder = styles.getPropertyValue("--start-tile-hover-border").trim() || "#d4d4d4";

  const cleanups = gsap.utils.toArray<HTMLElement>("[data-start-tile]").map((tile) => {
    const { backgroundColor } = getComputedStyle(tile);
    const title = tile.querySelector("[data-start-tile-title]");
    const titleHover = tile.querySelector("[data-start-tile-title-hover]");

    const tl = gsap
      .timeline({ paused: true })
      .fromTo(
        tile,
        { backgroundColor, borderColor: backgroundColor },
        { backgroundColor: hoverBg, borderColor: hoverBorder, duration: 0.45, ease: "power2.out" },
        0,
      )
      .fromTo(
        title,
        { yPercent: 0, rotate: 0 },
        { yPercent: -110, rotate: -6, duration: 0.35, ease: "power3.in" },
        0,
      )
      .fromTo(
        titleHover,
        // Entra girada al revés: así el extremo derecho de los títulos largos
        // queda por debajo del recorte y no asoma antes del hover
        { yPercent: 110, rotate: 6 },
        { yPercent: 0, rotate: 0, duration: 0.5, ease: "power3.out" },
        0.25,
      );

    const enter = () => tl.timeScale(1).play();
    const leave = () => tl.timeScale(1.4).reverse();

    tile.addEventListener("mouseenter", enter);
    tile.addEventListener("mouseleave", leave);
    tile.addEventListener("focus", enter);
    tile.addEventListener("blur", leave);

    return () => {
      tile.removeEventListener("mouseenter", enter);
      tile.removeEventListener("mouseleave", leave);
      tile.removeEventListener("focus", enter);
      tile.removeEventListener("blur", leave);
      tl.kill();
    };
  });

  return () => cleanups.forEach((cleanup) => cleanup());
}
