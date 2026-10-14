import LogofolioLayout from "./LogofolioLayout";

// Líneas de fondo, alineadas con las de <SectionHero /> (left-14 y 94.5%)
const LINES = ["left-14", "left-[94.5%]"] as const;

/** Branding & Design · logofolio: logos de marcas que diseñamos. */
export default function LogofolioComp() {
  return (
    <section className="relative flex h-svh w-full items-center overflow-hidden bg-white">
      {LINES.map((className) => (
        <span key={className} aria-hidden className={`absolute inset-y-0 w-px bg-brand-blue/50 ${className}`} />
      ))}

      <h2 className="sr-only">Logofolio</h2>
      <div className="absolute inset-y-0 left-14 right-[5.5%] flex items-center justify-center">
        <div className="w-[min(60vw,72rem)]">
          <LogofolioLayout />
        </div>
      </div>
    </section>
  );
}
