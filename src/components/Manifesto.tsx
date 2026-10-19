"use client";

import { motion } from "framer-motion";
import { EASE_OUT } from "@/lib/motion";

const LINES = ["La elegancia", "no se grita:", "se nota en", "el detalle"];

export default function Manifesto() {
  return (
    <section className="manifesto">
      <p className="kicker">Manifiesto</p>
      <motion.blockquote initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.5 }} variants={{ show: { transition: { staggerChildren: 0.12 } } }}>
        {LINES.map((l, i) => (
          <span className="mask" key={l}>
            <motion.span
              className={`mask-inner ${i % 2 ? "it" : ""}`}
              variants={{ hidden: { y: "110%" }, show: { y: "0%", transition: { duration: 1.1, ease: EASE_OUT } } }}
            >
              {l}
              {i === LINES.length - 1 && <span className="stop">.</span>}
            </motion.span>
          </span>
        ))}
      </motion.blockquote>
      <motion.p
        className="manifesto-by"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.6 }}
      >
        — Priscila Kaiter
      </motion.p>
    </section>
  );
}
