import { useTranslations } from "next-intl";
import CtaBanner from "@/components/CtaBanner";

/** Systems & IA · cierre: invitación a contarnos un proceso para resolver. */
export default function SystemsCta() {
  const t = useTranslations("Systems.cta");
  // La pregunta es más larga que la del brochure: un tamaño menos que el de los statements
  return (
    <CtaBanner
      title={t("title")}
      link={t("link")}
      titleClassName="text-[9vw] leading-[1.05] md:text-[clamp(2rem,4.5vw,4.75rem)]"
    />
  );
}
