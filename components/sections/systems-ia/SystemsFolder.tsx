import Folder from "@/components/Folder";
import { useTranslations } from "next-intl";

// Pestañas: color propio cuando está atrás; la activa se pinta de blanco, como la hoja.
// Las etiquetas (pills) alternan colores, como en el brochure.
const TABS = [
  { id: "agents", className: "bg-brand-orange text-brand-darkorange" },
  { id: "automations", className: "bg-brand-green text-brand-darkgreen" },
  { id: "systems", className: "bg-brand-darkgreen text-brand-green" },
] as const;
const TAG_COLORS = [
  "bg-brand-green text-brand-darkgreen",
  "bg-brand-darkpink text-white",
  "bg-brand-orange text-brand-darkorange",
  "bg-brand-blue text-brand-darkblue",
];

type TabId = (typeof TABS)[number]["id"];

/** Hoja de un servicio: frase de entrada + texto (desktop en dos columnas) y etiquetas */
function ServicePanel({ id }: { id: TabId }) {
  const t = useTranslations("Systems.folder.items");
  const paragraphs = t.raw(`${id}.paragraphs`) as string[];
  const tags = t.raw(`${id}.tags`) as string[];
  const closing = t.has(`${id}.closing`) ? t(`${id}.closing` as `agents.closing`) : null;

  return (
    <div className="grid gap-6 text-black md:min-h-[clamp(18rem,40svh,24rem)] md:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] md:gap-[4%]">
      <div className="flex flex-col justify-between gap-6">
        <h3 className="font-display text-[7vw] font-bold leading-[1.1] md:text-[clamp(1.6rem,2.4vw,2.75rem)]">{t(`${id}.lead`)}</h3>
        <ul className="flex flex-wrap gap-2 text-[0.8rem] md:text-[clamp(0.8rem,0.85vw,0.95rem)]">
          {tags.map((tag, i) => (
            <li key={tag} className={`rounded-lg px-3 py-0.5 font-display font-bold ${TAG_COLORS[i % TAG_COLORS.length]}`}>
              {tag}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col gap-4 text-[0.95rem] leading-relaxed md:text-[clamp(0.95rem,1vw,1.1rem)]">
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        {closing && <p className="font-bold">{closing}</p>}
      </div>
    </div>
  );
}

/** Systems & IA · pantalla 3: folder con lo que hacemos (agentes, automatizaciones, sistemas). */
export default function SystemsFolder() {
  const t = useTranslations("Systems.folder");
  return (
    // En el flujo (no h-svh): el alto lo da el contenido de la hoja activa
    <section className="relative w-full bg-brand-black py-[12svh] md:min-h-svh md:py-[12svh]">
      <div className="px-[calc(5.5%_+_1.25rem)] md:ml-[12.7%] md:w-[70%] md:px-0">
        <h2 className="mb-[6svh] font-display text-[7vw] font-bold text-white md:mb-[5svh] md:text-[clamp(1.5rem,2.1vw,2.5rem)]">
          {t("title")}
        </h2>

        <Folder
          size="lg"
          frameClassName="shadow-[3px_4px_0_0_var(--color-brand-darkgreen)]"
          panelClassName="p-6 md:p-[4%]"
          tabs={TABS.map((tab) => ({
            ...tab,
            label: t(`tabs.${tab.id}`),
            activeClassName: "bg-white text-black",
            content: <ServicePanel id={tab.id} />,
          }))}
        />
      </div>
    </section>
  );
}
