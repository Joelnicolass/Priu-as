"use client";

import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import { useApp } from "./Providers";
import Nail, { Bottle } from "./Nail";
import Magnetic from "./Magnetic";
import { EASE_OUT, haptic } from "@/lib/motion";
import type { Finish, NailShape } from "@/lib/data";

const FAN: { shape: NailShape; color: string; color2: string; finish: Finish; angle: number; size: number; float: number }[] = [
  { shape: "almond", color: "#F2B8C2", color2: "#FFE6EA", finish: "milky", angle: -38, size: 0.78, float: 0 },
  { shape: "coffin", color: "#B9A4EC", color2: "#F4EFFF", finish: "chrome", angle: -18, size: 0.92, float: 0.6 },
  { shape: "almond", color: "#D7264F", color2: "#FF7A66", finish: "gloss", angle: 0, size: 1.05, float: 1.2 },
  { shape: "square", color: "#E7C15A", color2: "#FFF4CF", finish: "aura", angle: 18, size: 0.92, float: 0.3 },
  { shape: "stiletto", color: "#4FB58C", color2: "#1D4F45", finish: "cateye", angle: 38, size: 0.78, float: 0.9 },
];

function Letters({ text, delay, ready, className }: { text: string; delay: number; ready: boolean; className?: string }) {
  return (
    <span className={className} aria-label={text}>
      {text.split("").map((ch, i) => (
        <span className="mask" key={i} aria-hidden>
          <motion.span
            className="mask-inner"
            initial={{ y: "110%", rotate: 8 }}
            animate={ready ? { y: "0%", rotate: 0 } : undefined}
            transition={{ type: "spring", stiffness: 170, damping: 16, delay: delay + i * 0.045 }}
          >
            {ch}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export default function Hero() {
  const { ready, openBooking, scrollTo } = useApp();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const titleY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const stageScale = useTransform(scrollYProgress, [0, 1], [1, 1.35]);
  const stageY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  // Paralaje con el puntero / giroscopio
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 60, damping: 15 });
  const sy = useSpring(py, { stiffness: 60, damping: 15 });
  const rotY = useTransform(sx, [-1, 1], [-10, 10]);
  const rotX = useTransform(sy, [-1, 1], [8, -8]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      px.set((e.clientX / window.innerWidth) * 2 - 1);
      py.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    const onTilt = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      px.set(Math.max(-1, Math.min(1, e.gamma / 30)));
      py.set(Math.max(-1, Math.min(1, (e.beta - 45) / 30)));
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("deviceorientation", onTilt);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("deviceorientation", onTilt);
    };
  }, [px, py]);

  return (
    <section className="hero" id="inicio" ref={ref}>
      <div className="blobs" aria-hidden>
        <span className="blob b1" />
        <span className="blob b2" />
        <span className="blob b3" />
      </div>

      <motion.div className="hero-top" initial={{ opacity: 0 }} animate={ready ? { opacity: 1 } : undefined} transition={{ duration: 1, delay: 0.1 }}>
        <span>Nº 01</span>
        <span className="rule" />
        <span>Edición Otoño · Invierno</span>
      </motion.div>

      <motion.h1 className="masthead" style={{ y: titleY }}>
        <Letters text="PRISCILA" delay={0.05} ready={ready} className="masthead-a" />
        <span className="masthead-b">
          <Letters text="Kaiter" delay={0.45} ready={ready} />
          <motion.svg viewBox="0 0 300 30" className="swash" aria-hidden>
            <motion.path
              d="M4 20 C 70 4, 150 4, 296 14"
              fill="none"
              stroke="var(--cherry)"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={ready ? { pathLength: 1 } : undefined}
              transition={{ duration: 1.2, delay: 1, ease: EASE_OUT }}
            />
          </motion.svg>
        </span>
      </motion.h1>

      <motion.div className="stage" style={{ scale: stageScale, y: stageY, opacity: fade }}>
        <motion.div className="stage-3d" style={{ rotateX: rotX, rotateY: rotY }}>
          {FAN.map((n, i) => (
            // El pivote muy por debajo hace que cada uña viaje en arco.
            <motion.div
              key={i}
              className="fan-arm"
              initial={{ rotate: 0, opacity: 0 }}
              animate={ready ? { rotate: n.angle, opacity: 1 } : undefined}
              transition={{ type: "spring", stiffness: 70, damping: 11, delay: 0.55 + Math.abs(i - 2) * 0.12 }}
            >
              <motion.div
                className="fan-nail"
                style={{ width: `${n.size * 100}%` }}
                animate={{ y: [0, -9, 0] }}
                transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut", delay: n.float }}
              >
                <Nail shape={n.shape} color={n.color} color2={n.color2} finish={n.finish} />
              </motion.div>
            </motion.div>
          ))}
          <motion.div
            className="bottle bottle-l"
            initial={{ y: -420, rotate: -24 }}
            animate={ready ? { y: [-420, 0, 0, 0], rotate: [-24, -8, -8, -8], scaleY: [1.15, 1.15, 0.82, 1], scaleX: [0.9, 0.9, 1.14, 1] } : undefined}
            transition={{ duration: 1.1, delay: 1.05, times: [0, 0.55, 0.7, 1] }}
            style={{ originY: 1 }}
          >
            <Bottle color="#F2B8C2" cap="#E9D7C5" label="rosé" />
          </motion.div>
          <motion.div
            className="bottle bottle-r"
            initial={{ y: -420, rotate: 24 }}
            animate={ready ? { y: [-420, 0, 0, 0], rotate: [24, 10, 10, 10], scaleY: [1.15, 1.15, 0.82, 1], scaleX: [0.9, 0.9, 1.14, 1] } : undefined}
            transition={{ duration: 1.1, delay: 1.25, times: [0, 0.55, 0.7, 1] }}
            style={{ originY: 1 }}
          >
            <Bottle color="#D7264F" cap="#1C1416" label="cerise" />
          </motion.div>
        </motion.div>
        <div className="stage-shadow" />
      </motion.div>

      <motion.div
        className="coverlines"
        initial="hidden"
        animate={ready ? "show" : "hidden"}
        variants={{ show: { transition: { staggerChildren: 0.09, delayChildren: 1.1 } } }}
      >
        {[
          ["La temporada", "del brillo lechoso"],
          ["El ritual", "de cuidado en 5 minutos"],
          ["Exclusivo", "reservá tu turno en segundos"],
        ].map(([a, b]) => (
          <motion.p
            key={a}
            variants={{ hidden: { opacity: 0, x: -24 }, show: { opacity: 1, x: 0, transition: { duration: 0.9, ease: EASE_OUT } } }}
          >
            <em>{a}</em> {b}
          </motion.p>
        ))}
      </motion.div>

      <motion.div
        className="hero-cta"
        initial={{ opacity: 0, y: 30 }}
        animate={ready ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 1, delay: 1.45, ease: EASE_OUT }}
      >
        <Magnetic>
          <motion.button
            className="btn btn-primary"
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.04 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
            onClick={() => {
              haptic(12);
              openBooking();
            }}
          >
            <span>Reservar turno</span>
            <span className="btn-arrow">→</span>
          </motion.button>
        </Magnetic>
        <button className="btn btn-ghost" onClick={() => scrollTo("#tendencias")}>
          Tendencias
        </button>
      </motion.div>

      <motion.div className="scroll-hint" style={{ opacity: fade }} aria-hidden>
        <motion.span animate={{ y: ["-100%", "100%"] }} transition={{ duration: 1.8, repeat: Infinity, ease: [0.65, 0, 0.35, 1] }} />
      </motion.div>
    </section>
  );
}
