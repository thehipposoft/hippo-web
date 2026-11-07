import Image from "next/image";
import { useTranslations } from "next-intl";

/**
 * Cierre de la ficha de Perri (reemplaza la leyenda / galería del resto de las fichas):
 * dos composiciones de imágenes y los datos del proyecto.
 */
export default function PerriShowcase({ name }: { name: string }) {
  const t = useTranslations("Logofolio");

  return (
    // relative + z-20: las secciones anteriores de la ficha son `sticky`; sin esto quedan pintadas encima
    <div className="relative z-20 bg-white text-black">
      {/* Local + farmacéutica (la imagen de la derecha ya trae su fondo blanco) */}
      <div className="flex flex-col lg:h-screen lg:flex-row">
        <div className="relative h-[70vh] lg:h-auto lg:w-1/2">
          <Image
            src="/assets/images/logofolio/perri/perri-4.webp"
            alt={t("ui.imageAlt", { name: `${name} Salud` })}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div className="lg:w-1/2">
          <Image
            src="/assets/images/logofolio/perri/perri-7.webp"
            alt={t("ui.itemAlt", { name: `${name} Salud` })}
            width={1100}
            height={1008}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="h-auto w-full"
          />
        </div>
      </div>

      {/* Tote + cuadro, catálogo y datos del proyecto */}
      <div className="flex flex-col gap-10 pb-16 lg:flex-row lg:items-start lg:gap-[0.15%] lg:pb-0">
        <div className="lg:w-[60%]">
          <Image
            src="/assets/images/logofolio/perri/perri-5.webp"
            alt={t("ui.itemAlt", { name: `${name} Casa` })}
            width={1045}
            height={883}
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="h-auto w-full"
          />
        </div>
        <div className="flex flex-col items-start gap-[clamp(3rem,10vh,7rem)] px-[6%] lg:w-[32%] lg:items-end lg:px-0 lg:pt-[clamp(2rem,6vh,4rem)]">
          <Image
            src="/assets/images/logofolio/perri/perri-6.webp"
            alt={t("ui.imageAlt", { name: `${name} Casa` })}
            width={1056}
            height={992}
            sizes="(max-width: 1024px) 90vw, 32vw"
            className="h-auto w-full"
          />
          <div className="flex flex-col gap-1 text-[clamp(1rem,1.25vw,1.4rem)] uppercase leading-snug">
            <p>{name}</p>
            <p>{t("projects.perri.country")}</p>
            <p>{t("projects.perri.date")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
