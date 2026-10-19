"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useApp } from "./Providers";
import { EASE_IN_OUT, EASE_OUT } from "@/lib/motion";

export default function Splash() {
  const { setReady } = useApp();
  const [show, setShow] = useState(true);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("pk-splash") === "1";
      sessionStorage.setItem("pk-splash", "1");
    } catch {}
    const t = setTimeout(() => setShow(false), seen ? 600 : 2100);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence onExitComplete={() => setReady(true)}>
      {show && (
        <motion.div className="splash" key="splash" exit={{ pointerEvents: "none" }} transition={{ duration: 1 }}>
          <motion.div className="splash-panel" exit={{ y: "-100%" }} transition={{ duration: 0.95, ease: EASE_IN_OUT }}>
            <motion.div className="splash-inner" exit={{ y: -40, opacity: 0 }} transition={{ duration: 0.45, ease: EASE_OUT }}>
              <div className="splash-mono">
                {["P", "K"].map((l, i) => (
                  <span className="mask" key={l}>
                    <motion.span
                      className={`mask-inner ${i ? "it" : ""}`}
                      initial={{ y: "110%" }}
                      animate={{ y: "0%" }}
                      transition={{ type: "spring", stiffness: 150, damping: 17, delay: 0.15 + i * 0.12 }}
                    >
                      {l}
                    </motion.span>
                  </span>
                ))}
              </div>
              <motion.span
                className="splash-line"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 0.55, ease: EASE_OUT }}
              />
              <motion.p
                className="splash-sub"
                initial={{ opacity: 0, letterSpacing: "0.2em" }}
                animate={{ opacity: 1, letterSpacing: "0.5em" }}
                transition={{ duration: 1.2, delay: 0.8, ease: EASE_OUT }}
              >
                MANICURA DE AUTOR
              </motion.p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
