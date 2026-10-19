"use client";

import type { FormEvent } from "react";
import Folder from "@/components/Folder";

export const CONTACT_EMAIL = "Hipposoft@gmail.com";

const INTERESTS = ["Web design", "Web Development", "Graphic design", "Branding", "Systems & IA"];
const TIMELINES = ["ASAP", "In a quarter", "Flexible", "Just Exploring"];

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
  // TODO: conectar a un backend / servicio de formularios. Por ahora arma un mail con lo cargado.
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const body = [
      `Name: ${data.get("name") ?? ""}`,
      `Email: ${data.get("email") ?? ""}`,
      `Interested in: ${data.getAll("interests").join(", ")}`,
      `Timeline: ${data.get("timeline") ?? ""}`,
      `Budget: ${data.get("budget") ?? ""}`,
      "",
      String(data.get("message") ?? ""),
    ].join("\n");
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("New project")}&body=${encodeURIComponent(body)}`;
  };

  return (
    <form onSubmit={onSubmit} className={className}>
      <Folder
        panelClassName="min-h-[clamp(18rem,24vw,22rem)]"
        tabs={[
          {
            id: "contact",
            label: "contact",
            className: "bg-brand-darkblue text-white",
            content: (
              <div className="flex flex-col gap-[clamp(2rem,4vw,3.5rem)] px-[3.5%] py-[clamp(2rem,4vw,3.5rem)] [--field-focus:#6e56d8] [--field-line:var(--color-brand-pink)]">
                <input name="name" type="text" placeholder="Your name" autoComplete="name" className={`${FIELD} max-w-[80%]`} />
                <input name="email" type="email" placeholder="Your email" autoComplete="email" className={`${FIELD} max-w-[80%]`} />
                <textarea name="message" rows={1} placeholder="Your message" className={`${FIELD} max-w-[80%] resize-none field-sizing-content`} />
              </div>
            ),
          },
          {
            id: "project",
            label: "project",
            className: "bg-brand-green text-brand-darkgreen",
            content: (
              <fieldset className="px-[3.5%] py-[clamp(1.5rem,3vw,2.5rem)] [--chip-accent:var(--color-brand-green)]">
                <legend className="sr-only">Project</legend>
                <p className="mb-[clamp(1rem,1.6vw,1.5rem)] font-display text-[clamp(1rem,1.15vw,1.25rem)]">I&apos;m interested in…</p>
                <div className="flex flex-wrap gap-[clamp(0.6rem,0.9vw,1rem)]">
                  {INTERESTS.map((label) => (
                    <Choice key={label} type="checkbox" name="interests" label={label} />
                  ))}
                </div>
              </fieldset>
            ),
          },
          {
            id: "timeline",
            label: "timeline",
            className: "bg-brand-darkgreen text-white",
            content: (
              <div className="flex flex-col px-[3.5%] py-[clamp(1.5rem,3vw,2.5rem)] [--chip-accent:var(--color-brand-darkgreen)] [--field-focus:var(--color-brand-darkgreen)] [--field-line:var(--color-brand-darkgreen)]">
                <fieldset>
                  <legend className="mb-[clamp(1rem,1.6vw,1.5rem)] font-display text-[clamp(1rem,1.15vw,1.25rem)]">
                    When do you want to be live?
                  </legend>
                  <div className="flex flex-wrap gap-[clamp(0.6rem,0.9vw,1rem)]">
                    {TIMELINES.map((label) => (
                      <Choice key={label} type="radio" name="timeline" label={label} />
                    ))}
                  </div>
                </fieldset>
                <label className="mt-[clamp(1rem,1.6vw,1.5rem)] font-display text-[clamp(1rem,1.15vw,1.25rem)]">
                  Working budget?
                  <input name="budget" type="text" className={`${FIELD} mt-2 max-w-[80%]`} />
                </label>
                <button
                  type="submit"
                  className="ml-auto mr-[12%] mt-[clamp(1rem,1.6vw,1.5rem)] cursor-pointer rounded-full border-2 border-brand-pink px-8 py-1.5 font-display text-[clamp(0.95rem,1.05vw,1.15rem)] font-bold shadow-[1px_2px_0_0_var(--color-brand-pink)] transition-colors duration-300 hover:bg-brand-pink/40"
                >
                  send!
                </button>
              </div>
            ),
          },
        ]}
      />
    </form>
  );
}
