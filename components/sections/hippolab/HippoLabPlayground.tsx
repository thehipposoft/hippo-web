"use client";

import { useRef, type ReactNode } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { createHippoRain, createSquishyButton } from "@/animations/hippolab/playground";
import LightGridLines from "@/components/LightGridLines";
import { useGsap } from "@/lib/useGsap";

/**
 * Hippo Lab · pantalla 2: "click this little hippo". Sin animación de entrada.
 * El botón se hunde y rebota al apretarlo, y suelta hippos que caen con física
 * (animations/hippolab/playground.ts) sobre el piso de la sección.
 */
export default function HippoLabPlayground() {
  const t = useTranslations("HippoLab.playground");
  const rootRef = useRef<HTMLElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const dropRef = useRef<() => void>(() => {});

  useGsap((root) => {
    const layer = layerRef.current;
    const button = root.querySelector<HTMLElement>("[data-hippo-button]");
    if (!layer || !button) return;
    const rain = createHippoRain(root, layer);
    dropRef.current = rain.drop;
    const removeSquish = createSquishyButton(button);
    return () => {
      removeSquish();
      rain.destroy();
    };
  }, rootRef);

  const button = (chunks: ReactNode) => (
    <button
      type="button"
      data-hippo-button
      aria-label={t("button")}
      onClick={() => dropRef.current()}
      className="relative mx-[0.1em] inline-block cursor-pointer rounded-full align-baseline outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue [--press-x:-0.16em] [--press-y:0.16em]"
    >
      {/* Base (botón de máquina): asoma abajo a la izquierda; al apretar, la cara baja hasta taparla */}
      <span
        aria-hidden
        className="absolute inset-0 translate-x-(--press-x) translate-y-(--press-y) rounded-full border-[0.06em] border-brand-pink bg-white"
      />
      <span
        data-squish-face
        className="relative flex items-center gap-[0.25em] rounded-full border-[0.06em] border-brand-pink bg-white py-[0.02em] pl-[0.35em] pr-[0.15em]"
      >
        {chunks}
        <Image
          src="/assets/images/hippolab/hippo-blue.svg"
          alt=""
          aria-hidden
          width={84}
          height={83}
          className="size-[0.85em]"
        />
      </span>
    </button>
  );

  const lines = t.raw("lines") as string[];
  // Cualquier renglón puede llevar el <button> (depende del idioma); el tipado estricto de
  // next-intl no admite el mismo tag en renglones que no lo tienen, así que acá se amplía.
  const richLine = t.rich as unknown as (key: string, values: Record<string, (chunks: ReactNode) => ReactNode>) => ReactNode;

  return (
    <section ref={rootRef} className="relative h-svh w-full overflow-hidden bg-white text-brand-darkblue">
      <LightGridLines />

      <p className="absolute left-[calc(5.5%_+_1.25rem)] right-[calc(5.5%_+_1.25rem)] top-[18%] font-display text-[8.5vw] font-bold leading-[1.5] md:left-[7%] md:right-[12%] md:top-[22%] md:text-[clamp(1.75rem,3.9vw,4.25rem)]">
        {lines.map((_, i) => (
          <span key={i} className="block">
            {richLine(`lines.${i}`, { button })}
          </span>
        ))}
      </p>

      {/* Capa de los hippos (la llena animations/hippolab/playground.ts) */}
      <div ref={layerRef} aria-hidden className="pointer-events-none absolute inset-0 z-10" />
    </section>
  );
}
