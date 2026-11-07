import { useTranslations } from "next-intl";
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
  const t = useTranslations("Sections");
  return (
    <div className="relative h-svh w-full overflow-hidden">
      <div data-hero-panel className="absolute inset-0 bg-brand-black">
        <SectionHeroLines intro={intro} />
      </div>

      {/* Mobile: centrado en el marco de líneas (30%–70%); desktop: entre el 30% y el 60% */}
      <div className="absolute left-[calc(5.5%_+_1.25rem)] top-[30%] flex h-[40%] items-center md:left-[7.5%] md:h-[30%]">
        <h1
          data-hero-title
          className="origin-top-left whitespace-pre-line font-display text-[13vw] font-bold leading-[0.85] text-white md:text-[clamp(2.75rem,7.8vw,7.5rem)]"
        >
          {t(`${section.slug}.heroTitle`)}
        </h1>
      </div>

      <SectionMenu section={section} />
    </div>
  );
}
