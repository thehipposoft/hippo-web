"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import Folder from "@/components/Folder";

// Direcciones de contacto (las del brochure): se muestran en Contact
export const CONTACT_EMAILS = ["diego@thehipposoft.com", "majo@thehipposoft.com"];

// Endpoint del formulario de la web actual (WordPress): recibe { interest, name, customerEmail, message }
const CONTACT_ENDPOINT = "https://wp.thehipposoft.com/wp-json/hippo-api/v1/contact";

// Valores que se envían como `interest` (los mismos slugs que la web actual); el texto sale de Contact.form.interests
const INTERESTS = ["web-design", "web-development", "graphic-design", "branding", "systems-ia"] as const;

// Campos obligatorios: están en la pestaña "contacto" (la 0)
const REQUIRED_FIELDS = ["name", "email", "message"] as const;
const CONTACT_TAB = 0;

type Status = "idle" | "sending" | "success" | "error" | "invalid";

// Campo de texto subrayado; los colores salen de --field-line (reposo) y --field-focus (con foco)
const FIELD =
  "w-full border-b-2 border-(--field-line) bg-transparent pb-1 font-display text-[clamp(1rem,1.15vw,1.25rem)] text-black outline-none transition-colors duration-300 placeholder:text-(--field-line) focus:border-(--field-focus) aria-invalid:border-red-500";

/** Opción tipo "chip" (checkbox o radio nativo, oculto); seleccionada se pinta entera (fondo y borde) con --chip-accent */
function Choice({ type, name, value, label }: { type: "checkbox" | "radio"; name: string; value: string; label: string }) {
  return (
    <label className="cursor-pointer">
      <input type={type} name={name} value={value} className="peer sr-only" />
      <span className="block rounded-xl border-2 border-brand-blue/25 px-[clamp(1rem,1.6vw,1.75rem)] py-[clamp(0.6rem,0.8vw,0.9rem)] font-display text-[clamp(0.9rem,1vw,1.1rem)] transition-colors duration-300 hover:border-brand-blue/60 peer-checked:border-(--chip-accent) peer-checked:bg-(--chip-accent) peer-checked:font-bold peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-blue">
        {label}
      </span>
    </label>
  );
}

/**
 * Formulario de contacto en un <Folder />: contact → project → timeline.
 * Envía al endpoint de la web actual. Plazos y presupuesto no tienen campo propio en la API:
 * se agregan al final del mensaje.
 * La validación es propia (noValidate): los campos obligatorios están en otra pestaña que el botón,
 * así que si falta alguno se vuelve a "contacto" y se enfoca el primero con error.
 */
export default function ContactForm({ className = "" }: { className?: string }) {
  const t = useTranslations("Contact.form");
  const timelines = t.raw("timelines") as string[];
  const formRef = useRef<HTMLFormElement>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [status, setStatus] = useState<Status>("idle");
  const [invalid, setInvalid] = useState<string[]>([]);

  // Después de volver a la pestaña "contacto", enfocar el primer campo con error (ya visible)
  useEffect(() => {
    if (status !== "invalid" || activeTab !== CONTACT_TAB || invalid.length === 0) return;
    formRef.current?.querySelector<HTMLElement>(`[name="${invalid[0]}"]`)?.focus();
  }, [status, activeTab, invalid]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "sending") return;
    const form = event.currentTarget;

    const missing = REQUIRED_FIELDS.filter((name) => {
      const field = form.elements.namedItem(name);
      return !(field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) || !field.value.trim() || !field.checkValidity();
    });
    setInvalid(missing);
    if (missing.length > 0) {
      setStatus("invalid");
      setActiveTab(CONTACT_TAB);
      return;
    }

    const data = new FormData(form);
    const extras = [
      [t("mail.timeline"), data.get("timeline")],
      [t("mail.budget"), data.get("budget")],
    ]
      .filter(([, value]) => typeof value === "string" && value.trim())
      .map(([label, value]) => `${label}: ${String(value).trim()}`);
    const message = [String(data.get("message") ?? "").trim(), ...(extras.length ? ["", ...extras] : [])].join("\n");

    setStatus("sending");
    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json, text/plain, */*" },
        body: JSON.stringify({
          interest: data.getAll("interests").map(String),
          name: String(data.get("name") ?? "").trim(),
          customerEmail: String(data.get("email") ?? "").trim(),
          message,
        }),
      });
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      form.reset();
      setStatus("success");
    } catch (error) {
      console.error("Contact form:", error);
      setStatus("error");
    }
  };

  // Al editar un campo con error, se le quita la marca
  const clearInvalid = (name: string) => {
    if (invalid.includes(name)) setInvalid(invalid.filter((field) => field !== name));
  };

  const statusText = status === "idle" ? "" : t(`status.${status}`);
  const statusColor = status === "error" || status === "invalid" ? "text-red-600" : "";

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className={className}>
      <Folder
        active={activeTab}
        onActiveChange={setActiveTab}
        panelClassName="min-h-[clamp(18rem,24vw,22rem)]"
        tabs={[
          {
            id: "contact",
            label: t("tabs.contact"),
            className: "bg-brand-darkblue text-white",
            content: (
              <div className="flex flex-col gap-[clamp(2rem,4vw,3.5rem)] px-[3.5%] py-[clamp(2rem,4vw,3.5rem)] [--field-focus:#6e56d8] [--field-line:var(--color-brand-pink)]">
                {status === "invalid" && (
                  <p role="alert" className="-mb-[clamp(1rem,2vw,1.75rem)] font-display text-[clamp(0.9rem,1vw,1.05rem)] text-red-600">
                    {statusText}
                  </p>
                )}
                <input name="name" required aria-invalid={invalid.includes("name") || undefined} onInput={() => clearInvalid("name")} type="text" placeholder={t("name")} autoComplete="name" className={`${FIELD} max-w-[80%]`} />
                <input name="email" required aria-invalid={invalid.includes("email") || undefined} onInput={() => clearInvalid("email")} type="email" placeholder={t("email")} autoComplete="email" className={`${FIELD} max-w-[80%]`} />
                <textarea name="message" required aria-invalid={invalid.includes("message") || undefined} onInput={() => clearInvalid("message")} rows={1} placeholder={t("message")} className={`${FIELD} max-w-[80%] resize-none field-sizing-content`} />
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
                  {INTERESTS.map((value) => (
                    <Choice key={value} type="checkbox" name="interests" value={value} label={t(`interests.${value}`)} />
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
              <div className="flex flex-col px-[3.5%] py-[clamp(1.5rem,3vw,2.5rem)] [--chip-accent:var(--color-brand-pink)] [--field-focus:var(--color-brand-darkgreen)] [--field-line:var(--color-brand-darkgreen)]">
                <fieldset>
                  <legend className="mb-[clamp(1rem,1.6vw,1.5rem)] font-display text-[clamp(1rem,1.15vw,1.25rem)]">
                    {t("whenLive")}
                  </legend>
                  <div className="flex flex-wrap gap-[clamp(0.6rem,0.9vw,1rem)]">
                    {timelines.map((label) => (
                      <Choice key={label} type="radio" name="timeline" value={label} label={label} />
                    ))}
                  </div>
                </fieldset>
                <label className="mt-[clamp(1rem,1.6vw,1.5rem)] font-display text-[clamp(1rem,1.15vw,1.25rem)]">
                  {t("budget")}
                  <input name="budget" type="text" className={`${FIELD} mt-2 max-w-[80%]`} />
                </label>
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="ml-auto mr-[12%] mt-[clamp(1rem,1.6vw,1.5rem)] cursor-pointer rounded-full border-2 border-brand-pink px-8 py-1.5 font-display text-[clamp(0.95rem,1.05vw,1.15rem)] font-bold shadow-[1px_2px_0_0_var(--color-brand-pink)] transition-colors duration-300 hover:bg-brand-pink/40 disabled:cursor-wait disabled:opacity-50"
                >
                  {status === "sending" ? t("status.sending") : t("send")}
                </button>
                <p aria-live="polite" className={`mt-3 min-h-[1.5em] text-right font-display text-[clamp(0.9rem,1vw,1.05rem)] mr-[12%] ${statusColor}`}>
                  {status === "success" || status === "error" ? statusText : ""}
                </p>
              </div>
            ),
          },
        ]}
      />
    </form>
  );
}
