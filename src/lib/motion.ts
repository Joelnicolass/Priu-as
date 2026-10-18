import type { Transition } from "framer-motion";

// Slow in / slow out: curvas editoriales, nunca lineales.
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;
export const EASE_IN_OUT = [0.83, 0, 0.17, 1] as const;
// Anticipación: retrocede apenas antes de salir disparada.
export const EASE_ANTICIPATE = [0.36, -0.4, 0.3, 1] as const;

// Follow through: resortes con un leve rebote final.
export const springSoft: Transition = { type: "spring", stiffness: 140, damping: 18, mass: 0.9 };
export const springSnappy: Transition = { type: "spring", stiffness: 420, damping: 26 };
export const springBouncy: Transition = { type: "spring", stiffness: 260, damping: 11, mass: 0.8 };

export const haptic = (ms: number | number[] = 8) => {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(ms);
    } catch {}
  }
};
