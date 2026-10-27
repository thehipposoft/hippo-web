import type { ReactNode } from "react";
import { useTranslations } from "next-intl";

// Contenido del brochure (lib/brochure_27.pdf, págs. 3–8) para /brochure.
// Fuera de acá, a propósito: la portada (pág. 1, ya está en el inicio) y "Tecnología con propósito"
// (pág. 2, la cubre <AboutStatement />).
// Acá solo lo no traducible; los textos están en messages/*.json (Brochure.*) y
// useBrochureService() los suma a cada servicio.

export type ServiceColor = {
  /** Fondo del color del servicio */
  bg: string;
  /** Texto oscuro que acompaña al color (títulos sobre el fondo, número) */
  ink: string;
};

type ServiceId = "consultoria" | "branding" | "desarrollo-web" | "automatizacion";

type ServiceBase = {
  id: ServiceId;
  color: ServiceColor;
  /** Estilo de viñeta de la lista: cuadrados de colores alternados o guiones de un color */
  bullets?: { type: "squares"; colors: string[] } | { type: "dashes"; color: string };
  /** Clases de las etiquetas, en el orden de Brochure.services.<id>.tags */
  tagClassNames?: string[];
};

export type BrochureService = ServiceBase & {
  title: string;
  /** Resumen para las cards de "Nuestros servicios" (el segundo va destacado) */
  summary: [string, string];
  /** Frase de entrada (en negrita) */
  lead: string[];
  paragraphs: ReactNode[];
  /** Cierre en negrita */
  closing?: string;
  /** Pasos (Consultoría) */
  steps?: { title: string; text: string }[];
  /** Resultado después de los pasos */
  result?: ReactNode;
  /** "Podemos ayudarte con:" */
  capabilities?: string[];
  tags?: { label: string; className: string }[];
};

export const BROCHURE_SERVICES: ServiceBase[] = [
  { id: "consultoria", color: { bg: "bg-brand-blue", ink: "text-brand-darkblue" } },
  {
    id: "branding",
    color: { bg: "bg-brand-pink", ink: "text-brand-darkpink" },
    bullets: {
      type: "squares",
      colors: [
        "bg-brand-darkgreen",
        "bg-brand-green",
        "bg-brand-darkorange",
        "bg-brand-orange",
        "bg-brand-darkpink",
        "bg-brand-pink",
        "bg-brand-darkblue",
        "bg-brand-blue",
      ],
    },
  },
  {
    id: "desarrollo-web",
    color: { bg: "bg-brand-orange", ink: "text-brand-darkorange" },
    bullets: { type: "dashes", color: "bg-brand-green" },
    tagClassNames: [
      "bg-brand-green text-brand-darkgreen",
      "bg-brand-darkpink text-white",
      "bg-brand-orange text-brand-darkorange",
    ],
  },
  {
    id: "automatizacion",
    color: { bg: "bg-brand-green", ink: "text-brand-darkgreen" },
    bullets: { type: "dashes", color: "bg-brand-darkpink" },
    tagClassNames: [
      "bg-brand-green text-brand-darkgreen",
      "bg-brand-darkpink text-white",
      "bg-brand-orange text-brand-darkorange",
    ],
  },
];

/** Servicio completo (datos + textos del idioma activo) */
export function useBrochureService(base: ServiceBase): BrochureService {
  const t = useTranslations("Brochure.services");
  const id = base.id;
  const has = (key: string) => t.has(`${id}.${key}` as Parameters<typeof t.has>[0]);
  const raw = <T,>(key: string) => t.raw(`${id}.${key}` as Parameters<typeof t.raw>[0]) as T;

  const tags = has("tags")
    ? raw<string[]>("tags").map((label, i) => ({ label, className: base.tagClassNames?.[i] ?? "" }))
    : undefined;

  return {
    ...base,
    title: t(`${id}.title`),
    summary: raw<[string, string]>("summary"),
    lead: raw<string[]>("lead"),
    paragraphs: raw<string[]>("paragraphs"),
    closing: has("closing") ? raw<string>("closing") : undefined,
    steps: has("steps") ? raw<{ title: string; text: string }[]>("steps") : undefined,
    result: id === "consultoria" ? t.rich("consultoria.result", { strong: (chunks) => <strong>{chunks}</strong> }) : undefined,
    capabilities: has("capabilities") ? raw<string[]>("capabilities") : undefined,
    tags,
  };
}
