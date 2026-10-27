import type Lenis from "lenis";

// Instancia de Lenis del sitio (la crea <SmoothScroll />). Para que otros componentes puedan
// pausar el scroll (menú abierto) o desplazarse de forma suave sin acoplarse al provider.
let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
}

/** null si todavía no montó o si el usuario prefiere movimiento reducido (scroll nativo) */
export function getLenis(): Lenis | null {
  return instance;
}
