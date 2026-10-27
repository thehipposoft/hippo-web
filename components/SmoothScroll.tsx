"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getLenis, setLenis } from "@/lib/lenis";

gsap.registerPlugin(ScrollTrigger);

/**
 * Smooth scroll de todo el sitio con Lenis, sincronizado con GSAP:
 * Lenis avanza con el ticker de GSAP y avisa a ScrollTrigger en cada scroll (pins y scrubs al día).
 * Con prefers-reduced-motion no se activa (scroll nativo).
 */
export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ lerp: 0.1 });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  // Al cambiar de ruta, arrancar arriba sin animación (si no, Lenis "viaja" desde la posición anterior)
  useEffect(() => {
    getLenis()?.scrollTo(0, { immediate: true, force: true });
  }, [pathname]);

  return null;
}
