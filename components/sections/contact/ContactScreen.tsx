"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useTranslations } from "next-intl";
import LightGridLines from "@/components/LightGridLines";
import SectionMenu from "@/components/SectionMenu";
import ContactForm, { CONTACT_EMAILS } from "@/components/sections/contact/ContactForm";
import { takeHeroArrival } from "@/lib/heroArrival";
import type { Section } from "@/lib/sections";
import { useGsap } from "@/lib/useGsap";

const PHONE = "+61 414 286 242";

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
  const t = useTranslations("Contact");
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
    // Mobile: layout vertical que crece con el contenido. Desktop (md): pantalla fija con todo en posición absoluta
    <div className="relative min-h-svh w-full overflow-hidden md:h-svh">
      <div data-hero-panel className="absolute inset-0 bg-white" />

      {/* Mobile: el contenido arranca 1.25rem adentro de las verticales de la grilla (5.5%) */}
      <div
        ref={contentRef}
        data-hero-content
        className="invisible relative flex flex-col gap-10 px-[calc(5.5%_+_1.25rem)] pb-[12svh] pt-[16svh] text-black md:absolute md:inset-0 md:block md:p-0"
      >
        <LightGridLines />

        {/* Globo de diálogo (mobile: 1º) */}
        <div className="relative order-1 rounded-[clamp(1rem,1.6vw,1.75rem)] bg-brand-blue px-5 py-4 text-white md:absolute md:left-[4.6%] md:top-[17.4%] md:w-[41%] md:px-[2%] md:py-[1.4%]">
          <svg aria-hidden viewBox="0 0 40 48" className="absolute -left-[clamp(1.1rem,1.6vw,1.75rem)] bottom-0 h-[clamp(1.75rem,2.6vw,3rem)] w-[clamp(1.4rem,2.1vw,2.4rem)] text-brand-blue">
            <path d="M40 0V48H0C14 42 28 30 40 0Z" fill="currentColor" />
          </svg>
          <h1 className="font-display text-[clamp(2rem,3.4vw,4rem)] font-bold leading-[1.25]">
            {t("titleLine1")}
            <br />
            {t("titleLine2")}
          </h1>
        </div>

        {/* Texto (mobile: 3º) */}
        <p className="order-3 font-display text-base leading-snug md:absolute md:left-[7.4%] md:top-[46.5%] md:w-[36%] md:text-[clamp(0.85rem,0.9vw,1rem)]">
          {t("intro")}
          <br />
          {t("introCta")}
        </p>

        {/* Datos de contacto (mobile: 4º) */}
        <ul className="order-4 flex flex-col gap-[clamp(1rem,1.8vw,2rem)] font-display text-base md:absolute md:left-[8%] md:top-[58%] md:text-[clamp(0.85rem,0.9vw,1rem)]">
          <li className="flex items-center gap-3">
            {/* TODO: reemplazar por el ícono dibujado a mano del diseño */}
            <svg aria-hidden viewBox="0 0 48 32" fill="none" className="w-[clamp(2rem,2.6vw,3rem)] shrink-0">
              <path d="M3 9h34v20H3z M3 9l17 12 17-12" stroke="currentColor" strokeWidth={2} strokeLinejoin="round" />
              <path d="M40 4l3-3M42 9h5M38 1l1-1" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
            </svg>
            <span className="flex flex-col">
              {CONTACT_EMAILS.map((email) => (
                <a key={email} href={`mailto:${email}`} className="hover:underline">
                  {email}
                </a>
              ))}
            </span>
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

        {/* Formulario (mobile: 2º) */}
        <ContactForm className="order-2 w-full md:absolute md:left-[50.3%] md:top-[26.8%] md:w-[39.7%]" />
      </div>

      <SectionMenu section={section} />
    </div>
  );
}
