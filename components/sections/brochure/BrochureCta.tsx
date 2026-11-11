import { useTranslations } from "next-intl";
import CtaBanner from "@/components/CtaBanner";

/** Brochure · cierre (pág. 8): invitación a contactarnos. Los datos de contacto viven en /contact. */
export default function BrochureCta() {
  const t = useTranslations("Brochure.cta");
  return <CtaBanner title={t("title")} link={t("link")} />;
}
