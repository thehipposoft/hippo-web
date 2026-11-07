// Verticales que comparten todas las pantallas de sección: tienen que continuar de una pantalla
// a la siguiente, así que se definen una sola vez. Clases completas para que Tailwind las genere.
// - Mobile: simétricas (5.5% / 94.5%); el botón del menú va arriba al centro.
// - Desktop (md): la izquierda en el borde derecho del botón de menú (size-14), que va a la izquierda.

/** Vertical izquierda */
export const GRID_LINE_LEFT = "left-[5.5%] md:left-14";
/** Vertical derecha */
export const GRID_LINE_RIGHT = "left-[94.5%]";

/** Contenido ubicado entre las dos verticales (posición absoluta / padding) */
export const GRID_CONTENT_INSET = "left-[5.5%] right-[5.5%] md:left-14";
export const GRID_CONTENT_PADDING = "pl-[5.5%] pr-[5.5%] md:pl-14";
