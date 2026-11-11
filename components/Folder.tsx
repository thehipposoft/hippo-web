"use client";

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { createFolderTabs, showFolderPanel } from "@/animations/folder";
import { useGsap } from "@/lib/useGsap";

export type FolderTab = {
  id: string;
  label: string;
  /** Colores de la pestaña (fondo y texto), p. ej. "bg-brand-darkblue text-white" */
  className: string;
  /** Colores cuando está activa (si no se indica, usa `className`) */
  activeClassName?: string;
  content: ReactNode;
};

// Tamaños de pestaña
const TAB_SIZES = {
  md: "px-[clamp(1rem,2.2vw,2.25rem)] text-[clamp(0.85rem,1vw,1.05rem)]",
  // Mobile: las pestañas se reparten el ancho según su texto (una palabra larga no se corta)
  lg: "min-w-0 flex-auto px-2.5 text-center text-[0.85rem] leading-tight md:text-left md:min-w-[clamp(8rem,12.5vw,14rem)] md:flex-none md:px-[clamp(1rem,2vw,2.25rem)] md:text-[clamp(0.9rem,1.05vw,1.15rem)] md:leading-normal",
} as const;

// Borde y sombra de la hoja por defecto (para fondos claros)
const DEFAULT_FRAME = "border border-black/80 shadow-[2px_3px_0_0_rgba(0,0,0,0.85)]";

type FolderProps = {
  tabs: FolderTab[];
  className?: string;
  /** Clases extra para la hoja del folder (padding, alto mínimo…) */
  panelClassName?: string;
  /** Borde y sombra de la hoja (reemplaza los de por defecto, p. ej. sobre fondo oscuro) */
  frameClassName?: string;
  /** Tamaño de las pestañas */
  size?: keyof typeof TAB_SIZES;
  /** Pestaña activa controlada desde afuera (p. ej. un formulario que vuelve a la pestaña con un error) */
  active?: number;
  onActiveChange?: (index: number) => void;
};

/**
 * Contenedor con forma de carpeta y pestañas. Las pestañas tienen hover y click animados
 * (animations/folder.ts) y el contenido entra con un fade al cambiar.
 * Todas las hojas quedan montadas (las ocultas con `hidden`), así un formulario conserva lo cargado.
 */
export default function Folder({
  tabs,
  className = "",
  panelClassName = "",
  frameClassName = DEFAULT_FRAME,
  size = "md",
  active: controlledActive,
  onActiveChange,
}: FolderProps) {
  const id = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [ownActive, setOwnActive] = useState(0);
  const active = controlledActive ?? ownActive;
  const setActive = (index: number) => {
    setOwnActive(index);
    onActiveChange?.(index);
  };
  const hasMounted = useRef(false);

  useGsap((root) => createFolderTabs(root), rootRef);

  // Fade de la hoja elegida (no en la primera carga)
  useGsap(
    (root) => {
      if (!hasMounted.current) {
        hasMounted.current = true;
        return;
      }
      const panel = root.querySelector<HTMLElement>(`[data-folder-panel="${active}"]`);
      if (!panel) return;
      const tween = showFolderPanel(panel);
      return () => tween.kill();
    },
    rootRef,
    [active],
  );

  // Flechas izquierda/derecha para moverse entre pestañas
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const next = (active + step + tabs.length) % tabs.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <div ref={rootRef} className={className}>
      <div role="tablist" className="flex items-end gap-1">
        {tabs.map((tab, i) => {
          const selected = i === active;
          return (
            <button
              key={tab.id}
              ref={(element) => {
                tabRefs.current[i] = element;
              }}
              type="button"
              role="tab"
              id={`${id}-tab-${tab.id}`}
              aria-selected={selected}
              aria-controls={`${id}-panel-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={onKeyDown}
              data-folder-tab
              className={`cursor-pointer rounded-t-md font-display transition-[opacity,padding] duration-300 ${TAB_SIZES[size]} ${
                selected ? "pb-2 pt-2.5 font-bold opacity-100" : "pb-1.5 pt-2 opacity-70 hover:opacity-100"
              } ${selected ? (tab.activeClassName ?? tab.className) : tab.className}`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div
        className={`relative rounded-md bg-white ${frameClassName} ${panelClassName}`}
      >
        {tabs.map((tab, i) => (
          <div
            key={tab.id}
            role="tabpanel"
            id={`${id}-panel-${tab.id}`}
            aria-labelledby={`${id}-tab-${tab.id}`}
            hidden={i !== active}
            data-folder-panel={i}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
}
