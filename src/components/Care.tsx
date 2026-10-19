"use client";

import { motion } from "framer-motion";
import { Reveal } from "./Shapes";
import { care } from "@/lib/data";
import { EASE_OUT } from "@/lib/motion";

export default function Care() {
  return (
    <section className="care" id="cuidados">
      <Reveal className="section-head">
        <p className="kicker">IV — El ritual</p>
        <h2>
          Cuidados
          <br />
          <em>que duran.</em>
        </h2>
      </Reveal>
      <div className="care-grid">
        {care.map((c, i) => (
          <motion.article
            key={c.titulo}
            className="care-item"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.9, ease: EASE_OUT, delay: (i % 2) * 0.1 }}
          >
            <span className="care-n">0{i + 1}</span>
            <h3>{c.titulo}</h3>
            <p>{c.texto}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
