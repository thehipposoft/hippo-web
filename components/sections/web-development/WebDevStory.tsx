"use client";

import { useRef, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { createWebDevStory } from "@/animations/web-development/story";
import { getSectionHref } from "@/lib/sections";
import { useGsap } from "@/lib/useGsap";

const PARAGRAPH = "max-w-[56rem] font-display text-[clamp(1.25rem,2.1vw,2.25rem)] leading-[1.35] text-brand-darkblue";

/**
 * Web Development · pantalla 4: "Tu sitio es la primera impresión". Fondo blanco, sin líneas.
 * Cada bloque entra distinto con el scroll (animations/web-development/story.ts).
 */
export default function WebDevStory() {
  const t = useTranslations("WebDev.story");
  const rootRef = useRef<HTMLElement>(null);

  useGsap((root) => createWebDevStory(root), rootRef);

  const mark = (chunks: ReactNode) => (
    // Resaltado que se barre de izquierda a derecha (background-size)
    <span
      data-story-mark
      className="rounded-[0.15em] bg-[linear-gradient(var(--color-brand-green),var(--color-brand-green))] bg-[length:100%_100%] bg-no-repeat px-[0.08em] [box-decoration-break:clone]"
    >
      {chunks}
    </span>
  );
  const red = (chunks: ReactNode) => (
    // Subrayado rojo que se dibuja al terminar la entrada del párrafo
    <span className="relative inline-block">
      {chunks}
      <span data-story-red aria-hidden className="pointer-events-none absolute inset-x-0 -bottom-[0.08em] h-[0.18em]">
        <svg viewBox="0 0 300 12" preserveAspectRatio="none" fill="none" className="block size-full overflow-visible text-brand-orange">
          <path d="M2 7C60 5 120 4 180 5C230 6 270 7 298 8" stroke="currentColor" strokeWidth={4} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        </svg>
      </span>
    </span>
  );
  const underline = (chunks: ReactNode) => (
    <span className="relative inline-block">
      {chunks}
      {/* Un <svg> absoluto no se estira entre left/right: lo hace el span */}
      <span data-story-underline aria-hidden className="pointer-events-none absolute inset-x-0 -bottom-[0.1em] h-[0.2em]">
        <svg viewBox="0 0 300 12" preserveAspectRatio="none" fill="none" className="block size-full overflow-visible text-brand-blue">
          <path d="M2 7C60 5 120 4 180 5C230 6 270 7 298 8" stroke="currentColor" strokeWidth={5} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        </svg>
      </span>
    </span>
  );

  return (
    <section ref={rootRef} className="relative w-full overflow-hidden bg-white px-[7.5%] py-[20svh]">
      <h2 className="font-display text-[clamp(2.75rem,7.5vw,8.5rem)] font-bold leading-[1.02] text-brand-darkblue">
        <span data-story-title1 className="block">
          {t("title1")}
        </span>
        <span data-story-title2 className="block text-brand-blue">
          {t("title2")}
        </span>
      </h2>

      <div className="mt-[clamp(5rem,18svh,12rem)] flex flex-col gap-[clamp(4rem,16svh,10rem)]">
        <p data-story-p1 className={PARAGRAPH}>
          {t("p1")}
        </p>
        <p data-story-p2 className={`${PARAGRAPH} self-end`}>
          {t.rich("p2", { red })}
        </p>
        <p data-story-p3 className={PARAGRAPH}>
          {t.rich("p3", { mark })}
        </p>
      </div>

      <p data-story-closing className="mt-[clamp(6rem,22svh,14rem)] max-w-[70rem] font-display text-[clamp(2rem,4.6vw,5rem)] font-bold leading-[1.1] text-brand-darkblue">
        {t.rich("closing", { u: underline })}
      </p>

      <div data-story-cta className="mt-[clamp(2rem,5svh,3.5rem)]">
        <Link
          href={getSectionHref("contact")}
          className="inline-flex items-center gap-3 rounded-full bg-brand-darkblue px-8 py-3 font-display text-[clamp(1rem,1.3vw,1.4rem)] font-bold text-white transition-colors duration-300 hover:bg-brand-blue"
        >
          {t("cta")}
          <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}
