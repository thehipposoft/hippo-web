"use client";

import { useLayoutEffect, type DependencyList, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type GsapSetup = (root: HTMLElement) => void | (() => void);

/**
 * Corre `setup` dentro de un `gsap.context()` acotado a `scope`.
 * Todo lo creado ahí (tweens, timelines, ScrollTriggers) se revierte al desmontar.
 */
export function useGsap(
  setup: GsapSetup,
  scope: RefObject<HTMLElement | null>,
  deps: DependencyList = [],
) {
  useLayoutEffect(() => {
    const root = scope.current;
    if (!root) return;

    const ctx = gsap.context(() => setup(root), root);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
