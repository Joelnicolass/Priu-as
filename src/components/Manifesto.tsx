"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";

const TEXT =
  "La elegancia no se grita: se nota en el detalle. Cada set es una conversación entre tu estilo y mis manos, pensado para durar, brillar y contar algo de vos.";
const ACCENT = new Set(["elegancia", "detalle.", "brillar"]);

function Word({ w, i, total, progress }: { w: string; i: number; total: number; progress: MotionValue<number> }) {
  const start = i / total;
  const end = start + 1 / total;
  const opacity = useTransform(progress, [start, end], [0.12, 1]);
  const y = useTransform(progress, [start, end], [8, 0]);
  return (
    <motion.span style={{ opacity, y }} className={ACCENT.has(w.replace(/[,:]/g, "")) ? "accent" : undefined}>
      {w}{" "}
    </motion.span>
  );
}

export default function Manifesto() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = TEXT.split(" ");
  return (
    <section className="manifesto">
      <p className="kicker">Manifiesto</p>
      <p className="manifesto-text" ref={ref}>
        {words.map((w, i) => (
          <Word key={i} w={w} i={i} total={words.length} progress={scrollYProgress} />
        ))}
      </p>
      <p className="manifesto-sign">Priscila Kaiter</p>
    </section>
  );
}
