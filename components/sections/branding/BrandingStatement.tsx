"use client";

import { useRef } from "react";
import Image from "next/image";
import { createBrandingStatement } from "@/animations/branding/statement";
import { createCharRoll } from "@/animations/charRoll";
import RollText from "@/components/RollText";
import { useGsap } from "@/lib/useGsap";
import { GRID_LINE_LEFT, GRID_LINE_RIGHT } from "@/lib/sectionGrid";

// Líneas de fondo: las verticales continúan las de <SectionHero />
const LINES = [
  `inset-y-0 ${GRID_LINE_LEFT} w-px`,
  `inset-y-0 ${GRID_LINE_RIGHT} w-px`,
  "inset-x-0 top-[15%] h-px",
  "inset-x-0 top-[85%] h-px",
] as const;

const STICKERS = [
  {
    src: "/assets/images/desing/h.png",
    width: 348,
    height: 339,
    className: "left-14 top-[12%] w-[clamp(4rem,8vw,8rem)]",
  },
  {
    src: "/assets/images/desing/desing-recurso.png",
    width: 415,
    height: 391,
    className: "left-[84%] top-[9%] w-[clamp(3.5rem,7.2vw,7rem)]",
  },
  {
    src: "/assets/images/desing/hippo-recurso.png",
    width: 341,
    height: 380,
    className: "left-[84.5%] top-[71%] w-[clamp(4.5rem,9.3vw,9rem)]",
  },
] as const;

const STATEMENT = [
  "Good design gets attention.",
  "Great brands give people",
  "a reason to remember.",
];

/** Branding & Design · pantalla 2: frase de marca con stickers. */
export default function BrandingStatement() {
  const rootRef = useRef<HTMLElement>(null);

  useGsap((root) => {
    const tl = createBrandingStatement(root);
    const removeCharRoll = createCharRoll(root);
    return () => {
      tl.kill();
      removeCharRoll();
    };
  }, rootRef);

  return (
    <section ref={rootRef} className="relative h-svh w-full overflow-hidden bg-brand-black">
      {LINES.map((className) => (
        <span key={className} aria-hidden className={`absolute bg-brand-blue/50 ${className}`} />
      ))}

      <div className="absolute inset-y-[15%] left-[7.5%] right-[12%] flex items-center">
        <p className="font-display text-statement font-bold leading-[0.8] text-white tracking-tight">
          <RollText
            lines={STATEMENT}
            decorate={{
              "remember.": (
                <svg
                  aria-hidden
                  viewBox="0 0 300 100"
                  preserveAspectRatio="none"
                  fill="none"
                  className="pointer-events-none absolute -bottom-[0.45em] -left-[0.3em] -right-[0.3em] -top-[0.35em] overflow-visible text-brand-orange"
                >
                  <path
                    data-statement-circle
                    d="M250 12C180 2 60 4 20 22C-2 34 2 70 30 82C80 98 230 96 280 78C302 68 300 30 270 18C240 8 200 10 168 16"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
              ),
            }}
          />
        </p>
      </div>

      {STICKERS.map((sticker) => (
        <Image
          key={sticker.src}
          data-statement-sticker
          src={sticker.src}
          alt=""
          aria-hidden
          width={sticker.width}
          height={sticker.height}
          className={`absolute h-auto ${sticker.className}`}
        />
      ))}
    </section>
  );
}
