import ContactScreen from "@/components/sections/contact/ContactScreen";
import HippoLabScreen from "@/components/sections/hippolab/HippoLabScreen";
import SectionHero from "@/components/SectionHero";
import type { Section } from "@/lib/sections";

type SectionScreenProps = {
  section: Section;
  /** false en la capa de transición (ver lib/useTileTransition.tsx) */
  intro?: boolean;
};

/**
 * Pantalla de llegada de cada sección: la página la muestra y la transición desde un recuadro
 * la usa como capa. Contact y Hippo Lab tienen la suya (pantalla blanca, sin título que viaja);
 * el resto usa <SectionHero />.
 */
export default function SectionScreen({ section, intro = true }: SectionScreenProps) {
  if (section.slug === "contact") return <ContactScreen section={section} intro={intro} />;
  if (section.slug === "hippo-lab") return <HippoLabScreen section={section} intro={intro} />;
  return <SectionHero section={section} intro={intro} />;
}
