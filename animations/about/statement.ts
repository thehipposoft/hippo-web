import { gsap } from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { UNDERLINE_HIDDEN, UNDERLINE_SHOWN } from "@/animations/underline";
// ScrollTrigger se registra una sola vez, en lib/useGsap.ts

gsap.registerPlugin(DrawSVGPlugin, SplitText);

// Breakpoints (alineados con `md` de Tailwind y las variantes motion-safe del markup)
const DESKTOP = "(prefers-reduced-motion: no-preference) and (min-width: 768px)";
const MOBILE = "(prefers-reduced-motion: no-preference) and (max-width: 767px)";
const MOTION = "(prefers-reduced-motion: no-preference)";

// Títulos: segundos entre un carácter y el siguiente, y fade de cada uno
const TYPE_INTERVAL = 0.035;
const CHAR_FADE = 0.3;

// Intro: opacidad de las palabras "vacías" y scroll pineado por palabra
const WORD_DIM = 0.15;
const PIN_PX_PER_WORD = 14;
// Mazo de cards: giro con el que queda cada una y, por cada nivel de profundidad, cómo retroceden
const CARD_ROTATION = [0, -3, 2.5];
const CARD_SCALE_STEP = 0.05;
const CARD_SHIFT_STEP = 26;
const CARD_BRIGHTNESS_STEP = 0.15;

/**
 * Animaciones de <AboutStatement /> (scroll):
 * - Títulos [data-about-type]: se escriben carácter por carácter (cada uno con fade); al terminar
 *   se dibuja su marca, si tienen: [data-about-circle] (círculo) o [data-about-underline] (subrayado).
 *   Opcionales: data-type-interval="…" (velocidad propia) y [data-about-rise] (el bloque sube desde abajo).
 * - Intro: las palabras se "llenan" (opacidad) en secuencia con scrub; en desktop la sección se pinea.
 * - Lo que nos mueve: la primera card aparece con fade al entrar la sección. En desktop, mazo de
 *   cards con pin + scrub (cada una entra desde la derecha;
 *   las de atrás se achican, se corren a la izquierda y se oscurecen); en mobile, reveal de una lista.
 * - Cierre: el texto [data-about-lines] entra línea por línea desde abajo, cada línea recortada por
 *   su propia máscara (SplitText, se vuelve a partir si cambia el ancho o carga la fuente); el
 *   personaje sube con fade y el CTA aparece con el reveal. Sin pin.
 * Con prefers-reduced-motion no se crea nada: texto completo y cards en lista.
 * Debe llamarse dentro de un gsap.context() con scope en el contenedor. Devuelve la limpieza.
 */
export function createAboutStatement(root: HTMLElement): () => void {
  const intro = root.querySelector<HTMLElement>("[data-about-intro]");
  const words = gsap.utils.toArray<HTMLElement>(root.querySelectorAll("[data-about-word]"));
  const cardsSection = root.querySelector<HTMLElement>("[data-about-cards]");
  const cards = gsap.utils.toArray<HTMLElement>(root.querySelectorAll("[data-about-card]"));
  const closing = root.querySelector<HTMLElement>("[data-about-closing]");
  const reveals = gsap.utils.toArray<HTMLElement>(root.querySelectorAll("[data-about-reveal]"));
  const closingLines = root.querySelector<HTMLElement>("[data-about-lines]");
  const character = root.querySelector<HTMLElement>("[data-about-character]");
  const titles = gsap.utils.toArray<HTMLElement>(root.querySelectorAll("[data-about-type]"));

  const mm = gsap.matchMedia();

  mm.add(DESKTOP, () => {
    if (intro && words.length) {
      gsap.fromTo(
        words,
        { opacity: WORD_DIM },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.1,
          scrollTrigger: {
            trigger: intro,
            start: "top top",
            end: () => `+=${words.length * PIN_PX_PER_WORD}`,
            pin: true,
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );
    }

    if (cardsSection && cards[0]) {
      gsap.fromTo(
        cards[0],
        { autoAlpha: 0, y: 30 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: { trigger: cardsSection, start: "top 60%", once: true },
        },
      );
    }

    if (cardsSection && cards.length > 1) {
      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: {
          trigger: cardsSection,
          start: "top top",
          end: () => `+=${(cards.length - 1) * window.innerHeight}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
      gsap.set(cards, { filter: "brightness(1)", transformOrigin: "50% 100%" });
      cards.slice(1).forEach((card, i) => {
        const step = i + 1;
        tl.fromTo(
          card,
          { x: () => window.innerWidth * 0.6, rotate: 14 },
          { x: 0, rotate: CARD_ROTATION[step] ?? 0, duration: 1 },
          step - 1,
        );
        // Las de atrás bajan un nivel en el mazo: más chicas, corridas a la izquierda y más oscuras
        for (let k = 0; k < step; k++) {
          const depth = step - k;
          tl.to(
            cards[k],
            {
              scale: 1 - CARD_SCALE_STEP * depth,
              x: -CARD_SHIFT_STEP * depth,
              filter: `brightness(${1 - CARD_BRIGHTNESS_STEP * depth})`,
              duration: 1,
              ease: "power2.inOut",
            },
            step - 1,
          );
        }
      });
    }
  });

  mm.add(MOBILE, () => {
    // Sin pin: las palabras se llenan mientras la intro cruza la pantalla
    if (intro && words.length) {
      gsap.fromTo(
        words,
        { opacity: WORD_DIM },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.1,
          scrollTrigger: { trigger: intro, start: "top 75%", end: "bottom 50%", scrub: true },
        },
      );
    }
    // Cards en lista: cada una aparece al entrar
    cards.forEach((card) => {
      gsap.fromTo(
        card,
        { autoAlpha: 0, y: 40 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: { trigger: card, start: "top 85%", once: true },
        },
      );
    });
  });

  mm.add(MOTION, () => {
    // Títulos: escritura carácter por carácter (+ círculo al final, si tienen)
    titles.forEach((title) => {
      const interval = Number(title.dataset.typeInterval) || TYPE_INTERVAL;
      const tl = gsap
        .timeline({ scrollTrigger: { trigger: title, start: "top 85%", once: true } })
        .fromTo(
          title.querySelectorAll("[data-about-char]"),
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: CHAR_FADE, ease: "power1.out", stagger: interval },
        );
      // Los caracteres son inline (no aceptan transform): sube el bloque entero mientras se escribe
      if (title.hasAttribute("data-about-rise")) {
        tl.fromTo(title, { y: 60 }, { y: 0, duration: 1.4, ease: "power3.out" }, 0);
      }
      const circle = title.querySelector("[data-about-circle]");
      if (circle) {
        // Se mide el trazo recién al dibujarlo (immediateRender: false): para entonces la fuente
        // ya cargó y el largo es el real. Hasta ese momento, oculto.
        gsap.set(circle, { autoAlpha: 0 });
        tl.set(circle, { autoAlpha: 1 }, "+=0.1").fromTo(
          circle,
          { drawSVG: "0%" },
          { drawSVG: "100%", duration: 0.9, ease: "power2.inOut", immediateRender: false },
        );
      }
      const underline = title.querySelector("[data-about-underline]");
      if (underline) {
        tl.fromTo(underline, UNDERLINE_HIDDEN, { ...UNDERLINE_SHOWN, duration: 0.8, ease: "power2.inOut" }, "+=0.1");
      }
    });

    // Cierre: línea por línea, escalonado; cada línea dentro de su máscara (no se ve fuera de ella)
    if (closingLines) {
      SplitText.create(closingLines, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 105,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.12,
            scrollTrigger: { trigger: closingLines, start: "top 80%", once: true },
          }),
      });
    }
    if (closing && character) {
      gsap.fromTo(
        character,
        { autoAlpha: 0, y: 40 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          delay: 0.3,
          ease: "power3.out",
          scrollTrigger: { trigger: closing, start: "top 70%", once: true },
        },
      );
    }

    if (closing && reveals.length) {
      gsap.fromTo(
        reveals,
        { autoAlpha: 0, y: 30 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.15,
          scrollTrigger: { trigger: closing, start: "top 70%", once: true },
        },
      );
    }
  });

  // NewBlack puede terminar de cargar después de montar y cambiar alturas: recalcular pins
  let alive = true;
  document.fonts?.ready.then(() => {
    if (alive) ScrollTrigger.refresh();
  });

  return () => {
    alive = false;
    mm.revert();
  };
}
