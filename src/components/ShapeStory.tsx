"use client";

import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef, useState } from "react";
import Nail, { nailPath } from "./Nail";
import { shapes } from "@/lib/data";
import { haptic } from "@/lib/motion";

const N = shapes.length;
// Cada forma se "sostiene" un rato y luego transiciona (pose a pose).
const stops: number[] = [];
shapes.forEach((_, i) => {
  const a = i / N;
  const b = (i + 1) / N;
  stops.push(a + (b - a) * 0.2, a + (b - a) * 0.8);
});
const dup = <T,>(arr: T[]) => arr.flatMap((v) => [v, v]);

function Label({ i, progress }: { i: number; progress: MotionValue<number> }) {
  const a = i / N;
  const b = (i + 1) / N;
  const w = (b - a) * 0.22;
  // -1 = por entrar, 0 = en escena, 1 = ya salió. La primera arranca visible y la última no se va.
  // Se calcula con una función para que framer no lo delegue a ScrollTimeline.
  const phase = useTransform(progress, (v) => {
    if (v < a + w) return i === 0 ? 0 : Math.min(0, (v - (a + w)) / (2 * w));
    if (v > b - w) return i === N - 1 ? 0 : Math.max(0, (v - (b - w)) / (2 * w));
    return 0;
  });
  const opacity = useTransform(phase, (p) => Math.max(0, 1 - Math.abs(p)));
  const y = useTransform(phase, (p) => Math.max(-1, Math.min(1, p)) * -60);
  const blur = useTransform(phase, (p) => `blur(${Math.min(1, Math.abs(p)) * 10}px)`);
  return (
    <motion.div className="shape-label" style={{ opacity, y, filter: blur }}>
      <h3>{shapes[i].nombre}</h3>
      <p>{shapes[i].nota}</p>
    </motion.div>
  );
}

export default function ShapeStory() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const d = useTransform(scrollYProgress, stops, dup(shapes.map((s) => nailPath(s.id))));
  const fill = useTransform(scrollYProgress, stops, dup(shapes.map((s) => s.color)));
  const bg = useTransform(scrollYProgress, stops, dup(shapes.map((s) => s.bg)));
  const rotate = useTransform(scrollYProgress, [0, 1], [-14, 14]);
  const scale = useTransform(scrollYProgress, [0, 0.08, 0.92, 1], [0.7, 1, 1, 0.85]);
  const bar = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const [idx, setIdx] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = Math.min(N - 1, Math.max(0, Math.floor(v * N)));
    if (next !== idx) {
      setIdx(next);
      haptic(5);
    }
  });

  return (
    <section className="shapes" id="formas" ref={ref} style={{ height: `${N * 90 + 40}svh` }}>
      <motion.div className="shapes-sticky" style={{ backgroundColor: bg }}>
        <div className="shapes-head">
          <p className="kicker">Capítulo I — La forma</p>
          <h2>
            Cinco formas,
            <br />
            <em>una sola firma.</em>
          </h2>
        </div>

        <motion.div className="shapes-nail" style={{ rotate, scale }}>
          <span className="shapes-glow" />
          <Nail shape="almond" color="#000" d={d} fill={fill} />
        </motion.div>

        <div className="shapes-labels">
          {shapes.map((_, i) => (
            <Label key={i} i={i} progress={scrollYProgress} />
          ))}
        </div>

        <div className="shapes-foot">
          <span className="shapes-count">
            <motion.b key={idx} initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
              0{idx + 1}
            </motion.b>
            <span> / 0{N}</span>
          </span>
          <span className="shapes-bar">
            <motion.i style={{ width: bar }} />
          </span>
        </div>
      </motion.div>
    </section>
  );
}
