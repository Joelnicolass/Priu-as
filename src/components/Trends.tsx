"use client";

import { motion } from "framer-motion";
import Nail from "./Nail";
import { Reveal } from "./Shapes";
import { trends } from "@/lib/data";
import { EASE_OUT } from "@/lib/motion";

/** Índice editorial: el color aparece solo en las uñas, sobre blanco y negro. */
export default function Trends() {
  return (
    <section className="trends" id="tendencias">
      <Reveal className="section-head">
        <p className="kicker">II — Tendencias</p>
        <h2>
          Lo que se lleva
          <br />
          <em>esta temporada.</em>
        </h2>
      </Reveal>
      <ol className="trend-list">
        {trends.map((t, i) => (
          <motion.li
            key={t.n}
            className="trend"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 1, ease: EASE_OUT }}
          >
            <div className="trend-art">
              <span className="trend-n">{t.n}</span>
              {[-12, 0, 12].map((r, k) => (
                <motion.div
                  key={k}
                  className="trend-nail"
                  initial={{ y: 40, rotate: 0, opacity: 0 }}
                  whileInView={{ y: 0, rotate: r, opacity: 1 }}
                  viewport={{ once: true, amount: 0.6 }}
                  // Acción superpuesta: cada uña llega un instante después que la anterior.
                  transition={{ type: "spring", stiffness: 120, damping: 13, delay: 0.15 + k * 0.09 }}
                >
                  <Nail shape={t.shape} color={t.colores[0]} color2={t.colores[1]} finish={t.finish} minimal shimmer={k === 1} />
                </motion.div>
              ))}
            </div>
            <div className="trend-copy">
              <h3>{t.titulo}</h3>
              <p>{t.texto}</p>
            </div>
            <span className="trend-idx" aria-hidden>
              {String(i + 1).padStart(2, "0")} / {String(trends.length).padStart(2, "0")}
            </span>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
