"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useApp } from "./Providers";
import Nail from "./Nail";
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
    const t = setTimeout(() => setShow(false), seen ? 700 : 2500);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence onExitComplete={() => setReady(true)}>
      {show && (
        <motion.div className="splash" key="splash" exit={{ pointerEvents: "none" }} transition={{ duration: 1.1 }}>
          {/* Dos telones con retraso entre sí: acción superpuesta */}
          <motion.div
            className="splash-panel splash-panel--back"
            exit={{ y: "-100%" }}
            transition={{ duration: 1.05, ease: EASE_IN_OUT, delay: 0.12 }}
          />
          <motion.div className="splash-panel" exit={{ y: "-100%", borderBottomLeftRadius: "50% 12%", borderBottomRightRadius: "50% 12%" }} transition={{ duration: 0.95, ease: EASE_IN_OUT }}>
            <motion.div className="splash-inner" exit={{ y: -60, opacity: 0 }} transition={{ duration: 0.5, ease: EASE_OUT }}>
              {/* Gota que cae: squash & stretch al tocar el piso */}
              <motion.div
                className="splash-nail"
                initial={{ y: -260, scaleY: 1.25, scaleX: 0.85 }}
                animate={{ y: [-260, 0, 0, 0], scaleY: [1.25, 1.2, 0.72, 1], scaleX: [0.85, 0.88, 1.22, 1] }}
                transition={{ duration: 0.9, times: [0, 0.55, 0.72, 1], ease: ["easeIn", "easeOut", EASE_OUT] }}
                style={{ originY: 1 }}
              >
                <Nail shape="almond" color="#D7264F" color2="#FF7A66" />
              </motion.div>
              <motion.p
                className="splash-sign"
                initial={{ clipPath: "inset(0 100% 0 0)" }}
                animate={{ clipPath: "inset(0 0% 0 0)" }}
                transition={{ duration: 1.1, delay: 0.75, ease: [0.45, 0, 0.2, 1] }}
              >
                Priscila
              </motion.p>
              <motion.p
                className="splash-sub"
                initial={{ opacity: 0, letterSpacing: "0.1em" }}
                animate={{ opacity: 1, letterSpacing: "0.6em" }}
                transition={{ duration: 1.2, delay: 1.1, ease: EASE_OUT }}
              >
                KAITER
              </motion.p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
