"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { createWheel } from "@/animations/about/wheel";
import { GRID_LINE_LEFT } from "@/lib/sectionGrid";
import { IRREGULAR_MASK } from "@/lib/shapes";
import { useGsap } from "@/lib/useGsap";
import { useTranslations } from "next-intl";

// Año activo al cargar (2026)
const INITIAL = 4;

// Años de la rueda. Con `hasContent` el año tiene título y texto en About.wheel.years.<year>
// (por ahora 2023 no). TODO: ilustración dentro del recuadro activo de cada año
const YEARS: {
  year: "2021" | "2022" | "2023" | "2024" | "2026";
  color: string;
  hasContent?: boolean;
  image?: { src: string; width: number; height: number };
}[] = [
  { year: "2021", color: "bg-brand-blue", hasContent: true },
  { year: "2022", color: "bg-brand-pink", hasContent: true },
  { year: "2023", color: "bg-brand-orange" },
  { year: "2024", color: "bg-brand-green", hasContent: true },
  {
    year: "2026",
    color: "bg-brand-darkpink",
    hasContent: true,
    image: { src: "/assets/images/about/hippo-personajewhite.svg", width: 135, height: 219 },
  },
];


// Líneas de fondo: la vertical continúa la del resto del sitio
const LINES = [
  `inset-y-0 ${GRID_LINE_LEFT} w-px`,
  "inset-x-0 top-14 h-px md:top-[15%]",
  `${GRID_LINE_LEFT} right-0 bottom-14 h-px md:bottom-auto md:top-[83%]`,
];

/** About · rueda de años: el año activo queda arriba al medio; al elegir otro, la rueda gira. */
export default function AboutWheel() {
  const t = useTranslations("About.wheel");
  const rootRef = useRef<HTMLElement>(null);
  const goToRef = useRef<(index: number) => void>(() => {});
  const [active, setActive] = useState(INITIAL);

  useGsap((root) => {
    const wheel = createWheel(root, INITIAL);
    goToRef.current = wheel.goTo;
    return wheel.destroy;
  }, rootRef);

  const select = (index: number) => {
    setActive(index);
    goToRef.current(index);
  };

  return (
    <section
      ref={rootRef}
      aria-label={t("label")}
      className="relative h-svh w-full overflow-hidden bg-brand-black text-white"
    >
      {LINES.map((className) => (
        <span key={className} aria-hidden className={`absolute bg-brand-blue/50 ${className}`} />
      ))}

      {/* Círculo (tamaño y posición los calcula animations/about/wheel.ts) */}
      <span data-wheel-circle aria-hidden className="absolute left-0 top-0 rounded-full border border-white/50" />

      {YEARS.map((item, i) => (
        <button
          key={item.year}
          type="button"
          data-wheel-box
          onClick={() => select(i)}
          aria-label={item.year}
          aria-current={i === active ? "true" : undefined}
          className="group absolute z-10 size-8 cursor-pointer md:size-[clamp(1.75rem,2.4vw,2.9rem)]"
        >
          {/* GSAP mueve/gira/escala el botón (y anula scale/rotate de CSS en él): el hover va en esta capa */}
          <span
            aria-hidden
            className={`block size-full transition-[scale,rotate] duration-300 ease-out ${
              i === active
                ? ""
                : "group-hover:rotate-[12deg] group-hover:scale-[1.2] group-focus-visible:rotate-[12deg] group-focus-visible:scale-[1.2]"
            } ${IRREGULAR_MASK} ${item.color}`}
          />
        </button>
      ))}

      {YEARS.map((item, i) => (
        <button
          key={item.year}
          type="button"
          tabIndex={-1}
          aria-hidden
          data-wheel-label
          onClick={() => select(i)}
          className="absolute cursor-pointer font-display text-[clamp(1.1rem,1.5vw,1.6rem)] font-bold"
        >
          {/* --edge (lo setea la rueda) desvanece el año en el cruce del loop; el botón tiene su propio fade */}
          <span className="opacity-(--edge,1)">{item.year}</span>
        </button>
      ))}

      {/* Contenido del año activo: todos en la misma celda, se muestra uno.
          Desktop: angosto, entre los años vecinos. Mobile: los años van por fuera del arco
          (animations/about/wheel.ts) y el contenido usa todo el ancho, debajo del recuadro activo */}
      <div className="absolute left-[calc(5.5%_+_1.25rem)] right-[calc(5.5%_+_1.25rem)] top-[calc(26%_+_3.5rem)] grid text-center md:left-1/2 md:right-auto md:top-[calc(36%_+_clamp(3rem,4.5vw,5.25rem))] md:w-[min(22rem,26vw)] md:-translate-x-1/2">
        {YEARS.map((item) => (
          <div key={item.year} data-wheel-content aria-live="polite" className="col-start-1 row-start-1">
            <p className="font-display text-[2.25rem] font-bold leading-none md:text-[clamp(1.5rem,2.3vw,2.6rem)]">{item.year}</p>
            {item.hasContent && item.year !== "2023" && (
              <h3 className="mt-2 font-display text-[1.1rem] font-bold uppercase leading-tight md:text-[clamp(0.9rem,1.1vw,1.2rem)]">
                {t(`years.${item.year}.title`)}
              </h3>
            )}
            {item.hasContent && item.year !== "2023" && (
              <p className="mt-3 text-[0.95rem] leading-relaxed md:mt-1.5 md:text-[clamp(0.75rem,0.8vw,0.9rem)] md:leading-snug">
                {t.rich(`years.${item.year}.text`, { strong: (chunks) => <strong>{chunks}</strong> })}
              </p>
            )}
            {item.image && (
              <Image
                src={item.image.src}
                alt={t("characterAlt")}
                width={item.image.width}
                height={item.image.height}
                className="mx-auto mt-3 h-auto w-[clamp(3.5rem,5vw,5.5rem)]"
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
