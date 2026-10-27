"use client";

import { useRef } from "react";
import { createScrollReveal } from "@/animations/reveal";
import { BROCHURE_INTRO, BROCHURE_SERVICES } from "@/lib/brochure";
import { GRID_LINE_LEFT, GRID_LINE_RIGHT } from "@/lib/sectionGrid";
import { useGsap } from "@/lib/useGsap";

/** Brochure · "Diferentes habilidades, mismos objetivos" + resumen de los 4 servicios. */
export default function BrochureServices() {
  const rootRef = useRef<HTMLElement>(null);
  useGsap((root) => createScrollReveal(root), rootRef);

  return (
    <section ref={rootRef} className="relative w-full overflow-hidden bg-white py-[16svh] text-brand-darkblue">
      {[GRID_LINE_LEFT, GRID_LINE_RIGHT].map((className) => (
        <span key={className} aria-hidden className={`absolute inset-y-0 w-px bg-brand-blue/50 ${className}`} />
      ))}

      <div className="relative pl-[7.5%] pr-[9%]">
        <h2 data-reveal className="font-display text-statement font-bold leading-[1.05]">
          {BROCHURE_INTRO.title}
          <br />
          {BROCHURE_INTRO.titleLine2}
        </h2>
        <span data-reveal aria-hidden className="mt-4 block h-1.5 w-8 bg-brand-green" />

        <div className="mt-[clamp(2rem,6svh,4rem)] grid gap-6 text-[clamp(1rem,1.25vw,1.3rem)] leading-relaxed text-black md:grid-cols-2 md:gap-[6%]">
          {BROCHURE_INTRO.columns.map((column, i) => (
            <div key={i} data-reveal className="flex flex-col gap-4">
              {column.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          ))}
        </div>

        <h3
          data-reveal
          className="mt-[clamp(3rem,9svh,6rem)] inline-block rounded-2xl border-2 border-brand-darkblue px-8 py-2 font-display text-[clamp(1.25rem,1.8vw,2rem)] font-bold"
        >
          {BROCHURE_INTRO.servicesLabel}
        </h3>

        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
          {BROCHURE_SERVICES.map((service, i) => (
            <li key={service.id} data-reveal>
              <a
                href={`#${service.id}`}
                className="group relative flex h-full flex-col border-x border-b border-black/70 bg-white transition-[translate,box-shadow] duration-300 ease-out hover:z-10 hover:-translate-y-2 hover:shadow-[3px_5px_0_0_rgba(0,0,0,0.85)] focus-visible:z-10 focus-visible:-translate-y-2 focus-visible:shadow-[3px_5px_0_0_rgba(0,0,0,0.85)]"
              >
                <span
                  className={`rounded-tr-2xl border-t border-black/70 px-[clamp(1rem,2vw,2rem)] py-3 font-display text-[clamp(1.1rem,1.5vw,1.6rem)] font-bold ${service.color.bg} ${service.color.ink}`}
                >
                  {service.title}
                </span>
                <span className="flex flex-1 flex-col gap-3 px-[clamp(1rem,2vw,2rem)] pb-4 pt-5 text-[clamp(0.95rem,1.1vw,1.15rem)] leading-snug">
                  <span>{service.summary[0]}</span>
                  <span className="font-medium">{service.summary[1]}</span>
                  <span className={`mt-auto pt-6 font-display text-[clamp(3rem,5vw,5rem)] font-bold leading-none ${service.color.ink}`}>
                    {i + 1}
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
