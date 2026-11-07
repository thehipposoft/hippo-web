"use client";

import { useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { createHippoCards } from "@/animations/hippolab/cards";
import LightGridLines from "@/components/LightGridLines";
import { useGsap } from "@/lib/useGsap";

// Cartas (orden del DOM = de abajo hacia arriba en el mazo, y de izquierda a derecha al abrirse)
const CARDS = [
  {
    id: "multitasker",
    face: "bg-brand-blue text-brand-darkblue",
    image: { src: "/assets/images/hippolab/multitasking-hippo.png", width: 350, height: 336 },
  },
  {
    id: "coffee",
    face: "bg-brand-pink text-brand-darkblue",
    image: { src: "/assets/images/hippolab/coffelover-hippo.png", width: 350, height: 336 },
  },
  {
    id: "thinker",
    face: "bg-white text-brand-darkblue",
    image: { src: "/assets/images/hippolab/thinker-hippo.svg", width: 181, height: 247 },
  },
] as const;

/** Cara de la carta: frente (hippo + nombre) o dorso (igual en todas) */
const FACE = "absolute inset-0 overflow-hidden rounded-[1.1rem] [backface-visibility:hidden]";

/**
 * Hippo Lab · pantalla 3: "¿Qué tipo de hippo sos hoy?". Mazo boca abajo que se abre al pasar el
 * mouse (fondo a oscuro) y cartas que se dan vuelta al hacer click (animations/hippolab/cards.ts).
 */
export default function HippoLabCards() {
  const t = useTranslations("HippoLab.cards");
  const rootRef = useRef<HTMLElement>(null);

  useGsap((root) => createHippoCards(root), rootRef);

  return (
    <section ref={rootRef} className="relative h-svh w-full overflow-hidden bg-white [--cards-dark:var(--color-brand-black)]">
      <LightGridLines />

      <h2
        data-cards-title
        className="absolute inset-x-0 top-[17%] text-center font-display px-[calc(5.5%_+_1.25rem)] text-[8vw] font-bold text-brand-darkblue md:px-0 md:text-[clamp(1.75rem,3.2vw,3.5rem)]"
      >
        {t("title")}
      </h2>
      <p data-cards-hint className="invisible absolute inset-x-0 top-[calc(36%_+_37.5vw_+_2.5rem)] text-center md:top-[72%] font-display text-[clamp(0.9rem,1vw,1.1rem)] text-white/70">
        {t("hint")}
      </p>

      {/* Mazo: zona de hover para abrirlo */}
      <div
        data-cards-deck
        // Mobile: cartas más chicas (abiertas en tres entran en el ancho) y el mazo más abajo
        className="absolute left-1/2 top-[36%] h-[calc(var(--card-w)*1.5)] w-[min(90vw,52rem)] -translate-x-1/2 [--card-w:25vw] [perspective:1400px] md:top-[31%] md:h-[clamp(15rem,40svh,24rem)] md:[--card-w:clamp(10.5rem,27svh,16.5rem)]"
      >
        {CARDS.map((card) => (
          <button
            key={card.id}
            type="button"
            data-card
            aria-label={t(`cards.${card.id}`)}
            className="absolute left-1/2 top-0 -ml-[calc(var(--card-w)/2)] h-full w-(--card-w) cursor-pointer"
          >
            <span data-card-float className="block size-full">
              {/* Hover: se levanta y marca la sombra (CSS, no lo toca GSAP) */}
              <span className="block size-full rounded-[1.1rem] shadow-[0_8px_18px_rgba(0,0,0,0.18)] transition-[translate,box-shadow] duration-300 ease-out hover:-translate-y-2 hover:shadow-[0_22px_40px_rgba(0,0,0,0.45)]">
                <span data-card-flip className="relative block size-full [transform-style:preserve-3d]">
                  {/* Dorso */}
                  <span aria-hidden className={`${FACE} flex items-center justify-center bg-brand-darkblue`}>
                    <span className="absolute inset-[0.6rem] rounded-[0.7rem] border border-white/25 max-md:inset-[0.35rem]" />
                    <span className="flex size-[38%] items-center justify-center rounded-full bg-white">
                      <Image src="/assets/images/hippolab/rocket.svg" alt="" width={32} height={81} className="h-[70%] w-auto" />
                    </span>
                  </span>
                  {/* Frente */}
                  <span className={`${FACE} flex flex-col items-center justify-between p-[0.5rem] [transform:rotateY(180deg)] md:p-[0.9rem] ${card.face}`}>
                    <span className="relative flex w-full flex-1 items-center justify-center">
                      <Image
                        src={card.image.src}
                        alt={t(`cards.${card.id}`)}
                        width={card.image.width}
                        height={card.image.height}
                        className="max-h-full w-auto max-w-full object-contain"
                      />
                    </span>
                    <span className="pt-1 text-center font-display text-[0.7rem] font-bold leading-tight md:pt-2 md:text-[clamp(0.85rem,1.1vw,1.15rem)] md:leading-normal">
                      “{t(`cards.${card.id}`)}”
                    </span>
                  </span>
                </span>
              </span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
