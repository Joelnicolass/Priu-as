"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Bottle } from "./Nail";

/** Dos líneas que se cruzan con el scroll y un frasco que gira en el centro. */
export default function Statement() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x1 = useTransform(scrollYProgress, [0, 1], ["30%", "-45%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["-50%", "20%"]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-35, 35]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.6, 1.1, 0.7]);
  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);

  return (
    <section className="statement" ref={ref}>
      <motion.p className="statement-line" style={{ x: x1 }}>
        Arte en la punta
      </motion.p>
      <motion.div className="statement-bottle" style={{ rotate, scale, y }}>
        <Bottle color="#B9A4EC" cap="#E9D7C5" label="lilas" />
      </motion.div>
      <motion.p className="statement-line statement-line--i" style={{ x: x2 }}>
        de tus dedos
      </motion.p>
    </section>
  );
}
