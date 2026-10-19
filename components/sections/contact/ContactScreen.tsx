"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import SectionMenu from "@/components/SectionMenu";
import ContactForm, { CONTACT_EMAIL } from "@/components/sections/contact/ContactForm";
import { takeHeroArrival } from "@/lib/heroArrival";
import type { Section } from "@/lib/sections";
import { GRID_LINE_LEFT, GRID_LINE_RIGHT } from "@/lib/sectionGrid";
import { useGsap } from "@/lib/useGsap";

const PHONE = "+61 414 286 242";

// Líneas de fondo: las verticales continúan las del resto del sitio
const LINES = [
  `inset-y-0 ${GRID_LINE_LEFT} w-px`,
  `inset-y-0 ${GRID_LINE_RIGHT} w-px`,
  "inset-x-0 top-[15%] h-px",
  "inset-x-0 top-[81%] h-px",
];

type ContactScreenProps = {
  section: Section;
  /** false en la capa de transición: ahí el contenido lo hace aparecer la transición */
  intro?: boolean;
};

/**
 * Pantalla de /contact. A diferencia de <SectionHero />, no tiene título que viaja ni fondo oscuro:
 * la transición abre el recuadro a pantalla completa en blanco y aparece esta pantalla.
 * Partes que usa la transición: [data-hero-panel], [data-hero-content] y el botón de <SectionMenu />.
 */
export default function ContactScreen({ section, intro = true }: ContactScreenProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useGsap(
    (content) => {
      if (!intro) return;
      // Llegando desde la transición ya está visible; si no, entra con un fade
      if (takeHeroArrival()) {
        gsap.set(content, { autoAlpha: 1 });
        return;
      }
      const tween = gsap.fromTo(content, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power2.out" });
      return () => tween.kill();
    },
    contentRef,
  );

  return (
    <div className="relative h-svh w-full overflow-hidden">
      <div data-hero-panel className="absolute inset-0 bg-white" />

      <div ref={contentRef} data-hero-content className="invisible absolute inset-0 text-black">
        {LINES.map((className) => (
          <span key={className} aria-hidden className={`absolute bg-brand-blue/50 ${className}`} />
        ))}

        {/* Globo de diálogo */}
        <div className="absolute left-[4.6%] top-[17.4%] w-[41%] rounded-[clamp(1rem,1.6vw,1.75rem)] bg-brand-blue px-[2%] py-[1.4%] text-white">
          <svg aria-hidden viewBox="0 0 40 48" className="absolute -left-[clamp(1.1rem,1.6vw,1.75rem)] bottom-0 h-[clamp(1.75rem,2.6vw,3rem)] w-[clamp(1.4rem,2.1vw,2.4rem)] text-brand-blue">
            <path d="M40 0V48H0C14 42 28 30 40 0Z" fill="currentColor" />
          </svg>
          <h1 className="font-display text-[clamp(2rem,3.4vw,4rem)] font-bold leading-[1.25]">
            Got an idea?
            <br />
            Let&apos;s make it a thing.
          </h1>
        </div>

        <p className="absolute left-[7.4%] top-[46.5%] w-[36%] font-display text-[clamp(0.85rem,0.9vw,1rem)] leading-snug">
          It can be a half-baked idea, a big problem, a weird thought or something you&apos;ve been meaning to fix
          for years.
          <br />
          Tell us. We&apos;ll take it from there…
        </p>

        <ul className="absolute left-[8%] top-[58%] flex flex-col gap-[clamp(1rem,1.8vw,2rem)] font-display text-[clamp(0.85rem,0.9vw,1rem)]">
          <li>
            <a href={`mailto:${CONTACT_EMAIL}`} className="flex items-center gap-3 hover:underline">
              {/* TODO: reemplazar por el ícono dibujado a mano del diseño */}
              <svg aria-hidden viewBox="0 0 48 32" fill="none" className="w-[clamp(2rem,2.6vw,3rem)]">
                <path d="M3 9h34v20H3z M3 9l17 12 17-12" stroke="currentColor" strokeWidth={2} strokeLinejoin="round" />
                <path d="M40 4l3-3M42 9h5M38 1l1-1" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
              </svg>
              {CONTACT_EMAIL}
            </a>
          </li>
          <li>
            <a href={`tel:${PHONE.replaceAll(" ", "")}`} className="flex items-center gap-3 hover:underline">
              {/* TODO: reemplazar por el ícono dibujado a mano del diseño */}
              <svg aria-hidden viewBox="0 0 48 48" fill="none" className="w-[clamp(2rem,2.6vw,3rem)]">
                <rect x="15" y="6" width="18" height="34" rx="3" stroke="currentColor" strokeWidth={2} />
                <circle cx="24" cy="34" r="1.6" fill="currentColor" />
                <path d="M19 18c3-4 7-4 10 0-3 4-7 4-10 0Z" stroke="currentColor" strokeWidth={1.6} />
                <path d="M9 12l3 2M8 24h4M9 36l3-2M39 12l-3 2M40 24h-4M39 36l-3-2" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
              </svg>
              {PHONE}
            </a>
          </li>
        </ul>

        <ContactForm className="absolute left-[50.3%] top-[26.8%] w-[39.7%]" />
      </div>

      <SectionMenu section={section} />
    </div>
  );
}
