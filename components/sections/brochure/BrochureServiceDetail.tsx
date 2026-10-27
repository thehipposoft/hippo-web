"use client";

import { useRef } from "react";
import { createScrollReveal } from "@/animations/reveal";
import type { BrochureService } from "@/lib/brochure";
import { GRID_LINE_LEFT, GRID_LINE_RIGHT } from "@/lib/sectionGrid";
import { useGsap } from "@/lib/useGsap";

/** Brochure · detalle de un servicio (págs. 4–7), sin fotos. */
export default function BrochureServiceDetail({ service }: { service: BrochureService }) {
  const rootRef = useRef<HTMLElement>(null);
  useGsap((root) => createScrollReveal(root), rootRef);

  return (
    <section
      ref={rootRef}
      id={service.id}
      className="relative w-full scroll-mt-0 overflow-hidden bg-white py-[14svh] text-black"
    >
      {[GRID_LINE_LEFT, GRID_LINE_RIGHT].map((className) => (
        <span key={className} aria-hidden className={`absolute inset-y-0 w-px bg-brand-blue/50 ${className}`} />
      ))}

      {/* Pestaña vertical con el nombre del servicio, como en el brochure */}
      <span
        aria-hidden
        className={`absolute right-0 top-[14svh] hidden rounded-l-2xl px-3 py-6 font-display text-[clamp(1.25rem,1.8vw,2rem)] font-bold [writing-mode:vertical-rl] rotate-180 md:block ${service.color.bg} ${service.color.ink}`}
      >
        {service.title}
      </span>

      <div className="relative grid gap-[clamp(2.5rem,6vw,6rem)] pl-[7.5%] pr-[12%] md:grid-cols-2">
        {/* Presentación */}
        <div>
          <h2 data-reveal className="font-display text-[clamp(2.25rem,4.5vw,4.75rem)] font-bold leading-[1.05] text-brand-darkblue">
            {service.title}
          </h2>
          <span data-reveal aria-hidden className={`mt-4 block h-1.5 w-8 ${service.color.bg}`} />

          <div className="mt-[clamp(1.5rem,4svh,3rem)] flex flex-col gap-4 text-[clamp(1rem,1.2vw,1.25rem)] leading-relaxed">
            <p data-reveal className="font-semibold">
              {service.lead.map((line, i) => (
                <span key={line} className="block">
                  {line}
                  {i < service.lead.length - 1 && " "}
                </span>
              ))}
            </p>
            {service.paragraphs.map((paragraph, i) => (
              <p key={i} data-reveal>
                {paragraph}
              </p>
            ))}
            {service.closing && (
              <p data-reveal className="font-semibold">
                {service.closing}
              </p>
            )}
          </div>
        </div>

        {/* Cómo trabajamos / con qué podemos ayudarte */}
        <div className="flex flex-col justify-center gap-[clamp(1.5rem,4svh,3rem)] text-[clamp(1rem,1.2vw,1.25rem)]">
          {service.steps && (
            <ol className="flex flex-col gap-[clamp(1rem,2.5svh,1.75rem)]">
              {service.steps.map((step) => (
                <li key={step.title} data-reveal className="grid grid-cols-[auto_1fr] gap-x-3">
                  <span aria-hidden className={`font-display text-[1.4em] leading-none ${service.color.ink}`}>
                    →
                  </span>
                  <span className="font-display text-[1.15em] font-bold text-brand-darkblue">{step.title}</span>
                  <span className="col-start-2 mt-1 leading-snug">{step.text}</span>
                </li>
              ))}
            </ol>
          )}
          {service.result && (
            <p data-reveal className="leading-relaxed">
              {service.result}
            </p>
          )}

          {service.capabilities && (
            <div data-reveal>
              <p className="mb-3">Podemos ayudarte con:</p>
              <ul className="flex flex-col gap-2">
                {service.capabilities.map((item, i) => {
                  const bullets = service.bullets;
                  const bulletClass =
                    bullets?.type === "squares"
                      ? `size-[0.8em] ${bullets.colors[i % bullets.colors.length]}`
                      : `h-[0.15em] w-[0.6em] ${bullets?.color ?? "bg-black"}`;
                  return (
                    <li key={item} className="flex items-center gap-3">
                      <span aria-hidden className={`shrink-0 ${bulletClass}`} />
                      {item}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {service.tags && (
            <ul data-reveal className="flex flex-wrap gap-3">
              {service.tags.map((tag) => (
                <li key={tag.label} className={`rounded-lg px-3 py-0.5 font-display font-bold ${tag.className}`}>
                  {tag.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
