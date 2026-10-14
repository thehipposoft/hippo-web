import SectionHeroLines from "@/components/SectionHeroLines";
import SectionMenu from "@/components/SectionMenu";
import type { Section } from "@/lib/sections";

type SectionHeroProps = {
  section: Section;
  /** Animación de entrada propia (las líneas se dibujan). false en la capa de transición. */
  intro?: boolean;
};

/**
 * Pantalla de entrada de cada sección. También se usa como capa de transición en <Start />
 * (ver animations/start/tileTransition.ts), así que su estado final tiene que coincidir
 * exactamente con esta maqueta.
 */
export default function SectionHero({ section, intro = true }: SectionHeroProps) {
  return (
    <div className="relative h-svh w-full overflow-hidden">
      <div data-hero-panel className="absolute inset-0 bg-brand-black">
        <SectionHeroLines intro={intro} />
      </div>

      <div className="absolute left-[7.5%] top-[30%] flex h-[30%] items-center">
        <h1
          data-hero-title
          className="origin-top-left whitespace-pre-line font-display text-[clamp(2.75rem,7.8vw,7.5rem)] font-bold leading-[0.85] text-white"
        >
          {section.heroTitle}
        </h1>
      </div>

      <SectionMenu section={section} />
    </div>
  );
}
