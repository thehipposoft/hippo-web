import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("NotFound");

  return (
    <main className="flex min-h-svh flex-col items-start justify-center gap-6 bg-brand-black px-[7.5%] text-white">
      <h1 className="font-display text-statement font-bold leading-none">{t("title")}</h1>
      <p className="text-[clamp(1rem,1.3vw,1.4rem)]">{t("description")}</p>
      <Link href="/" className="rounded-full bg-brand-blue px-8 py-3 font-display font-bold text-brand-darkblue">
        {t("back")}
      </Link>
    </main>
  );
}
