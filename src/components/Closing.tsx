"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useApp } from "./Providers";
import Magnetic from "./Magnetic";
import Nail from "./Nail";
import { quotes } from "@/lib/data";
import { EASE_OUT, haptic } from "@/lib/motion";

export function Quotes() {
  return (
    <section className="quotes">
      <p className="kicker">Ellas dicen</p>
      <div className="quotes-track" data-lenis-prevent-touch>
        {quotes.map((q, i) => (
          <motion.figure
            key={i}
            className="quote"
            initial={{ opacity: 0, y: 40, rotate: i % 2 ? 3 : -3 }}
            whileInView={{ opacity: 1, y: 0, rotate: i % 2 ? 1.5 : -1.5 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ type: "spring", stiffness: 120, damping: 14, delay: i * 0.08 }}
          >
            <blockquote>“{q.texto}”</blockquote>
            <figcaption>— {q.autor}</figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}

export function FinalCTA() {
  const { openBooking } = useApp();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const radius = useTransform(scrollYProgress, [0, 1], ["48px", "0px"]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.88, 1]);
  const nailY = useTransform(scrollYProgress, [0, 1], [160, 0]);
  const nailR = useTransform(scrollYProgress, [0, 1], [-40, -12]);

  return (
    <section className="final" id="reservar" ref={ref}>
      <motion.div className="final-card" style={{ borderRadius: radius, scale }}>
        <motion.div className="final-nail" style={{ y: nailY, rotate: nailR }}>
          <Nail shape="stiletto" color="#FFFFFF" color2="#F7D3D8" finish="chrome" />
        </motion.div>
        <motion.h2 initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1, ease: EASE_OUT }}>
          Tu próxima cita,
          <br />
          <em>en tres toques.</em>
        </motion.h2>
        <p>Elegí servicio, día y horario. Recibís la confirmación al instante.</p>
        <Magnetic>
          <motion.button
            className="btn btn-light"
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
            onClick={() => {
              haptic(12);
              openBooking();
            }}
          >
            <span>Agendar ahora</span>
            <span className="btn-arrow">→</span>
          </motion.button>
        </Magnetic>
      </motion.div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <p className="footer-sign">Priscila Kaiter</p>
      <p className="footer-role">Manicurista · Nail artist</p>
      <div className="footer-grid">
        <div>
          <h4>Horarios</h4>
          <p>Lunes a sábado</p>
          <p>9 a 20 h · solo con turno</p>
        </div>
        <div>
          <h4>Estudio</h4>
          <p>Productos hipoalergénicos</p>
          <p>Material esterilizado</p>
        </div>
      </div>
      <p className="footer-colophon">© {new Date().getFullYear()} Priscila Kaiter — Edición Nº 01</p>
    </footer>
  );
}
