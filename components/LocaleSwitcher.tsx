"use client";

import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

/**
 * Cambio de idioma: misma página en el otro idioma (secciones y fichas incluidas, los slugs no cambian).
 * Fijo arriba a la derecha, sobre todas las pantallas; mix-blend-difference lo hace legible sobre
 * fondos claros y oscuros.
 */
export default function LocaleSwitcher() {
  const t = useTranslations("Nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <nav
      aria-label={t("language")}
      className="fixed right-[clamp(1rem,2vw,2rem)] top-[clamp(1rem,2vw,1.75rem)] z-[65] flex items-center gap-1 font-display text-[clamp(0.85rem,0.95vw,1rem)] font-bold text-white mix-blend-difference"
    >
      {routing.locales.map((target, i) => {
        const active = target === locale;
        return (
          <span key={target} className="flex items-center gap-1">
            {i > 0 && <span aria-hidden className="opacity-50">/</span>}
            <button
              type="button"
              lang={target}
              disabled={active || pending}
              aria-current={active ? "true" : undefined}
              aria-label={t("switchTo", { language: t(`languages.${target}`) })}
              onClick={() => startTransition(() => router.replace(pathname, { locale: target }))}
              className={`cursor-pointer uppercase transition-opacity duration-300 disabled:cursor-default ${
                active ? "opacity-100 underline decoration-2 underline-offset-4" : "opacity-60 hover:opacity-100"
              }`}
            >
              {target}
            </button>
          </span>
        );
      })}
    </nav>
  );
}
