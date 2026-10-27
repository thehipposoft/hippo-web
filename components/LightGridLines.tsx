import { GRID_LINE_LEFT, GRID_LINE_RIGHT } from "@/lib/sectionGrid";

// Patrón de líneas de las pantallas de fondo blanco (Contact, About):
// las verticales continúan las del resto del sitio y dos horizontales de borde a borde.
const LINES = [
  `inset-y-0 ${GRID_LINE_LEFT} w-px`,
  `inset-y-0 ${GRID_LINE_RIGHT} w-px`,
  "inset-x-0 top-[15%] h-px",
  "inset-x-0 top-[81%] h-px",
];

/** Líneas de fondo; el contenedor tiene que ser `relative` (o absoluto) y definir el fondo blanco */
export default function LightGridLines() {
  return LINES.map((className) => (
    <span key={className} aria-hidden className={`absolute bg-brand-blue/50 ${className}`} />
  ));
}
