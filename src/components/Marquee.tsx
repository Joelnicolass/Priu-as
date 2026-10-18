"use client";

import { motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity, wrap } from "framer-motion";
import { useRef } from "react";

/** Cinta infinita que acelera y cambia de sentido con la velocidad del scroll. */
export default function Marquee({ items, speed = 3, dark = false, tilt = 0 }: { items: string[]; speed?: number; dark?: boolean; tilt?: number }) {
  const base = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const factor = useTransform(velocity, [-1500, 0, 1500], [-4, 0, 4], { clamp: false });
  const x = useTransform(base, (v) => `${wrap(-50, 0, v)}%`);
  const dir = useRef(1);

  useAnimationFrame((_, delta) => {
    let move = dir.current * -speed * (delta / 1000);
    const f = factor.get();
    if (f < 0) dir.current = -1;
    else if (f > 0) dir.current = 1;
    move += move * Math.abs(f);
    base.set(base.get() + move);
  });

  const row = [...items, ...items];
  return (
    <div className={`marquee ${dark ? "marquee--dark" : ""}`} style={{ rotate: `${tilt}deg` }} aria-hidden>
      <motion.div className="marquee-track" style={{ x }}>
        {[0, 1].map((k) => (
          <div className="marquee-row" key={k}>
            {row.map((t, i) => (
              <span key={i}>
                {t}
                <i>✦</i>
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
