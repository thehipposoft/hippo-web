"use client";

import { useRef } from "react";
import Image from "next/image";
import { createPortfolioGridEntrance } from "@/animations/portfolio/grid";
import { useGsap } from "@/lib/useGsap";
import { PORTFOLIO_DATA } from "./constants";
import { GRID_CONTENT_PADDING, GRID_LINE_LEFT, GRID_LINE_RIGHT } from "@/lib/sectionGrid";

// Líneas de fondo: continúan las verticales de las pantallas anteriores
const LINES = [GRID_LINE_LEFT, GRID_LINE_RIGHT];

/** Portfolio · grilla de proyectos. */
export default function PortfolioGrid() {
  const rootRef = useRef<HTMLElement>(null);

  useGsap((root) => {
    createPortfolioGridEntrance(root);
  }, rootRef);

  return (
    <section ref={rootRef} className="relative w-full overflow-hidden bg-white text-black">
      {LINES.map((className) => (
        <span key={className} aria-hidden className={`absolute inset-y-0 w-px bg-brand-blue/50 ${className}`} />
      ))}

      <h2 className="sr-only">Our Projects</h2>

      <div className={GRID_CONTENT_PADDING}>
        <ul className="mx-auto grid w-[min(90%,78rem)] grid-cols-1 gap-8 py-24 md:grid-cols-2 lg:grid-cols-3">
          {PORTFOLIO_DATA.map(({ slug, data }) => (
            <li key={slug} data-portfolio-item className="flex flex-col gap-4">
              {/* TODO: llevar a la ficha /portfolio/[slug] cuando exista; por ahora abre el sitio del proyecto */}
              <a
                href={data.href}
                target="_blank"
                rel="noreferrer"
                className="group relative block aspect-[450/420] w-full overflow-hidden"
              >
                <Image
                  src={data.mockGrid}
                  alt={`${data.name} background`}
                  fill
                  sizes="(max-width: 768px) 80vw, (max-width: 1024px) 40vw, 25vw"
                  className={`object-cover ${"objectPosition" in data ? data.objectPosition : ""}`}
                />
                <span className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100">
                  <span className="px-8 py-3 text-2xl font-medium uppercase tracking-[0.2em] text-white">Discover</span>
                </span>
                {"logo_content" in data && <span className="absolute bottom-4 left-4">{data.logo_content}</span>}
                <svg
                  aria-hidden
                  viewBox="0 0 40 40"
                  fill="none"
                  className="absolute bottom-4 right-4 z-10 hidden size-11 text-black transition duration-500 group-hover:rotate-180 group-hover:scale-110 group-hover:text-white lg:block"
                >
                  <path d="M1.25 20H38.75M20 1.25V38.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3" />
                </svg>
              </a>

              <div className="flex flex-col">
                <h3 className="font-display text-xl font-bold">{data.name}</h3>
                <p className="pt-2 text-xs uppercase md:text-sm">{data.industry}</p>
                <p className="text-xs uppercase md:text-sm">{data.work}</p>
                <div className="flex items-center gap-4 pt-2">
                  <span className="font-display text-2xl">{data.year}</span>
                  <Image className="h-auto w-auto" src={data.flag} alt="Country flag" width={35} height={24} />
                  {"secondFlag" in data && data.secondFlag && (
                    <Image className="h-auto w-auto" src={data.secondFlag} alt="Country flag" width={35} height={24} />
                  )}
                  {data.technologies_icons}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
