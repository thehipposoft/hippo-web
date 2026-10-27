"use client";

import { useRef } from "react";
import Link from "next/link";
import { createScrollReveal } from "@/animations/reveal";
import { BROCHURE_CTA } from "@/lib/brochure";
import { getSectionHref } from "@/lib/sections";
import { useGsap } from "@/lib/useGsap";

/** Brochure · cierre (pág. 8): invitación a contactarnos. Los datos de contacto viven en /contact. */
export default function BrochureCta() {
  const rootRef = useRef<HTMLElement>(null);
  useGsap((root) => createScrollReveal(root), rootRef);

  return (
    <section ref={rootRef} className="relative flex min-h-[70svh] w-full items-center bg-brand-black py-[14svh] text-white">
      <div className="pl-[7.5%] pr-[12%]">
        <h2 data-reveal className="font-display text-statement font-bold leading-none">
          {BROCHURE_CTA.title}
        </h2>
        <div data-reveal className="mt-[clamp(2rem,5svh,3.5rem)]">
          <Link
            href={getSectionHref("contact")}
            className="inline-flex items-center gap-3 rounded-full bg-brand-blue px-8 py-3 font-display text-[clamp(1rem,1.3vw,1.4rem)] font-bold text-brand-darkblue transition-colors duration-300 hover:bg-white"
          >
            {BROCHURE_CTA.link}
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
