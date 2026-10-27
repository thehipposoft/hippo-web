import type { Metadata } from "next";
import type { Locale } from "next-intl";
import { getTranslations } from "next-intl/server";
import Start from "@/components/Start";
import { localizedMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return { title: t("siteTitle"), description: t("description"), ...localizedMetadata("/", locale) };
}

export default function Home() {
  return (
    <main>
      <Start />
    </main>
  );
}
