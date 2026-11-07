"use client";

import { useRef } from "react";
import Image from "next/image";
import { createBrandingStatement } from "@/animations/branding/statement";
import { createCharRoll } from "@/animations/charRoll";
import RollText from "@/components/RollText";
import { useGsap } from "@/lib/useGsap";
import { GRID_LINE_LEFT, GRID_LINE_RIGHT } from "@/lib/sectionGrid";
import { useTranslations } from "next-intl";

// Líneas de fondo: las verticales continúan las de <SectionHero />
const LINES = [
  `inset-y-0 ${GRID_LINE_LEFT} w-px`,
  `inset-y-0 ${GRID_LINE_RIGHT} w-px`,
  // Mobile: pegadas a los bordes (la de arriba, al borde inferior del botón del menú)
  "inset-x-0 top-14 h-px md:top-[15%]",
  "inset-x-0 bottom-14 h-px md:bottom-auto md:top-[85%]",
] as const;

// Mobile: más grandes y cerca del texto (arriba a los costados y abajo a la derecha)
const STICKERS = [
  {
    src: "/assets/images/desing/h.png",
    width: 348,
    height: 339,
    className: "left-[10%] top-[22%] w-[22vw] md:left-14 md:top-[12%] md:w-[clamp(4rem,8vw,8rem)]",
  },
  {
    src: "/assets/images/desing/desing-recurso.png",
    width: 415,
    height: 391,
    className: "left-[68%] top-[21%] w-[20vw] md:left-[84%] md:top-[9%] md:w-[clamp(3.5rem,7.2vw,7rem)]",
  },
  {
    src: "/assets/images/desing/hippo-recurso.png",
    width: 341,
    height: 380,
    className: "left-[64%] top-[66%] w-[26vw] md:left-[84.5%] md:top-[71%] md:w-[clamp(4.5rem,9.3vw,9rem)]",
  },
] as const;

/** Branding & Design · pantalla 2: frase de marca con stickers. */
export default function BrandingStatement() {
  const rootRef = useRef<HTMLElement>(null);
  const t = useTranslations("Branding");

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

      <div className="absolute inset-y-[15%] left-[calc(5.5%_+_1.25rem)] right-[calc(5.5%_+_1.25rem)] flex items-center md:left-[7.5%] md:right-[12%]">
        <p className="font-display text-[9.5vw] font-bold leading-[0.8] text-white tracking-tight md:text-statement">
          <RollText
            lines={t.raw("statement") as string[]}
            decorate={{
              // Palabra con el círculo (la última del texto, en cada idioma)
              [t("marked")]: (
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
