"use client";

import { Fragment, useRef } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { createAboutStatement } from "@/animations/about/statement";
import { getSectionHref } from "@/lib/sections";
import { useGsap } from "@/lib/useGsap";
import { useTranslations } from "next-intl";

// ── Copy: en messages/*.json (About.intro, About.values, About.closing) ──
// Acá solo lo visual: colores de cada card, en el orden de About.values.items
const VALUE_CARD_CLASSES = [
  "bg-brand-orange text-brand-darkorange",
  "bg-brand-darkblue text-white",
  "bg-brand-green text-brand-darkgreen",
];

type ValueItem = { title: string; text: string };

/** Texto partido en palabras (texto real, legible por lectores de pantalla y buscadores) */
function Words({ text }: { text: string }) {
  return text.split(" ").map((word, i) => (
    <Fragment key={i}>
      {i > 0 && " "}
      <span data-about-word>{word}</span>
    </Fragment>
  ));
}

/** Texto partido en caracteres para la animación de escritura de los títulos */
function Chars({ text }: { text: string }) {
  return Array.from(text).map((char, i) => (
    <span key={i} data-about-char>
      {char}
    </span>
  ));
}

/**
 * About · storytelling en tres bloques sobre fondo blanco.
 * Animaciones en animations/about/statement.ts. Las clases `motion-safe:md:` arman el layout
 * pineado (desktop sin reduced-motion); en el resto, todo queda en flujo normal.
 */
export default function AboutStatement() {
  const rootRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("About");
  const INTRO = {
    titleStart: t("intro.titleStart"),
    titleMarked: t("intro.titleMarked"),
    titleEnd: t("intro.titleEnd"),
    paragraphs: t.raw("intro.paragraphs") as string[],
  };
  const VALUES = {
    titleStart: t("values.titleStart"),
    titleMarked: t("values.titleMarked"),
    items: (t.raw("values.items") as ValueItem[]).map((item, i) => ({ ...item, className: VALUE_CARD_CLASSES[i] })),
  };
  const CLOSING = { text: t("closing.text"), cta: t("closing.cta") };

  useGsap((root) => createAboutStatement(root), rootRef);

  return (
    <div ref={rootRef} className="text-black">
      {/* 1. Intro */}
      {/* Mobile: sin alto de pantalla completa y con menos aire entre bloques */}
      <section data-about-intro className="relative flex items-center overflow-hidden bg-white pb-[6svh] pt-[12svh] md:min-h-svh md:py-[18svh]">
        <div className="relative px-[calc(5.5%_+_1.25rem)] md:pl-[7.5%] md:pr-[12%]">
          <h2 data-about-type className="font-display text-statement tracking-tight font-bold leading-[1.05]">
            <Chars text={INTRO.titleStart} />
            <span className="relative inline-block">
              <Chars text={INTRO.titleMarked} />
              {/* Círculo a mano (como en Branding). Un <svg> absoluto no se estira entre los bordes: lo hace el span */}
              <span aria-hidden className="pointer-events-none absolute -bottom-[0.3em] -left-[0.25em] -right-[0.25em] -top-[0.2em]">
                <svg viewBox="0 0 300 100" preserveAspectRatio="none" fill="none" className="block size-full overflow-visible text-brand-pink">
                  <path
                    data-about-circle
                    d="M250 12C180 2 60 4 20 22C-2 34 2 70 30 82C80 98 230 96 280 78C302 68 300 30 270 18C240 8 200 10 168 16"
                    stroke="currentColor"
                    strokeWidth={3}
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
              </span>
            </span>
            <Chars text={INTRO.titleEnd} />
          </h2>
          {INTRO.paragraphs.map((paragraph) => (
            <p
              key={paragraph}
              className="mt-[clamp(1rem,2svh,1.75rem)] max-w-[62rem] font-display text-[clamp(1.25rem,2.1vw,2.25rem)] leading-[1.3]"
            >
              <Words text={paragraph} />
            </p>
          ))}
        </div>
      </section>

      {/* 2. Lo que nos mueve */}
      <section
        data-about-cards
        className="relative overflow-hidden bg-white px-[calc(5.5%_+_1.25rem)] py-[6svh] md:min-h-svh md:px-[7.5%] md:py-[18svh] motion-safe:md:h-svh motion-safe:md:py-0"
      >
        <h2
          data-about-type
          className="relative font-display text-[clamp(2rem,4vw,4.5rem)] font-bold leading-[1.05] motion-safe:md:absolute motion-safe:md:left-[7.5%] motion-safe:md:top-[20%]"
        >
          <Chars text={VALUES.titleStart} />
          <br />
          <span className="relative inline-block text-statement">
            <Chars text={VALUES.titleMarked} />
            {/* Un <svg> absoluto no se estira entre left/right: lo hace el span */}
            {/* Subrayado a mano (mismo trazo que en Web Development) */}
            <span data-about-underline aria-hidden className="pointer-events-none absolute inset-x-0 -bottom-[0.1em] h-[0.2em]">
              <svg viewBox="0 0 300 12" preserveAspectRatio="none" fill="none" className="block size-full overflow-visible text-brand-pink">
                <path
                  d="M2 7C60 5 120 4 180 5C230 6 270 7 298 8"
                  stroke="currentColor"
                  strokeWidth={6}
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </span>
          </span>
        </h2>
        <ol className="relative mt-[clamp(1.5rem,4svh,3rem)] flex flex-col gap-6 motion-safe:md:absolute motion-safe:md:left-[50%] motion-safe:md:top-[16%] motion-safe:md:mt-0 motion-safe:md:block motion-safe:md:aspect-[3/4] motion-safe:md:h-[66svh]">
          {VALUES.items.map((item, i) => (
            <li
              key={item.title}
              data-about-card
              className={`flex flex-col justify-between gap-8 rounded-xl p-[clamp(1.5rem,2.6vw,2.75rem)] motion-safe:md:absolute motion-safe:md:inset-0 ${item.className}`}
            >
              <span className="font-display text-[clamp(2.5rem,4.5vw,4.5rem)] font-bold leading-none">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-display text-[clamp(1.4rem,2vw,2.25rem)] font-bold leading-tight">{item.title}</h3>
                <p className="mt-3 max-w-[34rem] text-[clamp(1rem,1.2vw,1.25rem)] leading-relaxed">{item.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* 3. Cierre */}
      <section data-about-closing className="relative flex items-center overflow-hidden bg-white pb-[12svh] pt-[6svh] md:min-h-svh md:py-[18svh]">
        <div className="relative grid w-full gap-4 px-[calc(5.5%_+_1.25rem)] md:grid-cols-[1fr_auto] md:pl-[7.5%] md:pr-[12%]">
          <div>
            {/* Entra línea por línea, cada una recortada por su propia máscara */}
            <h2 data-about-lines className="font-display text-[clamp(1.75rem,3.2vw,3.5rem)] font-bold leading-tight">
              {CLOSING.text}
            </h2>
            <div data-about-reveal className="mt-[clamp(2rem,5svh,3.5rem)]">
              <Link
                href={getSectionHref("contact")}
                className="inline-flex items-center gap-3 rounded-full bg-brand-darkblue px-8 py-3 font-display text-[clamp(1rem,1.3vw,1.4rem)] font-bold text-white transition-colors duration-300 hover:bg-brand-blue"
              >
                {CLOSING.cta}
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
          {/* El SVG es una hoja A5 con el personaje en la parte de abajo: se alinea abajo. Espejado (scaleX -1) */}
          <Image
            data-about-character
            src="/assets/images/hippo-personaje.svg"
            alt={t("closing.characterAlt")}
            width={148}
            height={210}
            className="h-auto w-[clamp(12rem,20vw,26rem)] -scale-x-100 justify-self-center md:justify-self-end"
          />
        </div>
      </section>
    </div>
  );
}
