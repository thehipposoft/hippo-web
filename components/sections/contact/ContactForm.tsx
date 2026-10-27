"use client";

import type { FormEvent } from "react";
import { useTranslations } from "next-intl";
import Folder from "@/components/Folder";

// Direcciones de contacto (las del brochure): se muestran en Contact y el formulario escribe a ambas
export const CONTACT_EMAILS = ["diego@thehipposoft.com", "majo@thehipposoft.com"];


// Campo de texto subrayado; los colores salen de --field-line (reposo) y --field-focus (con foco)
const FIELD =
  "w-full border-b-2 border-(--field-line) bg-transparent pb-1 font-display text-[clamp(1rem,1.15vw,1.25rem)] text-black outline-none transition-colors duration-300 placeholder:text-(--field-line) focus:border-(--field-focus)";

/** Opción tipo "chip" (checkbox o radio nativo, oculto); el color de seleccionado sale de --chip-accent */
function Choice({ type, name, label }: { type: "checkbox" | "radio"; name: string; label: string }) {
  return (
    <label className="cursor-pointer">
      <input type={type} name={name} value={label} className="peer sr-only" />
      <span className="block rounded-xl border-2 border-brand-blue/25 px-[clamp(1rem,1.6vw,1.75rem)] py-[clamp(0.6rem,0.8vw,0.9rem)] font-display text-[clamp(0.9rem,1vw,1.1rem)] transition-colors duration-300 hover:border-brand-blue/60 peer-checked:border-(--chip-accent) peer-checked:font-bold peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-blue">
        {label}
      </span>
    </label>
  );
}

/** Formulario de contacto en un <Folder />: contact → project → timeline. */
export default function ContactForm({ className = "" }: { className?: string }) {
  const t = useTranslations("Contact.form");
  const interests = t.raw("interests") as string[];
  const timelines = t.raw("timelines") as string[];
  // TODO: conectar a un backend / servicio de formularios. Por ahora arma un mail con lo cargado.
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const body = [
      `${t("mail.name")}: ${data.get("name") ?? ""}`,
      `${t("mail.email")}: ${data.get("email") ?? ""}`,
      `${t("mail.interests")}: ${data.getAll("interests").join(", ")}`,
      `${t("mail.timeline")}: ${data.get("timeline") ?? ""}`,
      `${t("mail.budget")}: ${data.get("budget") ?? ""}`,
      "",
      String(data.get("message") ?? ""),
    ].join("\n");
    window.location.href = `mailto:${CONTACT_EMAILS.join(",")}?subject=${encodeURIComponent(t("mail.subject"))}&body=${encodeURIComponent(body)}`;
  };

  return (
    <form onSubmit={onSubmit} className={className}>
      <Folder
        panelClassName="min-h-[clamp(18rem,24vw,22rem)]"
        tabs={[
          {
            id: "contact",
            label: t("tabs.contact"),
            className: "bg-brand-darkblue text-white",
            content: (
              <div className="flex flex-col gap-[clamp(2rem,4vw,3.5rem)] px-[3.5%] py-[clamp(2rem,4vw,3.5rem)] [--field-focus:#6e56d8] [--field-line:var(--color-brand-pink)]">
                <input name="name" type="text" placeholder={t("name")} autoComplete="name" className={`${FIELD} max-w-[80%]`} />
                <input name="email" type="email" placeholder={t("email")} autoComplete="email" className={`${FIELD} max-w-[80%]`} />
                <textarea name="message" rows={1} placeholder={t("message")} className={`${FIELD} max-w-[80%] resize-none field-sizing-content`} />
              </div>
            ),
          },
          {
            id: "project",
            label: t("tabs.project"),
            className: "bg-brand-green text-brand-darkgreen",
            content: (
              <fieldset className="px-[3.5%] py-[clamp(1.5rem,3vw,2.5rem)] [--chip-accent:var(--color-brand-green)]">
                <legend className="sr-only">{t("project")}</legend>
                <p className="mb-[clamp(1rem,1.6vw,1.5rem)] font-display text-[clamp(1rem,1.15vw,1.25rem)]">{t("interestedIn")}</p>
                <div className="flex flex-wrap gap-[clamp(0.6rem,0.9vw,1rem)]">
                  {interests.map((label) => (
                    <Choice key={label} type="checkbox" name="interests" label={label} />
                  ))}
                </div>
              </fieldset>
            ),
          },
          {
            id: "timeline",
            label: t("tabs.timeline"),
            className: "bg-brand-darkgreen text-white",
            content: (
              <div className="flex flex-col px-[3.5%] py-[clamp(1.5rem,3vw,2.5rem)] [--chip-accent:var(--color-brand-darkgreen)] [--field-focus:var(--color-brand-darkgreen)] [--field-line:var(--color-brand-darkgreen)]">
                <fieldset>
                  <legend className="mb-[clamp(1rem,1.6vw,1.5rem)] font-display text-[clamp(1rem,1.15vw,1.25rem)]">
                    {t("whenLive")}
                  </legend>
                  <div className="flex flex-wrap gap-[clamp(0.6rem,0.9vw,1rem)]">
                    {timelines.map((label) => (
                      <Choice key={label} type="radio" name="timeline" label={label} />
                    ))}
                  </div>
                </fieldset>
                <label className="mt-[clamp(1rem,1.6vw,1.5rem)] font-display text-[clamp(1rem,1.15vw,1.25rem)]">
                  {t("budget")}
                  <input name="budget" type="text" className={`${FIELD} mt-2 max-w-[80%]`} />
                </label>
                <button
                  type="submit"
                  className="ml-auto mr-[12%] mt-[clamp(1rem,1.6vw,1.5rem)] cursor-pointer rounded-full border-2 border-brand-pink px-8 py-1.5 font-display text-[clamp(0.95rem,1.05vw,1.15rem)] font-bold shadow-[1px_2px_0_0_var(--color-brand-pink)] transition-colors duration-300 hover:bg-brand-pink/40"
                >
                  {t("send")}
                </button>
              </div>
            ),
          },
        ]}
      />
    </form>
  );
}
