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
      <h2 className="absolute left-[12.8%] top-[10%] font-display text-[clamp(1.5rem,2.1vw,2.5rem)] font-bold text-white">
        {t("title")}
      </h2>

      <Folder
        size="lg"
        className="absolute left-[12.7%] top-[18.7%] w-[66%]"
        frameClassName="shadow-[3px_4px_0_0_var(--color-brand-darkgreen)]"
        panelClassName="p-[3%]"
        tabs={TABS.map((tab) => ({
          ...tab,
          label: t(`tabs.${tab.id}`),
          activeClassName: "bg-white text-black",
          // TODO: imagen / video de cada servicio
          content: <div aria-hidden className="aspect-[1002/444] w-full rounded-xl" />,
        }))}
      />
    </section>
  );
}
