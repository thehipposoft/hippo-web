import Image from "next/image";
import type { LogofolioTypes } from "@/components/sections/Logofolio/NewLogofolioComp";
import type { LogofolioSingleData } from "@/components/sections/Logofolio/LogofolioSingleComp";

// Fichas del logofolio (/branding-design/[slug]).
// Datos y textos (inglés) traídos de hipposoftsite-2024.

export type LogofolioProject =
  | { slug: string; layout: "full"; data: LogofolioTypes }
  | { slug: string; layout: "single"; data: LogofolioSingleData };

// ── Bloques de paleta ────────────────────────────────────────────
// `bg`: clase de Tailwind escrita completa (bg-[#hex]) para que la genere el build
type SwatchData = { hex: string; bg: string; rgb: [number, number, number]; cmyk: [number, number, number, number] };

/** Rectángulo de color con sus valores RGB / Hex / CMYK */
function Swatch({ hex, bg, rgb, cmyk }: SwatchData) {
  return (
    <div className="flex flex-col gap-4">
      <div className={`h-[5vh] w-[20vw] md:w-[15vw] lg:w-[7vw] ${bg}`} />
      <div className="flex flex-col gap-[2px] text-xs font-light">
        <p>R: {rgb[0]}</p>
        <p>G: {rgb[1]}</p>
        <p>B: {rgb[2]}</p>
        <p>Hex: {hex}</p>
        <p>C: {cmyk[0]}</p>
        <p>M: {cmyk[1]}</p>
        <p>Y: {cmyk[2]}</p>
        <p>K: {cmyk[3]}</p>
      </div>
    </div>
  );
}

function SwatchGroup({ title, swatches }: { title: string; swatches: SwatchData[] }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm">{title}</p>
      <div className="flex gap-0">
        {swatches.map((swatch) => (
          <Swatch key={swatch.hex} {...swatch} />
        ))}
      </div>
    </div>
  );
}

/** Círculo de color (paleta de Rock Steady) */
function Dot({ hex, className, rgb, cmyk }: { hex: string; className: string; rgb: string; cmyk: string }) {
  return (
    <div className="flex flex-col gap-4">
      <div className={`rounded-full ${className}`} />
      <div className="flex flex-col text-xs">
        <p>RGB: {rgb}</p>
        <p>HEX: {hex.slice(1)}</p>
        <p>CMYK: {cmyk}</p>
      </div>
    </div>
  );
}

// ── Proyectos ────────────────────────────────────────────────────
export const LOGOFOLIO: LogofolioProject[] = [
  {
    slug: "rock-steady-digital",
    layout: "full",
    data: {
      logo: "/assets/images/logofolio/rock-steady.png",
      backgroundOne: "/assets/images/logofolio/rs/background.jpg",
      backgroundTwo: "/assets/images/logofolio/rs/rocksteady.webp",
      itemImage: "/assets/images/logofolio/rs/rock-1.webp",
      colorPrimary: "#040D26",
      colorSecondary: ["#380A24", "#860522", "#A60321"],
      backgroundThree: "/assets/images/logofolio/rs/background2.jpg",
      backgroundLegend: "#040D26",
      legend: "We unite people, process, tools and data in a creative way that will help your business grow.",
      backgroundFinal: "/assets/images/logofolio/rs/rock-2.webp",
      name: "Rock Steady Digital",
      country: "australia",
      date: "november 2022",
      href: "https://www.rocksteadydigital.com.au/",
      description: [
        "Rock Steady assists organizations in their digital transformation and implements their requirements.",
        "Its mission is to enhance companies existing digital capabilities through website and social media development, e-commerce implementations and digital transformations.",
        "Rock Steady brings people, processes, tools and data together in a creative way that helps companies achieve success through continuous improvement.",
      ],
      concept: [
        "The logo is bold and playful, a symbol of the company's attitude. It represents its rebellious and innovative character. The accompanying elements (stars) symbolize the digital transformation journey, which aims to connect the past with the future of the companies.",
      ],
      content: (
        <div className="flex flex-col gap-12 pt-12 md:flex-row">
          <div className="flex flex-col gap-6">
            <p className="text-sm">Primary Palette</p>
            <div className="flex gap-12">
              <Dot hex="#040D26" className="size-[90px] bg-[#040D26]" rgb="4/13/38" cmyk="80/73/60/84" />
              <Dot hex="#A60321" className="size-[90px] bg-[#A60321]" rgb="166/3/33" cmyk="20/100/100/22" />
            </div>
          </div>
          <div className="flex flex-col justify-between">
            <p className="text-sm">Tonal gradient</p>
            <div className="flex items-end gap-4">
              <Dot hex="#380A24" className="size-[50px] bg-[#380A24]" rgb="56/10/36" cmyk="65/76/58/81" />
              <Dot hex="#860522" className="size-[50px] bg-[#860522]" rgb="134/5/34" cmyk="27/100/100/41" />
            </div>
          </div>
        </div>
      ),
      logoSizes: ["220px", "120px"],
      gallery: [
        "/assets/images/logofolio/rs/rock-1.webp",
        "/assets/images/logofolio/rs/rock-2.webp",
        "/assets/images/logofolio/rs/rock-3.webp",
        "/assets/images/logofolio/rs/rock-4.webp",
      ],
      vectorColors: ["#000000", "#000000", "#000000", "#70FFE5"],
    },
  },
  {
    slug: "inspir-performance",
    layout: "full",
    data: {
      logo: "/assets/images/logofolio/inspir.png",
      backgroundOne: "/assets/images/logofolio/inspir/background.jpg",
      backgroundTwo: "/assets/images/logofolio/inspir/background2.jpg",
      itemImage: "/assets/images/logofolio/inspir/itemImage.png",
      left: true,
      colorPrimary: "#1E1860",
      colorSecondary: ["#FC823C", "#FC4C28"],
      backgroundThree: "/assets/images/logofolio/inspir/background4.jpg",
      backgroundLegend: "#FFFFFF",
      backgroundLegendImage: "/assets/images/logofolio/inspir/background3.jpg",
      legend: "The mind is not a vessel to be filled, but a fire to be ignited.",
      backgroundFinal: "/assets/images/logofolio/inspir/background5.jpg",
      name: "Inspir Performance",
      country: "Paris - Australia",
      date: "march 2023",
      href: "",
      description: [
        "Inspir is an elite performance expert that helps elite athletes and executives in competitive fields tounleash the power of the mind and create the mental toughness needed to perform at their best.",
        "It provides an innovative and efficient solution for associations, and responds to all requests: help, advice and support to athletes, teams or organizations.",
      ],
      concept: ["“The mind is not a vessel to be filled, but a fire to be ignited.”, Plutarch, ancient Greece."],
      content: (
        <div className="flex flex-col gap-4 pt-4 md:flex-row">
          <div className="relative h-[165px] w-[300px]">
            <Image src="/assets/images/logofolio/inspir/inspir-info.webp" fill alt="Inspir primary colors" />
          </div>
          <div className="relative mt-2 h-[160px] w-[310px]">
            <Image src="/assets/images/logofolio/inspir/inspir-info2.webp" fill alt="Inspir tonal gradient" />
          </div>
        </div>
      ),
      logoSizes: ["200px", "100px"],
      gallery: [
        "/assets/images/logofolio/inspir/inspir-1.webp",
        "/assets/images/logofolio/inspir/inspir-2.webp",
        "/assets/images/logofolio/inspir/inspir-3.webp",
        "/assets/images/logofolio/inspir/inspir-4.webp",
      ],
      vectorColors: ["#70FFE5", "#000000", "#000000", "#70FFE5"],
    },
  },
  {
    slug: "diversity-employment",
    layout: "single",
    data: {
      isOld: true,
      name: "Diversity Employment",
      country: "New Zealand",
      date: "October 2023",
      description: [
        "Diversity Employment helps companies in the Nelson/Tasman region recruit to retain employees in hard-to-fill short-skill occupations.",
        "Recruitment for retention combines the process of carefully selecting an individual to obtain a lasting and satisfying relationship with the employee.",
      ],
      concept: [
        "Rope, conexion, abstract monogram “D E”. The construction of the brand was generated from the circle, one of the most flexible and meaningful geometric shapes.",
        "In this case, both semicircles joined by an inner circle seek to reflect the aim of the company, which is to intermediate between the employer and the immigrant. Its circular shape makes it emotionally more positive and close, other values that conveys are: movement, globality, protection, reliability.",
      ],
      content: (
        <div className="flex flex-col justify-between gap-8 pt-4 md:flex-row md:gap-0">
          {/* TODO: revisar CMYK; en el sitio viejo los tres primarios repetían los valores del primero */}
          <SwatchGroup
            title="Primary Colors"
            swatches={[
              { hex: "#44B2AF", bg: "bg-[#44B2AF]", rgb: [68, 178, 175], cmyk: [72, 7, 36, 0] },
              { hex: "#30528D", bg: "bg-[#30528D]", rgb: [48, 82, 141], cmyk: [72, 7, 36, 0] },
              { hex: "#F15F3F", bg: "bg-[#F15F3F]", rgb: [241, 95, 63], cmyk: [72, 7, 36, 0] },
            ]}
          />
          <SwatchGroup title="Accent" swatches={[{ hex: "#FFCC5F", bg: "bg-[#FFCC5F]", rgb: [255, 204, 95], cmyk: [72, 7, 36, 0] }]} />
        </div>
      ),
      href: "https://diversityemployment.nz/",
      logo: "/assets/images/logofolio/diversity.png",
      logoSizes: ["300px", "80px"],
      gallery: [
        "/assets/images/logofolio/diversity/diversity-1.webp",
        "/assets/images/logofolio/diversity/diversity-3.webp",
        "/assets/images/logofolio/diversity/diversity-4.webp",
        "/assets/images/logofolio/diversity/diversity-2.webp",
      ],
      vectorColors: ["#000000", "#000000", "#70FFE5", "#70FFE5"],
    },
  },
  {
    slug: "lumina-technologies",
    layout: "full",
    data: {
      logo: "/assets/images/logofolio/lumina.png",
      backgroundOne: "/assets/images/logofolio/lumina/background.png",
      backgroundTwo: "/assets/images/logofolio/lumina/background2.jpg",
      itemImage: "/assets/images/logofolio/lumina/lumina-1.png",
      contain: true,
      colorPrimary: "#040D26",
      colorSecondary: ["#35E3ED", "#A044FF", "#151F27", "#FFFFFF"],
      backgroundThree: "/assets/images/logofolio/lumina/lumina-4.png",
      backgroundLegend: "#FFFFFF",
      backgroundLegendImage: "/assets/images/logofolio/lumina/background3.jpg",
      legend: "Reimagine the interface between light and matter",
      backgroundFinal: "/assets/images/logofolio/lumina/background4.jpg",
      name: "Lumina Technologies",
      country: "USA",
      date: "september 2025",
      href: "",
      description: [
        "Lumina Technologies is a cutting-edge start-up specializing in advanced chemistry to drive innovation in the OLED market.",
        "Lumina Technologies drive AR/VR and display technology to enhance customer experience.",
      ],
      concept: [
        "The Lumina Technologies logo is a visual representation of precision, innovation and seamless integration, key attributes of the brand's patented technology.",
        "The mark features layered translucent geometricshapes that subtly evoke the ultra-thin, multi-layeredstructure of displays with this technology. The designstrikes a perfect balance between structure and fluidity.",
      ],
      content: (
        <div className="flex flex-col justify-between gap-8 pt-6 md:flex-row md:gap-0">
          <div className="flex flex-col gap-2">
            <p className="text-sm">Color Palette</p>
            <Image src="/assets/images/logofolio/lumina/paleta_lumina.png" className="w-[475px]" alt="" width={1198} height={430} />
          </div>
        </div>
      ),
      logoSizes: ["240px", "100px"],
      gallery: [
        "/assets/images/logofolio/lumina/lumina-1.png",
        "/assets/images/logofolio/lumina/lumina-2.png",
        "/assets/images/logofolio/lumina/lumina-3.png",
        "/assets/images/logofolio/lumina/lumina-4.png",
      ],
      vectorColors: ["#000000", "#000000", "#000000", "#000000"],
    },
  },
  {
    slug: "destino-salta",
    layout: "full",
    data: {
      logo: "/assets/images/logofolio/destino.png",
      backgroundOne: "/assets/images/logofolio/destino/background.jpg",
      backgroundTwo: "/assets/images/logofolio/destino/background3.jpg",
      itemImage: "/assets/images/logofolio/destino/itemImage.jpg",
      colorPrimary: "#8F122B",
      colorSecondary: ["#BE6312", "#4B4136", "#EFECDD"],
      backgroundThree: "/assets/images/logofolio/destino/background2.jpg",
      backgroundLegend: "#C9B8AD",
      legend: "Tu próximo destino, tu lugar para disfrutar Salta.",
      backgroundFinal: "/assets/images/logofolio/destino/background4.jpg",
      name: "Destino Salta",
      country: "argentina",
      date: "october 2023",
      href: "https://www.destinosalta.com.ar/",
      description: [
        "Destino Salta is a temporary rental project that seeks to offer a unique lodging experience in the city of Salta, the Northwest of Argentina, in a simple and reliable way.",
      ],
      concept: [
        "Destino Salta is a brand that honors the cultural and scenic richness of the province of Salta. The logo seeks to capture its essence, its earthy colors evoke the regional chromatic palette, highlighting the burgundy tone of the Salta poncho as the primary color.",
        "Recognized elements of the local flora and fauna were chosen for the design to convey the concept of the province's vast biodiversity. Salta's landscape is one of its most famous attributes and that is why thousands of tourists visit it every year.",
      ],
      content: (
        <div className="flex flex-col-reverse justify-between gap-8 pt-6 md:flex-row-reverse md:gap-0">
          <SwatchGroup
            title="Secondary Colors"
            swatches={[
              { hex: "#BE6312", bg: "bg-[#BE6312]", rgb: [190, 99, 18], cmyk: [20, 71, 100, 9] },
              { hex: "#EF973B", bg: "bg-[#EF973B]", rgb: [239, 151, 59], cmyk: [3, 49, 97, 0] },
              { hex: "#4B4136", bg: "bg-[#4B4136]", rgb: [75, 65, 54], cmyk: [56, 63, 79, 62] },
            ]}
          />
          {/* TODO: revisar CMYK; en el sitio viejo repetía los valores de otro color */}
          <SwatchGroup title="Primary Colors" swatches={[{ hex: "#8F122B", bg: "bg-[#8F122B]", rgb: [143, 18, 43], cmyk: [72, 7, 36, 0] }]} />
        </div>
      ),
      logoSizes: ["180px", "180px"],
      gallery: [
        "/assets/images/logofolio/destino/destino-1.webp",
        "/assets/images/logofolio/destino/destino-2.webp",
        "/assets/images/logofolio/destino/destino-3.webp",
        "/assets/images/logofolio/destino/destino-4.webp",
      ],
      vectorColors: ["#70FFE5", "#70FFE5", "#000000", "#000000"],
    },
  },
  {
    // TODO: en el sitio viejo, Perri reutilizaba textos e imágenes de Lumina (leyenda, fondos 3 y final,
    // galería, descripción y concepto). Reemplazar por el contenido real de Perri.
    slug: "perri",
    layout: "full",
    data: {
      logo: "/assets/images/logofolio/perri-logo.webp",
      backgroundOne: "/assets/images/logofolio/perri/perri-1.webp",
      secondSectionCustom: true,
      backgroundTwo: "/assets/images/logofolio/perri/perri-2.webp",
      itemImage: "/assets/images/logofolio/perri/perri-3.webp",
      contain: true,
      colorPrimary: "#0043AC",
      colorSecondary: ["#F78A1D", "#00AFC8", "#00B97D"],
      backgroundThree: "/assets/images/logofolio/lumina/lumina-4.png",
      backgroundLegend: "#FFFFFF",
      backgroundLegendImage: "/assets/images/logofolio/lumina/background3.jpg",
      legend: "Reimagine the interface between light and matter",
      backgroundFinal: "/assets/images/logofolio/lumina/background4.jpg",
      name: "PERRI",
      country: "ARG",
      date: "september 2025",
      href: "",
      description: [
        "Lumina Technologies is a cutting-edge start-up specializing in advanced chemistry to drive innovation in the OLED market.",
        "Lumina Technologies drive AR/VR and display technology to enhance customer experience.",
      ],
      concept: [
        "The Lumina Technologies logo is a visual representation of precision, innovation and seamless integration, key attributes of the brand's patented technology.",
        "The mark features layered translucent geometricshapes that subtly evoke the ultra-thin, multi-layeredstructure of displays with this technology. The designstrikes a perfect balance between structure and fluidity.",
      ],
      content: (
        <div className="flex flex-col justify-between gap-8 pt-6 md:flex-row md:gap-0">
          <div className="flex flex-col gap-2">
            <p className="text-sm">Color Palette</p>
            <Image src="/assets/images/logofolio/lumina/paleta_lumina.png" className="w-[475px]" alt="" width={1198} height={430} />
          </div>
        </div>
      ),
      logoSizes: ["240px", "100px"],
      gallery: [
        "/assets/images/logofolio/lumina/lumina-1.png",
        "/assets/images/logofolio/lumina/lumina-2.png",
        "/assets/images/logofolio/lumina/lumina-3.png",
        "/assets/images/logofolio/lumina/lumina-4.png",
      ],
      vectorColors: ["#000000", "#000000", "#000000", "#000000"],
    },
  },
];

export function getLogofolioProject(slug: string): LogofolioProject | undefined {
  return LOGOFOLIO.find((project) => project.slug === slug);
}
