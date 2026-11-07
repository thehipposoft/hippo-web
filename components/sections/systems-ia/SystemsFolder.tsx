import Folder from "@/components/Folder";
import { useTranslations } from "next-intl";

// Pestañas: color propio cuando está atrás; la activa se pinta de blanco, como la hoja
const TABS = [
  { id: "chatbots", className: "bg-brand-orange text-brand-darkorange" },
  { id: "agents", className: "bg-brand-green text-brand-darkgreen" },
  { id: "workflows", className: "bg-brand-darkgreen text-brand-green" },
] as const;

/** Systems & IA · pantalla 3: folder grande con lo que hacemos (chatbots, agentes, workflows). */
export default function SystemsFolder() {
  const t = useTranslations("Systems.folder");
  return (
    <section className="relative h-svh w-full overflow-hidden bg-brand-black">
      <h2 className="absolute left-[calc(5.5%_+_1.25rem)] top-[13%] font-display text-[7vw] font-bold text-white md:left-[12.8%] md:top-[10%] md:text-[clamp(1.5rem,2.1vw,2.5rem)]">
        {t("title")}
      </h2>

      <Folder
        size="lg"
        // Mobile: ocupa el ancho entre los márgenes y crece hacia abajo (hoja vertical)
        className="absolute left-[calc(5.5%_+_1.25rem)] right-[calc(5.5%_+_1.25rem)] top-[21%] md:right-auto md:left-[12.7%] md:top-[18.7%] md:w-[66%]"
        frameClassName="shadow-[3px_4px_0_0_var(--color-brand-darkgreen)]"
        panelClassName="p-[3%]"
        tabs={TABS.map((tab) => ({
          ...tab,
          label: t(`tabs.${tab.id}`),
          activeClassName: "bg-white text-black",
          // TODO: imagen / video de cada servicio
          content: <div aria-hidden className="aspect-[3/4] w-full rounded-xl md:aspect-[1002/444]" />,
        }))}
      />
    </section>
  );
}
