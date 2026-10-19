"use client";

import { motion } from "framer-motion";
import Nail from "./Nail";
import { shapes } from "@/lib/data";
import { EASE_OUT } from "@/lib/motion";

export default function Shapes() {
  return (
    <section className="shapes" id="formas">
      <Reveal className="section-head">
        <p className="kicker">I — La forma</p>
        <h2>
          Cinco formas.
          <br />
          <em>Una firma.</em>
        </h2>
      </Reveal>
      <ul className="shapes-grid">
        {shapes.map((s, i) => (
          <motion.li
            key={s.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9, ease: EASE_OUT, delay: i * 0.08 }}
          >
            <motion.div className="shape-fig" whileHover={{ y: -10 }} whileTap={{ scale: 0.94 }} transition={{ type: "spring", stiffness: 300, damping: 14 }}>
              <Nail shape={s.id} color="#0A0A0A" color2="#3A3A3A" minimal shimmer={false} />
            </motion.div>
            <span className="shape-n">0{i + 1}</span>
            <h3>{s.nombre}</h3>
            <p>{s.nota}</p>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}

export function Reveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 1, ease: EASE_OUT, delay }}
    >
      {children}
    </motion.div>
  );
}
