import { GRID_LINE_LEFT, GRID_LINE_RIGHT } from "@/lib/sectionGrid";


// Líneas de fondo: las verticales continúan las de <SectionHero />
const LINES = [
  `inset-y-0 ${GRID_LINE_LEFT} w-px`,
  `inset-y-0 ${GRID_LINE_RIGHT} w-px`,
  "inset-x-0 top-[17%] h-px",
  `${GRID_LINE_LEFT} right-0 top-[86%] h-px`,
]

/** Portfolio · pantalla 2: frase de entrada. */
export default function PortfolioStatement() {
  return (
    <section className="relative h-svh w-full overflow-hidden bg-brand-black">
      {LINES.map((className) => (
        <span key={className} aria-hidden className={`absolute bg-brand-blue/50 ${className}`} />
      ))}

      <div className="absolute inset-y-[17%] left-[8.2%] right-[12%] flex items-center">
        <p className="font-display text-statement font-bold leading-[1.3] text-white">
          Every digital experience.
          <br />
          has more than one layer.
        </p>
      </div>
    </section>
  );
}
