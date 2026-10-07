import { EB_Garamond, Inter } from "next/font/google";
import localFont from "next/font/local";

// H1 / identidad, personalidad y memorabilidad
export const newBlack = localFont({
  src: [
    { path: "../public/assets/fonts/NewBlackTypeface-UltraLight.woff2", weight: "200", style: "normal" },
    { path: "../public/assets/fonts/NewBlackTypeface-Light.woff2", weight: "300", style: "normal" },
    { path: "../public/assets/fonts/NewBlackTypeface-Regular.woff2", weight: "400", style: "normal" },
    { path: "../public/assets/fonts/NewBlackTypeface-Medium.woff2", weight: "500", style: "normal" },
    { path: "../public/assets/fonts/NewBlackTypeface-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "../public/assets/fonts/NewBlackTypeface-Bold.woff2", weight: "700", style: "normal" },
    { path: "../public/assets/fonts/NewBlackTypeface-ExtraBold.woff2", weight: "800", style: "normal" },
  ],
  display: "swap",
  variable: "--font-newblack",
});

// Body / UI / Presentaciones
export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// Editorial accents: manifiestos, citas, mensajes inspiracionales
export const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-eb-garamond",
});

// Clases a aplicar en <html> para exponer las variables de fuente
export const fontVariables = `${newBlack.variable} ${inter.variable} ${ebGaramond.variable}`;
