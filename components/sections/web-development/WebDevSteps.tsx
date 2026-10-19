"use client";

import { useRef } from "react";
import Image from "next/image";
import { createWebDevSteps } from "@/animations/web-development/steps";
import { GRID_LINE_LEFT, GRID_LINE_RIGHT } from "@/lib/sectionGrid";
import { useGsap } from "@/lib/useGsap";

const STEPS = [
  {
    label: "Think it",
    title: "Strategy & Planning",
    description: "We understand the problem, the business and where you want to go.",
    icon: { src: "/assets/images/webdev/webdev-icon1.png", width: 340, height: 328 },
  },
  {
    label: "Build it",
    title: "Development",
    description: "We turn the plan into digital experiences that work.",
    icon: { src: "/assets/images/webdev/webdev-icon2.png", width: 400, height: 318 },
  },
  {
    label: "Improve it",
    title: "Optimization & Consulting",
    description: "We learn, adjust and make things better.",
    icon: { src: "/assets/images/webdev/webdev-icon3.png", width: 340, height: 328 },
  },
  {
    label: "Keep it moving.",
    title: "Maintenance & Support",
    description: "We stay around to keep everything running and evolving.",
    icon: { src: "/assets/images/webdev/webdev-icon4.png", width: 349, height: 328 },
  },
] as const;

// Líneas de fondo: las verticales de los extremos continúan las de las pantallas anteriores
const LINES = [
  `inset-y-0 ${GRID_LINE_LEFT} w-px`,
  "inset-y-0 left-[73.7%] w-px",
  `inset-y-0 ${GRID_LINE_RIGHT} w-px`,
  "inset-x-0 top-[15%] h-px",
  "inset-x-0 top-[36.7%] h-px",
  `${GRID_LINE_LEFT} right-0 top-[84%] h-px`,
];

/** Web Development · proceso en 4 pasos, recorrido con el scroll (sección pineada). */
export default function WebDevSteps() {
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

      {/* Título y pasos */}
      <div className="absolute left-[5.5%] top-[19%] font-display font-bold">
        <h2 className="text-[clamp(1.25rem,2vw,2.25rem)] leading-tight tracking-tight">
          Strategy, consulting, development &amp; ongoing support —
          <br />
          all under one roof.
        </h2>
        <p className="mt-[0.4em] text-[clamp(1.35rem,2.15vw,2.4rem)]">
          {STEPS.map((step, i) => (
            <span
              key={step.label}
              data-step-label
              className={i === 0 ? "text-(--steps-active)" : "text-(--steps-muted)"}
            >
              {i > 0 && <span aria-hidden>→ </span>}
              {step.label}
              <sup className="ml-[0.1em] text-[0.3em]">{i + 1}</sup>
              {i < STEPS.length - 1 && " "}
            </span>
          ))}
        </p>
      </div>

      {/* Navegación por pasos */}
      <nav aria-label="Pasos" className="absolute left-[5.5%] top-[39.5%] flex gap-1.5">
        {STEPS.map((step, i) => (
          <button
            key={step.label}
            type="button"
            data-step-button
            aria-label={`Paso ${i + 1}: ${step.label}`}
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
      <div className="absolute bottom-[19%] left-[5.5%] grid w-[clamp(16rem,22vw,24rem)]">
        {STEPS.map((step) => (
          <div key={step.title} data-step-description className="col-start-1 row-start-1 self-end">
            <h3 className="text-[clamp(0.95rem,1.05vw,1.15rem)] font-medium">{step.title}</h3>
            <p className="text-[clamp(0.95rem,1.05vw,1.15rem)] leading-relaxed">{step.description}</p>
          </div>
        ))}
      </div>

      {/* Tarjetas apiladas. La caja toma la forma irregular del marco (webdev-icon-mask.svg: contorno exterior de webdev-icon-bg.svg, relleno) y recorta la entrada */}
      <div className="absolute left-[73%] top-[35.5%] aspect-[421/418] w-[clamp(14rem,22vw,26rem)] bg-(--steps-card) [mask-image:url(/assets/images/webdev/webdev-icon-mask.svg)] [mask-repeat:no-repeat] [mask-size:100%_100%] [-webkit-mask-image:url(/assets/images/webdev/webdev-icon-mask.svg)] [-webkit-mask-repeat:no-repeat] [-webkit-mask-size:100%_100%]">
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
    </section>
  );
}
