import { notFound } from "next/navigation";

// Rutas desconocidas de más de un segmento dentro de [locale] → not-found traducido
export default function CatchAllPage() {
  notFound();
}
