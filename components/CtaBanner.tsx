"use client";

import { useRef } from "react";
import { Link } from "@/i18n/navigation";
import { createScrollReveal } from "@/animations/reveal";
import { getSectionHref } from "@/lib/sections";
import { useGsap } from "@/lib/useGsap";

type CtaBannerProps = {
  title: string;
  /** Texto del botón (lleva a /contact) */
  link: string;
  /** Tamaño del título (por defecto, el de los statements) */
  titleClassName?: string;
};

/** Banner de cierre con invitación a contactarnos (Brochure, Systems & IA). */
export default function CtaBanner({ title, link, titleClassName = "text-statement" }: CtaBannerProps) {
  const rootRef = useRef<HTMLElement>(null);
  useGsap((root) => createScrollReveal(root), rootRef);

  return (
    <section ref={rootRef} className="relative flex min-h-[50svh] w-full items-center bg-brand-black py-[10svh] text-white md:min-h-[70svh] md:py-[14svh]">
      <div className="px-[calc(5.5%_+_1.25rem)] md:pl-[7.5%] md:pr-[12%]">
        <h2 data-reveal className={`font-display font-bold leading-none ${titleClassName}`}>
          {title}
        </h2>
        <div data-reveal className="mt-[clamp(2rem,5svh,3.5rem)]">
          <Link
            href={getSectionHref("contact")}
            className="inline-flex items-center gap-3 rounded-full bg-brand-blue px-8 py-3 font-display text-[clamp(1rem,1.3vw,1.4rem)] font-bold text-brand-darkblue transition-colors duration-300 hover:bg-white"
          >
            {link}
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
