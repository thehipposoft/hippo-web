"use client";

import { useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { createWheel } from "@/animations/about/wheel";
import { GRID_LINE_LEFT } from "@/lib/sectionGrid";
import { IRREGULAR_MASK } from "@/lib/shapes";
import { useGsap } from "@/lib/useGsap";

// Año activo al cargar (2026)
const INITIAL = 4;

// Años de la rueda. Sin `title` el año no tiene contenido (por ahora 2023).
// TODO: ilustración dentro del recuadro activo de cada año
const YEARS: {
  year: string;
  color: string;
  title?: string;
  text?: ReactNode;
  image?: { src: string; width: number; height: number; alt: string };
}[] = [
  {
    year: "2021",
    color: "bg-brand-blue",
    title: "It started with a few good ideas.",
    text: "Hippo was born as a small team of professionals from different backgrounds, brought together by design, code and a curiosity for digital. We took on all kinds of projects, learned fast and questioned almost everything.",
  },
  {
    year: "2022",
    color: "bg-brand-pink",
    title: "We started figuring it out.",
    text: "More projects, more clients, more questions. We grew from doing things to thinking about why we were doing them — developing our skills, our process and our way of working.",
  },
  { year: "2023", color: "bg-brand-orange" },
  {
    year: "2024",
    color: "bg-brand-green",
    title: "More than a software factory.",
    text: "We started thinking bigger. Strategy, consulting and long-term partnerships became part of the way we work. We kept designing and developing, but with a clearer idea of where we wanted to go.",
  },
  {
    year: "2026",
    color: "bg-brand-darkpink",
    title: "Hello, Hippo.",
    text: (
      <>
        TheHipposoft <strong>becomes Hippo.</strong> Five years in, we have more experience, more tools and more
        freedom to choose the work we want to do — while keeping the thing that started it all: curiosity.
      </>
    ),
    image: { src: "/assets/images/about/hippo-personajewhite.svg", width: 135, height: 219, alt: "Hippo, el personaje de HippoSoft" },
  },
];


// Líneas de fondo: la vertical continúa la del resto del sitio
const LINES = [`inset-y-0 ${GRID_LINE_LEFT} w-px`, "inset-x-0 top-[15%] h-px", `${GRID_LINE_LEFT} right-0 top-[83%] h-px`];

/** About · rueda de años: el año activo queda arriba al medio; al elegir otro, la rueda gira. */
export default function AboutWheel() {
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
      aria-label="Nuestra historia"
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
          className="group absolute z-10 size-[clamp(1.75rem,2.4vw,2.9rem)] cursor-pointer"
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

      {/* Contenido del año activo: todos en la misma celda, se muestra uno. Angosto, entre los años vecinos */}
      <div className="absolute left-1/2 top-[calc(36%_+_clamp(3rem,4.5vw,5.25rem))] grid w-[min(22rem,26vw)] -translate-x-1/2 text-center">
        {YEARS.map((item) => (
          <div key={item.year} data-wheel-content aria-live="polite" className="col-start-1 row-start-1">
            <p className="font-display text-[clamp(1.5rem,2.3vw,2.6rem)] font-bold leading-none">{item.year}</p>
            {item.title && (
              <h3 className="mt-2 font-display text-[clamp(0.9rem,1.1vw,1.2rem)] font-bold uppercase leading-tight">
                {item.title}
              </h3>
            )}
            {item.text && <p className="mt-1.5 text-[clamp(0.75rem,0.8vw,0.9rem)] leading-snug">{item.text}</p>}
            {item.image && (
              <Image
                src={item.image.src}
                alt={item.image.alt}
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
