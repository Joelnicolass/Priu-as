"use client";

import { motion, type MotionValue } from "framer-motion";
import { useId } from "react";
import type { Finish, NailShape } from "@/lib/data";

// Todas las formas comparten la misma estructura de comandos para poder
// interpolar el path (morph) entre ellas.
const GEOM: Record<NailShape, [number, number, number, number, number, number]> = {
  oval: [62, 14, 30, 30, 17, 17],
  square: [32, 14, 19, 20, 18, 18],
  almond: [74, 14, 42, 38, 9, 8],
  coffin: [58, 31, 15, 33, 12, 12],
  stiletto: [84, 16, 52, 46, 8, 0],
};

export function nailPath(shape: NailShape) {
  const [y1, c1x, c1y, c2x, c2y, ty] = GEOM[shape];
  return `M14 140 L14 ${y1} C${c1x} ${c1y} ${c2x} ${c2y} 50 ${ty} C${100 - c2x} ${c2y} ${100 - c1x} ${c1y} 86 ${y1} L86 140 C86 160 14 160 14 140 Z`;
}

export function frenchLine(shape: NailShape) {
  const y = GEOM[shape][5] + 30;
  return `M-10 -10 H110 V${y} C72 ${y + 16} 28 ${y + 16} -10 ${y} Z`;
}

type Props = {
  shape: NailShape;
  color: string;
  color2?: string;
  finish?: Finish;
  className?: string;
  shimmer?: boolean;
  d?: MotionValue<string>;
  fill?: MotionValue<string>;
};

export default function Nail({ shape, color, color2, finish = "gloss", className, shimmer = true, d, fill }: Props) {
  const uid = useId().replace(/:/g, "");
  const path = nailPath(shape);
  const c2 = color2 ?? color;

  const body = (() => {
    switch (finish) {
      case "chrome":
        return (
          <linearGradient id={`g${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset=".25" stopColor={color} />
            <stop offset=".45" stopColor="#fffaf5" />
            <stop offset=".7" stopColor={c2} />
            <stop offset="1" stopColor={color} />
          </linearGradient>
        );
      case "aura":
        return (
          <radialGradient id={`g${uid}`} cx=".5" cy=".62" r=".7">
            <stop offset="0" stopColor={c2} />
            <stop offset=".35" stopColor={c2} />
            <stop offset="1" stopColor={color} />
          </radialGradient>
        );
      case "cateye":
        return (
          <linearGradient id={`g${uid}`} x1="0" y1="0" x2="1" y2=".6">
            <stop offset="0" stopColor={c2} />
            <stop offset=".38" stopColor={c2} />
            <stop offset=".52" stopColor={color} />
            <stop offset=".56" stopColor="#ffffff" stopOpacity=".9" />
            <stop offset=".64" stopColor={color} />
            <stop offset="1" stopColor={c2} />
          </linearGradient>
        );
      case "milky":
        return (
          <linearGradient id={`g${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fffdfb" />
            <stop offset="1" stopColor={color} />
          </linearGradient>
        );
      case "french":
        return (
          <linearGradient id={`g${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#F6E3DE" />
            <stop offset="1" stopColor="#F1D2CC" />
          </linearGradient>
        );
      default:
        return (
          <linearGradient id={`g${uid}`} x1="0" y1="0" x2=".4" y2="1">
            <stop offset="0" stopColor={c2} />
            <stop offset=".55" stopColor={color} />
            <stop offset="1" stopColor={color} />
          </linearGradient>
        );
    }
  })();

  return (
    <svg viewBox="0 -6 100 170" className={className} aria-hidden>
      <defs>
        {body}
        <clipPath id={`c${uid}`}>{d ? <motion.path d={d} /> : <path d={path} />}</clipPath>
        <linearGradient id={`s${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset=".5" stopColor="#fff" stopOpacity=".75" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      {fill ? (
        <motion.path d={d ?? path} style={{ fill }} />
      ) : d ? (
        <motion.path d={d} fill={`url(#g${uid})`} />
      ) : (
        <path d={path} fill={`url(#g${uid})`} />
      )}
      <g clipPath={`url(#c${uid})`}>
        {finish === "french" && <path d={frenchLine(shape)} fill={c2 === color ? "#ffffff" : c2} />}
        {finish === "milky" && <rect x="0" y="-10" width="100" height="180" fill="#ffffff" opacity=".35" />}
        {/* reflejo principal: volumen y "dibujo sólido" */}
        <path d="M26 46 C24 80 25 110 30 132" stroke="#fff" strokeOpacity=".7" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="30" cy="34" r="3.2" fill="#fff" opacity=".8" />
        <path d="M14 136 C30 152 70 152 86 136" stroke="#000" strokeOpacity=".08" strokeWidth="8" fill="none" />
        {shimmer && (
          <motion.rect
            y="-10"
            width="46"
            height="190"
            fill={`url(#s${uid})`}
            initial={{ x: -80 }}
            animate={{ x: 150 }}
            transition={{ duration: 1.6, ease: [0.65, 0, 0.35, 1], repeat: Infinity, repeatDelay: 3.4 + (uid.length % 3) }}
            style={{ rotate: 18 }}
          />
        )}
      </g>
    </svg>
  );
}

export function Bottle({ color, cap = "#1C1416", className, label }: { color: string; cap?: string; className?: string; label?: string }) {
  const uid = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 120 220" className={className} aria-hidden>
      <defs>
        <linearGradient id={`b${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={color} />
          <stop offset=".35" stopColor={color} stopOpacity=".85" />
          <stop offset=".6" stopColor={color} />
          <stop offset="1" stopColor="#000" stopOpacity=".25" />
        </linearGradient>
        <linearGradient id={`k${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={cap} />
          <stop offset=".3" stopColor="#fff" stopOpacity=".55" />
          <stop offset=".45" stopColor={cap} />
          <stop offset="1" stopColor={cap} />
        </linearGradient>
      </defs>
      <rect x="40" y="6" width="40" height="86" rx="7" fill={cap} />
      <rect x="40" y="6" width="40" height="86" rx="7" fill={`url(#k${uid})`} opacity=".6" />
      <rect x="46" y="88" width="28" height="18" rx="3" fill="#EEE4DA" />
      <rect x="14" y="102" width="92" height="112" rx="26" fill="rgba(255,255,255,.55)" />
      <rect x="20" y="110" width="80" height="98" rx="21" fill={`url(#b${uid})`} />
      <path d="M30 122 C27 150 28 175 34 196" stroke="#fff" strokeOpacity=".75" strokeWidth="7" strokeLinecap="round" fill="none" />
      {label && (
        <text x="60" y="166" textAnchor="middle" fontFamily="var(--font-serif)" fontStyle="italic" fontSize="17" fill="#fff" opacity=".95">
          {label}
        </text>
      )}
    </svg>
  );
}
