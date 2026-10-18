"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { care, palette } from "@/lib/data";
import { EASE_OUT } from "@/lib/motion";

const TONES = [palette.mint, palette.butter, palette.lilac, palette.blush];

function Card({ i, titulo, texto }: { i: number; titulo: string; texto: string }) {
  const ref = useRef<HTMLDivElement>(null);
  // La tarjeta se achica y se oscurece cuando la siguiente se apila encima.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const shade = useTransform(scrollYProgress, [0, 1], [0, 0.18]);
  return (
    <div className="care-slot" ref={ref} style={{ top: `calc(84px + ${i * 22}px)` }}>
      <motion.article className="care-card" style={{ scale, background: TONES[i % TONES.length] }}>
        <motion.span className="care-shade" style={{ opacity: shade }} />
        <span className="care-n">0{i + 1}</span>
        <h3>{titulo}</h3>
        <p>{texto}</p>
      </motion.article>
    </div>
  );
}

export default function Care() {
  return (
    <section className="care" id="cuidados">
      <motion.div
        className="section-head"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1, ease: EASE_OUT }}
      >
        <p className="kicker">Capítulo IV — El ritual</p>
        <h2>
          Cuidados para que <em>duren más</em>
        </h2>
      </motion.div>
      <div className="care-stack">
        {care.map((c, i) => (
          <Card key={c.titulo} i={i} {...c} />
        ))}
      </div>
    </section>
  );
}
