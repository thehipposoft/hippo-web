import type { ReactNode } from "react";

// Contenido del brochure (lib/brochure_27.pdf, págs. 3–8) para /brochure.
// Fuera de acá, a propósito: la portada (pág. 1, ya está en el inicio) y "Tecnología con propósito"
// (pág. 2, la cubre <AboutStatement />). Copy tomado de las páginas renderizadas, con voseo.

export type ServiceColor = {
  /** Fondo del color del servicio */
  bg: string;
  /** Texto oscuro que acompaña al color (títulos sobre el fondo, número) */
  ink: string;
};

export type BrochureService = {
  id: string;
  title: string;
  color: ServiceColor;
  /** Resumen para las cards de "Nuestros servicios" (el segundo va destacado) */
  summary: [string, string];
  /** Frase de entrada (en negrita) */
  lead: string[];
  paragraphs: ReactNode[];
  /** Cierre en negrita */
  closing?: string;
  /** Pasos (Consultoría) */
  steps?: { title: string; text: string }[];
  /** Resultado después de los pasos */
  result?: ReactNode;
  /** "Podemos ayudarte con:" */
  capabilities?: string[];
  /** Estilo de viñeta de la lista: cuadrados de colores alternados o guiones de un color */
  bullets?: { type: "squares"; colors: string[] } | { type: "dashes"; color: string };
  tags?: { label: string; className: string }[];
};

export const BROCHURE_INTRO = {
  title: "Diferentes habilidades,",
  titleLine2: "mismos objetivos.",
  columns: [
    [
      "Ayudamos a las empresas a avanzar con claridad y confianza.",
      "Toda experiencia digital exitosa comienza por comprender. Nos tomamos el tiempo necesario para conocer tu negocio, tu público, tu mercado y las oportunidades que se avecinan.",
    ],
    [
      "Al combinar estrategia, diseño y tecnología, creamos soluciones que no sólo se ven bien, sino que generan un valor cuantificable y favorecen el crecimiento a largo plazo.",
      "Nuestro papel es sencillo: ayudarte a tomar mejores decisiones digitales y convertir ideas ambiciosas en resultados significativos.",
    ],
  ],
  servicesLabel: "Nuestros servicios",
};

export const BROCHURE_SERVICES: BrochureService[] = [
  {
    id: "consultoria",
    title: "Consultoría",
    color: { bg: "bg-brand-blue", ink: "text-brand-darkblue" },
    summary: [
      "Entendemos el problema antes de construir.",
      "Encontramos oportunidades y definimos el mejor camino para avanzar.",
    ],
    lead: ["Antes de construir, entendemos."],
    paragraphs: [
      "Nos metemos en tu negocio para entender cómo funciona, qué necesita y dónde están las oportunidades.",
      "Analizamos tu ecosistema digital, tus procesos y las herramientas que ya utilizás para detectar qué puede mejorarse, simplificarse o conectarse.",
    ],
    steps: [
      { title: "Primer acercamiento / Reunión inicial", text: "Conocemos tu negocio, hacemos preguntas y entendemos el desafío." },
      { title: "Definición de objetivos", text: "Ponemos foco en lo que realmente necesita resolverse." },
      { title: "Diseño de soluciones", text: "Exploramos alternativas y definimos el camino más adecuado." },
      { title: "Implementación", text: "Convertimos la estrategia en soluciones concretas." },
      { title: "Monitoreo y mejoras", text: "Medimos, aprendemos y ajustamos lo que haga falta." },
    ],
    result: (
      <>
        El resultado es una <strong>hoja de ruta clara</strong> para tomar mejores decisiones, aprovechar mejor tus
        recursos y construir sobre una base sólida.
      </>
    ),
  },
  {
    id: "branding",
    title: "Branding & Diseño",
    color: { bg: "bg-brand-pink", ink: "text-brand-darkpink" },
    summary: [
      "Creamos marcas que se reconocen, conectan y perduran.",
      "Diseño con propósito, desde la idea hasta cada punto de contacto.",
    ],
    lead: ["No hacemos marcas para que se vean bien.", "Las hacemos para que tengan sentido."],
    paragraphs: [
      "Construimos identidades que expresan quién sos, ayudan a diferenciarte y hacen que tu marca sea fácil de reconocer y recordar.",
      "Combinamos estrategia y diseño para crear sistemas visuales coherentes que funcionan en todos los puntos de contacto: desde una identidad y sus guidelines hasta piezas de comunicación, packaging, espacios y experiencias digitales.",
    ],
    closing:
      "Porque una marca es mucho más que un logo. Es la forma en que las personas te reconocen, te recuerdan y confían en vos.",
    capabilities: [
      "Estrategia e identidad de marca",
      "Rebranding",
      "Manuales de marca",
      "Sistemas visuales",
      "Papelería y comunicación",
      "Brochures y materiales comerciales",
      "Packaging",
      "Señalética",
      "Contenido y piezas digitales",
      "Edición de video de baja complejidad",
    ],
    bullets: {
      type: "squares",
      colors: [
        "bg-brand-darkgreen",
        "bg-brand-green",
        "bg-brand-darkorange",
        "bg-brand-orange",
        "bg-brand-darkpink",
        "bg-brand-pink",
        "bg-brand-darkblue",
        "bg-brand-blue",
      ],
    },
  },
  {
    id: "desarrollo-web",
    title: "Desarrollo Web",
    color: { bg: "bg-brand-orange", ink: "text-brand-darkorange" },
    summary: [
      "Diseñamos y desarrollamos experiencias que se ven bien y funcionan mejor.",
      "Hechas para crecer con tu negocio.",
    ],
    lead: ["Diseñado para verse bien. Construido para funcionar mejor."],
    paragraphs: [
      "Diseñamos y desarrollamos sitios web y productos digitales que combinan una buena experiencia de usuario, rendimiento y tecnología.",
      "Desde una landing page hasta plataformas digitales complejas, cada proyecto se adapta a las necesidades reales de tu negocio.",
      "Trabajamos desde el diseño y el prototipo hasta el desarrollo, implementación y mantenimiento.",
    ],
    closing:
      "Porque una buena experiencia digital no termina cuando el sitio se publica. Tiene que seguir funcionando, evolucionando y creciendo con vos.",
    capabilities: [
      "Diseño UX/UI + Prototipado",
      "Desarrollo web responsive",
      "Landing pages",
      "Sitios institucionales",
      "Plataformas digitales",
      "Hosting y dominios",
      "Mantenimiento",
      "Integraciones",
      "Optimización y mejoras",
    ],
    bullets: { type: "dashes", color: "bg-brand-green" },
    tags: [
      { label: "Integrados", className: "bg-brand-green text-brand-darkgreen" },
      { label: "Responsive", className: "bg-brand-darkpink text-white" },
      { label: "Seguros", className: "bg-brand-orange text-brand-darkorange" },
    ],
  },
  {
    id: "automatizacion",
    title: "Automatización",
    color: { bg: "bg-brand-green", ink: "text-brand-darkgreen" },
    summary: [
      "Conectamos lo que hoy está separado y automatizamos lo repetitivo.",
      "Menos tareas manuales. Más tiempo para lo que importa.",
    ],
    lead: ["Dejá que lo repetitivo se haga solo."],
    paragraphs: [
      "Muchas empresas trabajan con sistemas que no se hablan entre sí, tareas que se repiten todos los días y procesos que dependen demasiado de las personas.",
      "Diseñamos flujos inteligentes que conectan herramientas, automatizan tareas y hacen que la información llegue donde tiene que llegar.",
      "Desde asistentes y agentes de IA hasta integraciones con WhatsApp, CRM, bases de datos y sistemas internos.",
    ],
    closing: "Menos trabajo manual. Más tiempo para lo que importa.",
    capabilities: [
      "Chatbots y asistentes inteligentes",
      "Agentes de IA",
      "Automatización de procesos",
      "Integraciones con WhatsApp",
      "Integraciones con CRM y bases de datos",
      "Sincronización de información",
      "Notificaciones automáticas",
      "Generación de reportes",
      "Flujos de trabajo personalizados",
    ],
    bullets: { type: "dashes", color: "bg-brand-darkpink" },
    tags: [
      { label: "Chatbots", className: "bg-brand-green text-brand-darkgreen" },
      { label: "Agentes", className: "bg-brand-darkpink text-white" },
      { label: "Integraciones", className: "bg-brand-orange text-brand-darkorange" },
    ],
  },
];

export const BROCHURE_CTA = {
  title: "¿Hablamos?",
  link: "Contanos tu proyecto",
};
