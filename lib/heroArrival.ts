// Aviso entre la transición recuadro → sección y la página de destino:
// la transición ya mostró la pantalla de llegada (líneas de <SectionHero />, contenido de Contact),
// así que la página no repite su animación de entrada.
let pending = false;

export function markHeroArrival() {
  pending = true;
}

/** true si se llegó desde la transición. Se limpia en el próximo tick (tolera el doble montaje de StrictMode). */
export function takeHeroArrival(): boolean {
  if (!pending) return false;
  setTimeout(() => {
    pending = false;
  }, 0);
  return true;
}
