"use client";

import { useRef } from "react";
import Image from "next/image";
import { createWebDevSteps } from "@/animations/web-development/steps";
import { GRID_LINE_LEFT, GRID_LINE_RIGHT } from "@/lib/sectionGrid";
import { useGsap } from "@/lib/useGsap";
import { useTranslations } from "next-intl";

// Íconos y color de la palabra activa de cada paso (colores de la marca);
// los textos están en WebDev.steps.items (mismo orden). Clases completas para que Tailwind las genere.
const STEPS = [
  { color: "[--label-active:var(--color-brand-blue)]", icon: { src: "/assets/images/webdev/webdev-icon1.png", width: 340, height: 328 } },
  { color: "[--label-active:var(--color-brand-pink)]", icon: { src: "/assets/images/webdev/webdev-icon2.png", width: 400, height: 318 } },
  { color: "[--label-active:var(--color-brand-green)]", icon: { src: "/assets/images/webdev/webdev-icon3.png", width: 340, height: 328 } },
  { color: "[--label-active:var(--color-brand-orange)]", icon: { src: "/assets/images/webdev/webdev-icon4.png", width: 349, height: 328 } },
] as const;

type StepText = { label: string; title: string; description: string };

// Líneas de fondo: las verticales de los extremos continúan las de las pantallas anteriores
// Mobile: simétricas (solo las verticales de los extremos y las horizontales pegadas a los bordes)
const LINES = [
  `inset-y-0 ${GRID_LINE_LEFT} w-px`,
  "inset-y-0 left-[73.7%] hidden w-px md:block",
  `inset-y-0 ${GRID_LINE_RIGHT} w-px`,
  "inset-x-0 top-14 h-px md:top-[15%]",
  "inset-x-0 top-[36.7%] hidden h-px md:block",
  "inset-x-0 bottom-14 h-px md:bottom-auto md:left-14 md:top-[84%]",
];

/** Web Development · proceso en 4 pasos, recorrido con el scroll (sección pineada). */
export default function WebDevSteps() {
  const t = useTranslations("WebDev.steps");
  const items = t.raw("items") as StepText[];
  const rootRef = useRef<HTMLElement>(null);

  useGsap((root) => createWebDevSteps(root), rootRef);

  return (
    <section
      ref={rootRef}
      className="relative h-svh w-full overflow-hidden bg-white text-black [--steps-active:#000000] [--steps-muted:#a3a3a3] [--steps-card:#F7F5F2]"
    >
      {LINES.map((className) => (
        <span key={className} aria-hidden className={`absolute bg-brand-blue/50 ${className}`} />
      ))}

      {/* Mobile: columna entre las líneas (título → números → tarjeta → descripción).
          Desktop: `contents`, cada parte se ubica sola en la pantalla */}
      <div className="absolute inset-x-[calc(5.5%_+_1.25rem)] bottom-[calc(3.5rem_+_1.5rem)] top-[calc(3.5rem_+_1.5rem)] flex flex-col gap-4 md:contents">
      {/* Título y pasos */}
      <div className="font-display font-bold md:absolute md:left-[5.5%] md:top-[19%]">
        <h2 className="text-[clamp(1.25rem,2vw,2.25rem)] leading-tight tracking-tight">
          {t("heading")}
          <br />
          {t("headingLine2")}
        </h2>
        <p className="mt-[0.4em] text-[clamp(1.35rem,2.15vw,2.4rem)]">
          {items.map((step, i) => (
            <span
              key={step.label}
              data-step-label
              className={`${STEPS[i]?.color ?? ""} ${i === 0 ? "text-(--label-active)" : "text-(--steps-muted)"}`}
            >
              {i > 0 && <span aria-hidden>→ </span>}
              {step.label}
              <sup className="ml-[0.1em] text-[0.3em]">{i + 1}</sup>
              {i < items.length - 1 && " "}
            </span>
          ))}
        </p>
      </div>

      {/* Navegación por pasos */}
      <nav aria-label={t("nav")} className="flex gap-1.5 md:absolute md:left-[5.5%] md:top-[39.5%]">
        {items.map((step, i) => (
          <button
            key={step.label}
            type="button"
            data-step-button
            aria-label={t("stepLabel", { number: i + 1, label: step.label })}
            aria-current={i === 0 ? "step" : undefined}
            className={`flex size-[clamp(1.75rem,2.2vw,2.5rem)] cursor-pointer items-center justify-center rounded-full font-display text-[clamp(0.9rem,1.2vw,1.35rem)] font-bold text-white ${
              i === 0 ? "bg-(--steps-active)" : "bg-(--steps-muted)"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </nav>

      {/* Descripción del paso actual */}
      {/* Todas en la misma celda de la grilla (superpuestas, alineadas abajo) */}
      <div className="order-last grid w-full md:absolute md:bottom-[19%] md:left-[5.5%] md:order-none md:w-[clamp(16rem,22vw,24rem)]">
        {items.map((step) => (
          <div key={step.title} data-step-description className="col-start-1 row-start-1 self-end">
            <h3 className="text-[clamp(0.95rem,1.05vw,1.15rem)] font-medium">{step.title}</h3>
            <p className="text-[clamp(0.95rem,1.05vw,1.15rem)] leading-relaxed">{step.description}</p>
          </div>
        ))}
      </div>

      {/* Tarjetas apiladas. La caja toma la forma irregular del marco (webdev-icon-mask.svg: contorno exterior de webdev-icon-bg.svg, relleno) y recorta la entrada */}
      <div className="relative mx-auto my-auto aspect-[421/418] w-[min(62vw,30svh)] shrink-0 bg-(--steps-card) md:absolute md:left-[73%] md:top-[35.5%] md:mx-0 md:my-0 md:w-[clamp(14rem,22vw,26rem)] [mask-image:url(/assets/images/webdev/webdev-icon-mask.svg)] [mask-repeat:no-repeat] [mask-size:100%_100%] [-webkit-mask-image:url(/assets/images/webdev/webdev-icon-mask.svg)] [-webkit-mask-repeat:no-repeat] [-webkit-mask-size:100%_100%]">
        {/* El orden del DOM apila cada tarjeta sobre la anterior */}
        {STEPS.map((step) => (
          <div key={step.icon.src} data-step-card className="absolute inset-0 bg-(--steps-card)">
            <Image
              src={step.icon.src}
              alt=""
              width={step.icon.width}
              height={step.icon.height}
              className="absolute left-1/2 top-1/2 w-[62%] -translate-x-1/2 -translate-y-1/2"
            />
            {/* Sombra que la oscurece cuando queda tapada */}
            <span data-step-shade aria-hidden className="absolute inset-0 bg-black opacity-0" />
          </div>
        ))}
      </div>
      </div>
    </section>
  );
}
