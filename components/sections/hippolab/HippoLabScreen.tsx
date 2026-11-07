"use client";

import { useRef, type ReactNode } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { createHippoLabStatement } from "@/animations/hippolab/statement";
import LightGridLines from "@/components/LightGridLines";
import SectionMenu from "@/components/SectionMenu";
import { takeHeroArrival } from "@/lib/heroArrival";
import type { Section } from "@/lib/sections";
import { useGsap } from "@/lib/useGsap";

type HippoLabScreenProps = {
  section: Section;
  /** false en la capa de transición: ahí el contenido lo hace aparecer la transición */
  intro?: boolean;
};

// Palabra con hover: fondo de color al pasar el mouse (padding compensado con margen negativo
// para que no corra el texto). Los íconos y la rotación los suma cada variante; los íconos quedan
// apoyados sobre la esquina superior derecha de la palabra, inclinados.
const HOVER_WORD = "group relative inline-block -mx-[0.12em] rounded-[0.2em] px-[0.12em] transition-[background-color,rotate,border-color] duration-300 ease-out";

/** "ideas": verde, leve giro + lamparita (como "playground") */
function IdeaWord({ children }: { children: ReactNode }) {
  return (
    <span data-lab-word className={`${HOVER_WORD} hover:-rotate-2 hover:bg-brand-green data-active:-rotate-2 data-active:bg-brand-green`}>
      {children}
      <Image
        src="/assets/images/hippolab/hippolab1.png"
        alt=""
        aria-hidden
        width={105}
        height={72}
        className="pointer-events-none absolute -right-[0.3em] -top-[0.8em] h-auto w-[0.8em] origin-bottom-left rotate-[14deg] scale-0 transition-[scale] duration-300 ease-out group-hover:scale-100 group-data-active:scale-100"
      />
    </span>
  );
}

/** "plan.": naranja con borde + sacudida (GSAP) */
function PlanWord({ children }: { children: ReactNode }) {
  return (
    <span data-lab-word data-lab-shake className={`${HOVER_WORD} border-2 border-transparent hover:border-black hover:bg-brand-orange data-active:border-black data-active:bg-brand-orange`}>
      {children}
    </span>
  );
}

/** "playground.": lila, leve giro + ilustración */
function PlayWord({ children }: { children: ReactNode }) {
  return (
    <span data-lab-word className={`${HOVER_WORD} hover:-rotate-2 hover:bg-brand-pink data-active:-rotate-2 data-active:bg-brand-pink`}>
      {children}
      <Image
        src="/assets/images/hippolab/hippolab-2.png"
        alt=""
        aria-hidden
        width={400}
        height={400}
        className="pointer-events-none absolute -right-[0.75em] -top-[0.85em] h-auto w-[1.2em] origin-bottom-left -rotate-[8deg] scale-0 transition-[scale] duration-300 ease-out group-hover:scale-100 group-data-active:scale-100"
      />
    </span>
  );
}

/**
 * Pantalla de /hippo-lab. Como Contact: sin título que viaja ni fondo oscuro; la transición abre
 * el recuadro en blanco y aparece esta pantalla. Partes que usa la transición: [data-hero-panel],
 * [data-hero-content] y el botón de <SectionMenu />.
 */
export default function HippoLabScreen({ section, intro = true }: HippoLabScreenProps) {
  const t = useTranslations("HippoLab");
  const contentRef = useRef<HTMLDivElement>(null);

  useGsap(
    (content) => {
      // Llegando desde la transición el contenido ya está visible: sin entrada (solo el loop del badge)
      const entrance = intro && !takeHeroArrival();
      return createHippoLabStatement(content, { entrance });
    },
    contentRef,
  );

  const rich = {
    idea: (chunks: ReactNode) => <IdeaWord>{chunks}</IdeaWord>,
    plan: (chunks: ReactNode) => <PlanWord>{chunks}</PlanWord>,
    play: (chunks: ReactNode) => <PlayWord>{chunks}</PlayWord>,
  };
  const ring = `${t("badge")} • ${t("badge")} • `;

  return (
    <div className="relative h-svh w-full overflow-hidden">
      <div data-hero-panel className="absolute inset-0 bg-white" />

      <div ref={contentRef} data-hero-content className="absolute inset-0 text-black">
        <LightGridLines />

        {/* Badge: rocket al centro y el texto girando alrededor */}
        <div
          data-lab-badge
          className={`${intro ? "invisible" : ""} absolute left-1/2 top-[15%] size-[30vw] md:top-[18.5%] md:size-[clamp(6rem,8.8vw,9.5rem)] -translate-x-1/2 rounded-full bg-black`}
        >
          <svg data-lab-ring viewBox="0 0 100 100" aria-hidden className="absolute inset-0 size-full text-white">
            <defs>
              <path id="hippolab-ring" d="M50 50m-39 0a39 39 0 1 1 78 0a39 39 0 1 1 -78 0" />
            </defs>
            <text className="fill-current font-display text-[10.5px] font-medium" textLength="243" lengthAdjust="spacing">
              <textPath href="#hippolab-ring">{ring}</textPath>
            </text>
          </svg>
          <div className="absolute inset-[24%] flex items-center justify-center rounded-full bg-white">
            <Image src="/assets/images/hippolab/rocket.svg" alt={t("badge")} width={32} height={81} className="h-[78%] w-auto" />
          </div>
        </div>

        {/* Centrado en el espacio entre el badge y la línea de abajo: si el texto se parte en más
            renglones (otro idioma, pantallas angostas) sigue dentro de la pantalla */}
        {/* Mobile: más ancho y más alto (líneas pegadas a los bordes), con el padding de las demás secciones */}
        <div className="absolute bottom-[8%] left-[calc(5.5%_+_1.25rem)] right-[calc(5.5%_+_1.25rem)] top-[32%] flex items-center md:bottom-[19%] md:left-[7.5%] md:right-[10%] md:top-[35%]">
          <h1
            data-lab-statement
            className={`${intro ? "invisible" : ""} font-display text-[11vw] font-bold leading-[1.25] md:text-statement`}
          >
            <span className="block">{t.rich("line1", rich)}</span>
            <span className="block">{t.rich("line2", rich)}</span>
          </h1>
        </div>
      </div>

      <SectionMenu section={section} />
    </div>
  );
}
