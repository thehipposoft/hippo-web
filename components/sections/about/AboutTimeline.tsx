"use client";

import { useRef } from "react";
import Image from "next/image";
import { createAboutTimeline } from "@/animations/about/timeline";
import { GRID_LINE_LEFT } from "@/lib/sectionGrid";
import { IRREGULAR_MASK } from "@/lib/shapes";
import { useGsap } from "@/lib/useGsap";
import { useTranslations } from "next-intl";


// Líneas de fondo (sin animación): la vertical continúa la del resto del sitio
const LINES = [
  `inset-y-0 ${GRID_LINE_LEFT} w-px`,
  "inset-x-0 top-[15%] h-px",
  `${GRID_LINE_LEFT} right-0 top-[83%] h-px`,
];

const STICKERS = [
  { src: "/assets/images/about/about.svg", width: 144, height: 144, className: "left-[4.3%] top-[10%] w-[clamp(4rem,7.2vw,8rem)]" },
  { src: "/assets/images/about/about-2.png", width: 447, height: 362, className: "left-[13.8%] top-[13%] w-[clamp(5rem,9.1vw,10rem)]" },
  { src: "/assets/images/about/about-1.png", width: 339, height: 348, className: "left-[79.3%] top-[20%] w-[clamp(3.75rem,6.1vw,7rem)]" },
] as const;

// Paleta de marca, con la forma irregular de los recuadros del sitio
const SWATCHES = [
  "bg-brand-blue",
  "bg-brand-darkblue",
  "bg-brand-pink",
  "bg-brand-darkpink",
  "bg-brand-orange",
  "bg-brand-darkorange",
  "bg-brand-green",
  "bg-brand-darkgreen",
];

/** About · "Five years…": frase que se escribe oración por oración, con stickers y la paleta. */
export default function AboutTimeline() {
  const t = useTranslations("About.timeline");
  // Renglones; cada renglón tiene una o más oraciones (se escriben de a una, con pausa entre ellas)
  const STATEMENT = t.raw("lines") as string[][];
  const rootRef = useRef<HTMLElement>(null);

  useGsap((root) => createAboutTimeline(root), rootRef);

  return (
    <section ref={rootRef} className="relative h-svh w-full overflow-hidden bg-brand-black">
      {LINES.map((className) => (
        <span key={className} aria-hidden className={`absolute bg-brand-blue/50 ${className}`} />
      ))}

      {STICKERS.map((sticker) => (
        <Image
          key={sticker.src}
          data-timeline-sticker
          src={sticker.src}
          alt=""
          aria-hidden
          width={sticker.width}
          height={sticker.height}
          className={`absolute h-auto ${sticker.className}`}
        />
      ))}

      <div className="absolute inset-y-[15%] left-[7.3%] right-[12%] flex items-center">
        <h2 className="font-display text-statement font-bold leading-[1.2] text-white">
          {STATEMENT.map((line, lineIndex) => (
            <span key={lineIndex} className="block">
              {line.map((sentence, sentenceIndex) => (
                <span key={sentence}>
                  {sentenceIndex > 0 && " "}
                  <span data-timeline-sentence>
                    {Array.from(sentence).map((char, i) => (
                      <span key={i} data-timeline-char>
                        {char}
                      </span>
                    ))}
                  </span>
                </span>
              ))}
            </span>
          ))}
        </h2>
      </div>

      <ul aria-hidden className="absolute left-[67%] top-[74%] flex gap-[clamp(0.4rem,0.8vw,0.9rem)]">
        {SWATCHES.map((className) => (
          <li key={className} data-timeline-swatch className={`size-[clamp(1.5rem,2.5vw,2.75rem)] ${IRREGULAR_MASK} ${className}`} />
        ))}
      </ul>
    </section>
  );
}
