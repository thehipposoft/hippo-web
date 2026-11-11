"use client";

import { useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { createPortfolioSingle } from "@/animations/portfolio/single";
import type { PortfolioSingleProject } from "@/lib/portfolioProjects";
import { useGsap } from "@/lib/useGsap";
import { PORTFOLIO_DATA } from "./constants";

// Líneas de fondo. Desktop: dos verticales (una a cada lado del título) y la franja horizontal del
// medio, que enmarca el título. Mobile: verticales simétricas, como en el resto del sitio.
const LINES = [
  "inset-y-0 left-[5.5%] w-px md:left-[23.6%]",
  "inset-y-0 left-[94.5%] w-px md:left-[72.5%]",
  "inset-x-0 top-[calc(50%_-_17vw)] h-px md:top-[calc(50%_-_clamp(3rem,4.6vw,5.75rem))]",
  "inset-x-0 top-[calc(50%_+_17vw)] h-px md:top-[calc(50%_+_clamp(3rem,4.6vw,5.75rem))]",
];

// Corrimiento de cada card sobre la anterior (la pila baja hacia la derecha). Va en el <li>, que
// GSAP no toca: GSAP pasa el `translate` de CSS a su propio transform y lo pierde. La entrada se
// anima en la card de adentro. Clases completas para que Tailwind las genere (hasta 6 capas).
const OFFSETS = [
  "[translate:-50%_-50%]",
  "[translate:calc(-50%_+_1.7vw)_calc(-50%_+_1.3vw)]",
  "[translate:calc(-50%_+_3.6vw)_calc(-50%_+_2.8vw)]",
  "[translate:calc(-50%_+_5.8vw)_calc(-50%_+_4.8vw)]",
  "[translate:calc(-50%_+_7.6vw)_calc(-50%_+_6.4vw)]",
  "[translate:calc(-50%_+_9.4vw)_calc(-50%_+_8vw)]",
];

type LayerText = { title: string; work: string; imageAlt: string };

type PortfolioSingleProyectProps = {
  project: PortfolioSingleProject;
};

/**
 * Página de un proyecto del portfolio (/portfolio/[slug]): título del proyecto con cartel "scroll"
 * y sus capas (web, sistemas, piezas…) como cards que se apilan con el scroll
 * (animations/portfolio/single.ts). La cantidad de capas depende del proyecto.
 */
export default function PortfolioSingleProyect({
  project,
}: PortfolioSingleProyectProps) {
  // Namespace "Portfolio" con claves completas: el tipado de next-intl no admite "Portfolio.single" como namespace
  const t = useTranslations("Portfolio");
  const rootRef = useRef<HTMLElement>(null);
  const texts = `single.projects.${project.slug}` as const;
  const layers = t.raw(`${texts}.layers`) as LayerText[];
  // Datos de la card de la grilla del portfolio (bandera, tecnologías) para la primera capa
  const grid = PORTFOLIO_DATA.find(
    ({ slug }) => slug === project.gridSlug,
  )?.data;

  useGsap((root) => createPortfolioSingle(root), rootRef);

  return (
    <section
      ref={rootRef}
      className="relative h-svh w-full overflow-hidden bg-brand-black text-white"
    >
      {LINES.map((className) => (
        <span
          key={className}
          aria-hidden
          className={`absolute bg-brand-blue/50 ${className}`}
        />
      ))}

      {/* Título, centrado entre las verticales (nunca las cruza: si no entra, corta en dos renglones) */}
      <div className="absolute left-[calc(5.5%_+_1.25rem)] right-[calc(5.5%_+_1.25rem)] top-1/2 -translate-y-1/2 text-center md:left-[calc(23.6%_+_2vw)] md:right-[calc(27.5%_+_2vw)]">
        {/* Envoltorio de la salida con el scroll (la entrada anima los hijos) */}
        <div data-single-title>
          <p
            data-single-intro
            className="invisible mb-[0.4em] text-[0.8rem] md:text-[clamp(0.8rem,0.95vw,1.1rem)]"
          >
            {t(`${texts}.eyebrow`)}
          </p>
          <h1
            data-single-intro
            className="invisible font-display text-[10vw] font-bold leading-[1.05] text-balance md:text-[clamp(2rem,3.7vw,4.75rem)] md:leading-none"
          >
            {t(`${texts}.title`)}
          </h1>
        </div>
      </div>

      {/* Cartel "scroll": flotando (mobile abajo al centro; desktop en la franja, a la derecha) */}
      <div
        data-single-scroll
        aria-hidden
        className="invisible absolute bottom-[12%] left-1/2 -translate-x-1/2 md:bottom-auto md:left-auto md:right-[4%] md:top-1/2 md:translate-x-0 md:-translate-y-1/2"
      >
        <span
          data-single-scroll-float
          className="flex flex-col items-center gap-1 font-display text-[clamp(1rem,1.3vw,1.4rem)] font-bold"
        >
          {t("single.scroll")}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-[0.7em] w-auto"
          >
            <path
              d="M4 8l8 8 8-8"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>

      {/* Capas: cards apiladas (el orden del DOM apila cada una sobre la anterior) */}
      <ol aria-label={t("single.label")}>
        {project.layers.map((layer, i) => {
          const text = layers[i];
          if (!text) return null;
          return (
            <li
              key={layer.image.src}
              className={`absolute left-1/2 top-1/2 z-10 h-[min(60svh,34rem)] w-[76vw] md:aspect-[690/335] md:h-auto md:w-[min(52vw,64rem)] ${OFFSETS[i] ?? OFFSETS[OFFSETS.length - 1]}`}
            >
              <div
                data-single-card
                className="flex size-full flex-col-reverse overflow-hidden rounded-2xl bg-white text-black shadow-[0_10px_40px_rgba(0,0,0,0.35)] md:flex-row md:items-center"
              >
                {/* Textos */}
                <div className="flex flex-1 flex-col justify-center gap-[0.5em] px-6 py-5 md:pl-[7%] md:pr-6">
                  {i === 0 && (
                    <Image
                      src={project.logo.src}
                      alt={text.title}
                      width={project.logo.width}
                      height={project.logo.height}
                      className="mb-2 h-auto w-[clamp(3rem,3.2vw,4rem)]"
                    />
                  )}
                  <p className="text-[clamp(0.8rem,0.95vw,1rem)]">
                    {text.title}
                  </p>
                  <h2 className="font-display text-[clamp(1rem,1.3vw,1.45rem)] font-bold uppercase leading-tight">
                    {text.work}
                  </h2>
                  <div className="flex items-center gap-3 pt-1">
                    <span className="text-[clamp(0.8rem,0.95vw,1rem)] font-bold">
                      {layer.year}
                    </span>
                    {i === 0 && grid && (
                      <>
                        <Image
                          src={grid.flag}
                          alt=""
                          aria-hidden
                          width={24}
                          height={16}
                          className="h-auto w-6"
                        />
                        <span className="[&_svg]:h-4 [&_svg]:w-auto">
                          {grid.technologies_icons}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Imagen de la capa */}
                <div className="relative min-h-0 flex-[1.3] overflow-hidden bg-white md:mr-[7%] md:h-[77%] md:flex-none md:basis-[33.5%]">
                  <Image
                    src={layer.image.src}
                    alt={text.imageAlt}
                    fill
                    sizes="(max-width: 768px) 76vw, 20vw"
                    className={
                      layer.fit === "cover" ? "object-cover" : "object-contain"
                    }
                  />
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
