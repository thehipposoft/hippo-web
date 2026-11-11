"use client";

import { useRef } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { createLogofolioEntrance } from "@/animations/branding/logofolio";
import { useGsap } from "@/lib/useGsap";

type Logo = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Tamaño en pantalla */
  className: string;
  /** Proyecto con ficha propia en /branding-design/[slug] (lleva hover y cruz) */
  slug?: string;
};

const ROWS: { align: string; logos: Logo[] }[] = [
  {
    align: "md:items-center",
    logos: [
      { src: "/assets/images/logofolio/rock-steady.png", alt: "Rock Steady Digital", width: 1078, height: 580, className: "md:w-[clamp(8.4rem,12.4vw,13.2rem)]", slug: "rock-steady-digital" },
      { src: "/assets/images/logofolio/inspir.png", alt: "Inspir", width: 729, height: 390, className: "md:w-[clamp(7.2rem,10.9vw,12rem)]", slug: "inspir-performance" },
      { src: "/assets/images/logofolio/diversity.png", alt: "Diversity Employment", width: 1189, height: 330, className: "md:w-[clamp(10.2rem,15.6vw,16.8rem)]", slug: "diversity-employment" },
      { src: "/assets/images/logofolio/lumina.png", alt: "Lumina Technologies", width: 882, height: 370, className: "md:w-[clamp(10.2rem,15.2vw,16.8rem)]", slug: "lumina-technologies" },
    ],
  },
  {
    align: "md:items-end",
    logos: [
      { src: "/assets/images/logofolio/destino.png", alt: "Destino Salta", width: 660, height: 686, className: "md:w-[clamp(6rem,9.5vw,10.2rem)]", slug: "destino-salta" },
      { src: "/assets/images/logofolio/perri-logo.webp", alt: "Perri", width: 1701, height: 607, className: "md:w-[clamp(9.6rem,14.5vw,15.6rem)]", slug: "perri" },
      { src: "/assets/images/logofolio/logofolio-6.webp", alt: "Orgánica Natural Store", width: 364, height: 325, className: "md:w-[clamp(6rem,9.5vw,10.2rem)]" },
      { src: "/assets/images/logofolio/logofolio-7.webp", alt: "Shizen Japanese Experience", width: 934, height: 1036, className: "md:w-[clamp(4.8rem,7.7vw,8.4rem)]" },
    ],
  },
];

/** Cruz punteada: escondida detrás del logo, sale hacia abajo con el hover */
function Cross() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 40 40"
      fill="none"
      className="size-[clamp(1.5rem,1.9vw,2.25rem)] -translate-y-4 text-brand-blue/60 opacity-0 transition duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
    >
      <path d="M1.25 20H38.75M20 1.25V38.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3" />
    </svg>
  );
}

function LogoImage({ logo, interactive }: { logo: Logo; interactive: boolean }) {
  return (
    <Image
      src={logo.src}
      alt={logo.alt}
      width={logo.width}
      height={logo.height}
      // Mobile: el logo entra en la celda (alto fijo) y la ocupa; desktop: ancho propio de cada logo
      className={`relative z-10 h-auto max-h-full w-auto max-w-full object-contain opacity-60 grayscale md:h-auto md:max-h-none md:max-w-none ${
        interactive
          ? "transition duration-500 group-hover:-translate-y-2 group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0 group-focus-visible:opacity-100 group-focus-visible:grayscale-0"
          : ""
      } ${logo.className}`}
    />
  );
}

export default function LogofolioLayout() {
  const rootRef = useRef<HTMLDivElement>(null);

  useGsap((root) => {
    const tl = createLogofolioEntrance(root);
    return () => tl.kill();
  }, rootRef);

  return (
    // Mobile: una grilla de 2 columnas con todos los logos (las filas se "disuelven" con `contents`).
    // Desktop: dos filas.
    <div ref={rootRef} className="grid grid-cols-2 gap-x-4 gap-y-10 md:flex md:flex-col md:gap-[clamp(3rem,9svh,6rem)]">
      {ROWS.map((row, rowIndex) => (
        <ul key={rowIndex} data-logofolio-row className={`contents md:flex md:justify-between ${rowIndex === 1 ? "md:px-[2%]" : ""}`}>
          {row.logos.map((logo) => (
            <li key={logo.src}>
              {logo.slug ? (
                <Link href={`/branding-design/${logo.slug}`} className="group flex flex-col items-center gap-3 outline-none">
                  <div className={`flex h-32 w-full items-center justify-center md:h-[clamp(6rem,10.8vw,12rem)] md:w-auto md:justify-start ${row.align}`}>
                    <LogoImage logo={logo} interactive />
                  </div>
                  <Cross />
                </Link>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className={`flex h-32 w-full items-center justify-center md:h-[clamp(6rem,10.8vw,12rem)] md:w-auto md:justify-start ${row.align}`}>
                    <LogoImage logo={logo} interactive={false} />
                  </div>
                  {/* Mismo alto que la cruz, para que las filas queden alineadas */}
                  <span aria-hidden className="size-[clamp(1.5rem,1.9vw,2.25rem)]" />
                </div>
              )}
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
}
