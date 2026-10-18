"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useLayoutEffect, useRef, useState } from "react";
import Nail from "./Nail";
import { trends } from "@/lib/data";

/** Scroll vertical que se convierte en un recorrido horizontal por las páginas. */
export default function Trends() {
  const ref = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(0);

  useLayoutEffect(() => {
    const measure = () => {
      if (!track.current) return;
      setDist(Math.max(0, track.current.scrollWidth - window.innerWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const raw = useTransform(scrollYProgress, [0.05, 0.95], [0, -dist]);
  const x = useSpring(raw, { stiffness: 120, damping: 26, mass: 0.4 });
  // Arrastre: las páginas se inclinan según la velocidad y vuelven a su sitio.
  const lag = useSpring(raw, { stiffness: 50, damping: 18 });
  const skew = useTransform([raw, lag], ([a, b]: number[]) => `${Math.max(-6, Math.min(6, (a - b) / 40))}deg`);

  return (
    <section className="trends" id="tendencias" ref={ref} style={{ height: `${trends.length * 75 + 60}svh` }}>
      <div className="trends-sticky">
        <div className="trends-head">
          <p className="kicker">Capítulo II — Tendencias</p>
          <h2>
            Lo que se lleva <em>esta temporada</em>
          </h2>
        </div>
        <motion.div className="trends-track" ref={track} style={{ x, skewX: skew }}>
          {trends.map((t, i) => (
            <article className="trend" key={t.n} style={{ background: t.bg }}>
              <div className="trend-top">
                <span className="trend-n">{t.n}</span>
                <span className="trend-tag">Tendencia</span>
              </div>
              <div className="trend-art">
                {[-16, 0, 16].map((r, k) => (
                  <motion.div
                    key={k}
                    className="trend-nail"
                    style={{ rotate: r, zIndex: k === 1 ? 2 : 1 }}
                    whileHover={{ y: -14, rotate: r * 1.4 }}
                    animate={{ y: [0, k === 1 ? -8 : -4, 0] }}
                    transition={{ duration: 3 + k * 0.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 + k * 0.3 }}
                  >
                    <Nail shape={t.shape} color={t.colores[0]} color2={t.colores[1]} finish={t.finish} />
                  </motion.div>
                ))}
              </div>
              <h3>{t.titulo}</h3>
              <p>{t.texto}</p>
              <div className="trend-swatches">
                {t.colores.map((c) => (
                  <span key={c} style={{ background: c }} />
                ))}
              </div>
            </article>
          ))}
          <div className="trend-end">
            <p>
              ¿Cuál es
              <br />
              <em>la tuya?</em>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
