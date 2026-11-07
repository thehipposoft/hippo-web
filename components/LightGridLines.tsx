import { GRID_LINE_LEFT, GRID_LINE_RIGHT } from "@/lib/sectionGrid";

// Patrón de líneas de las pantallas de fondo blanco (Contact, About, Hippo Lab):
// las verticales continúan las del resto del sitio y dos horizontales de borde a borde.
// En mobile las horizontales se pegan a los bordes: la de arriba alineada con el borde inferior
// del botón del menú (size-14, arriba al centro) y la de abajo a la misma distancia del borde.
// data-grid-*: otras animaciones leen dónde están (p. ej. el piso de los hippos de Hippo Lab).
const LINES = [
  { id: "left", className: `inset-y-0 ${GRID_LINE_LEFT} w-px` },
  { id: "right", className: `inset-y-0 ${GRID_LINE_RIGHT} w-px` },
  { id: "top", className: "inset-x-0 top-14 h-px md:top-[15%]" },
  { id: "bottom", className: "inset-x-0 bottom-14 h-px md:bottom-auto md:top-[81%]" },
];

/** Líneas de fondo; el contenedor tiene que ser `relative` (o absoluto) y definir el fondo blanco */
export default function LightGridLines() {
  return LINES.map((line) => (
    <span key={line.id} aria-hidden data-grid-line={line.id} className={`absolute bg-brand-blue/50 ${line.className}`} />
  ));
}
