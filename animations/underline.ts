// Revelado de subrayados de izquierda a derecha con clip-path.
// No usa DrawSVG a propósito: DrawSVG mide el largo del trazo al crear la animación y, si la fuente
// todavía no cargó, la palabra se ensancha después y el subrayado queda partido en dos tramos.
// El recorte acompaña el ancho real, sea cual sea. Los márgenes negativos dejan ver el grosor
// del trazo y sus puntas redondeadas, que sobresalen de la caja.

/** Estado inicial (oculto) y final (visible) para un gsap.fromTo */
export const UNDERLINE_HIDDEN = { clipPath: "inset(-200% 100% -200% -5%)" };
export const UNDERLINE_SHOWN = { clipPath: "inset(-200% -5% -200% -5%)" };
