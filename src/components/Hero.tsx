"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useApp } from "./Providers";
import Nail from "./Nail";
import Magnetic from "./Magnetic";
import { EASE_OUT, haptic } from "@/lib/motion";

function Letters({ text, delay, ready, className }: { text: string; delay: number; ready: boolean; className?: string }) {
  return (
    <span className={className} aria-label={text}>
      {text.split("").map((ch, i) => (
        <span className="mask" key={i} aria-hidden>
          <motion.span
            className="mask-inner"
            initial={{ y: "110%" }}
            animate={ready ? { y: "0%" } : undefined}
            transition={{ type: "spring", stiffness: 160, damping: 18, delay: delay + i * 0.04 }}
          >
            {ch}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

const fadeUp = (ready: boolean, delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: ready ? { opacity: 1, y: 0 } : undefined,
  transition: { duration: 1, delay, ease: EASE_OUT },
});

export default function Hero() {
  const { ready, openBooking, scrollTo } = useApp();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const nailY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const nailR = useTransform(scrollYProgress, [0, 1], [-14, -4]);

  return (
    <section className="hero" id="inicio" ref={ref}>
      <motion.div className="hero-top" {...fadeUp(ready, 0)}>
        <span>Nº 01</span>
        <span>Otoño — Invierno 2026</span>
      </motion.div>

      <h1 className="masthead">
        <Letters text="PRISCILA" delay={0.05} ready={ready} />
      </h1>

      <motion.div className="hero-sub" {...fadeUp(ready, 0.45)}>
        <span>Manicurista</span>
        <em>Kaiter</em>
      </motion.div>

      {/* Portada: un solo objeto, alto contraste */}
      <motion.div
        className="cover"
        initial={{ clipPath: "inset(100% 0 0 0)" }}
        animate={ready ? { clipPath: "inset(0% 0 0 0)" } : undefined}
        transition={{ duration: 1.2, delay: 0.35, ease: [0.76, 0, 0.24, 1] }}
      >
        <motion.div className="cover-nail" style={{ y: nailY, rotate: nailR }}>
          {/* Anticipación + squash & stretch al asentarse */}
          <motion.div
            initial={{ y: 60, scaleY: 0.9, scaleX: 1.06, opacity: 0 }}
            animate={ready ? { y: [60, -10, 0], scaleY: [0.9, 1.06, 1], scaleX: [1.06, 0.96, 1], opacity: 1 } : undefined}
            transition={{ duration: 1.1, delay: 1, times: [0, 0.6, 1], ease: EASE_OUT }}
            style={{ originY: 1 }}
          >
            <Nail shape="almond" color="#C8102E" color2="#E03A4E" minimal />
          </motion.div>
        </motion.div>
        <motion.ul
          className="cover-lines"
          initial="hidden"
          animate={ready ? "show" : "hidden"}
          variants={{ show: { transition: { staggerChildren: 0.1, delayChildren: 1.2 } } }}
        >
          {[
            ["El rojo", "vuelve a mandar", "#C8102E"],
            ["Milky", "la uña desnuda, mejorada", "#E9A6B2"],
            ["Ritual", "cuidados en cinco minutos", "#7FBF9E"],
          ].map(([a, b, c]) => (
            <motion.li key={a} variants={{ hidden: { opacity: 0, x: -16 }, show: { opacity: 1, x: 0, transition: { duration: 0.8, ease: EASE_OUT } } }}>
              <b>
                <i className="dot" style={{ background: c }} />
                {a}
              </b>
              <span>{b}</span>
            </motion.li>
          ))}
        </motion.ul>
        <motion.span className="cover-issue" {...fadeUp(ready, 1.5)}>
          Edición
          <br />
          Manicura
        </motion.span>
      </motion.div>

      <motion.div className="hero-side" {...fadeUp(ready, 1.4)}>
        <p className="hero-intro">
          Manicura de autor en un estudio íntimo. Semipermanente, kapping, soft gel y nail art, con la precisión de una pieza a medida.
        </p>
        <div className="hero-cta">
        <Magnetic strength={0.15}>
          <motion.button
            className="btn btn-dark"
            whileTap={{ scale: 0.94 }}
            transition={{ type: "spring", stiffness: 500, damping: 16 }}
            onClick={() => {
              haptic(12);
              openBooking();
            }}
          >
            Reservar turno <span className="btn-arrow">→</span>
          </motion.button>
        </Magnetic>
        <button className="link" onClick={() => scrollTo("#servicios")}>
          Ver servicios
        </button>
        </div>
      </motion.div>
    </section>
  );
}
