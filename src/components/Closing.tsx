"use client";

import { motion } from "framer-motion";
import { useApp } from "./Providers";
import Magnetic from "./Magnetic";
import { Reveal } from "./Shapes";
import { quotes } from "@/lib/data";
import { EASE_OUT, haptic } from "@/lib/motion";

export function Quotes() {
  return (
    <section className="quotes">
      <Reveal className="section-head">
        <p className="kicker">V — Ellas dicen</p>
      </Reveal>
      <div className="quotes-track" data-lenis-prevent-touch>
        {quotes.map((q, i) => (
          <motion.figure
            key={i}
            className="quote"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.9, ease: EASE_OUT, delay: i * 0.08 }}
          >
            <blockquote>“{q.texto}”</blockquote>
            <figcaption>{q.autor}</figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}

export function FinalCTA() {
  const { openBooking } = useApp();
  return (
    <section className="final" id="reservar">
      <motion.h2 initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.5 }} variants={{ show: { transition: { staggerChildren: 0.12 } } }}>
        {["Tu próxima", "cita."].map((l, i) => (
          <span className="mask" key={l}>
            <motion.span className={`mask-inner ${i ? "it" : ""}`} variants={{ hidden: { y: "110%" }, show: { y: "0%", transition: { duration: 1.1, ease: EASE_OUT } } }}>
              {l}
            </motion.span>
          </span>
        ))}
      </motion.h2>
      <Reveal delay={0.3}>
        <p>Elegí servicio, día y horario. Confirmación al instante.</p>
        <Magnetic strength={0.15}>
          <motion.button
            className="btn btn-light"
            whileTap={{ scale: 0.94 }}
            transition={{ type: "spring", stiffness: 500, damping: 16 }}
            onClick={() => {
              haptic(12);
              openBooking();
            }}
          >
            Agendar ahora <span className="btn-arrow">→</span>
          </motion.button>
        </Magnetic>
      </Reveal>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <p className="footer-mark">PRISCILA KAITER</p>
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
      <p className="footer-colophon">© {new Date().getFullYear()} Priscila Kaiter — Manicura de autor</p>
    </footer>
  );
}
