"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
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
    align: "items-center",
    logos: [
      { src: "/assets/images/logofolio/rock-steady.png", alt: "Rock Steady Digital", width: 1078, height: 580, className: "w-[clamp(7rem,10.3vw,11rem)]", slug: "rock-steady-digital" },
      { src: "/assets/images/logofolio/inspir.png", alt: "Inspir", width: 729, height: 390, className: "w-[clamp(6rem,9.1vw,10rem)]", slug: "inspir-performance" },
      { src: "/assets/images/logofolio/diversity.png", alt: "Diversity Employment", width: 1189, height: 330, className: "w-[clamp(8.5rem,13vw,14rem)]", slug: "diversity-employment" },
      { src: "/assets/images/logofolio/lumina.png", alt: "Lumina Technologies", width: 882, height: 370, className: "w-[clamp(8.5rem,12.7vw,14rem)]", slug: "lumina-technologies" },
    ],
  },
  {
    align: "items-end",
    logos: [
      { src: "/assets/images/logofolio/destino.png", alt: "Destino Salta", width: 660, height: 686, className: "w-[clamp(5rem,7.9vw,8.5rem)]", slug: "destino-salta" },
      { src: "/assets/images/logofolio/perri-logo.webp", alt: "Perri", width: 1701, height: 607, className: "w-[clamp(8rem,12.1vw,13rem)]", slug: "perri" },
      { src: "/assets/images/logofolio/logofolio-6.webp", alt: "Orgánica Natural Store", width: 364, height: 325, className: "w-[clamp(5rem,7.9vw,8.5rem)]" },
      { src: "/assets/images/logofolio/logofolio-7.webp", alt: "Shizen Japanese Experience", width: 934, height: 1036, className: "w-[clamp(4rem,6.4vw,7rem)]" },
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
      className={`relative z-10 h-auto opacity-60 grayscale ${
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
    <div ref={rootRef} className="flex flex-col gap-[clamp(3rem,9svh,6rem)]">
      {ROWS.map((row, rowIndex) => (
        <ul key={rowIndex} data-logofolio-row className={`flex justify-between ${rowIndex === 1 ? "px-[2%]" : ""}`}>
          {row.logos.map((logo) => (
            <li key={logo.src}>
              {logo.slug ? (
                <Link href={`/branding-design/${logo.slug}`} className="group flex flex-col items-center gap-3 outline-none">
                  <div className={`flex h-[clamp(5rem,9vw,10rem)] ${row.align}`}>
                    <LogoImage logo={logo} interactive />
                  </div>
                  <Cross />
                </Link>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className={`flex h-[clamp(5rem,9vw,10rem)] ${row.align}`}>
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
