import type { Metadata } from "next";
import SmoothScroll from "@/components/SmoothScroll";
import { fontVariables } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hippo",
  description: "",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${fontVariables} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
