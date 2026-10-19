"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useApp } from "./Providers";
import { formatPrice, services } from "@/lib/data";
import { EASE_OUT, haptic } from "@/lib/motion";

export default function Services() {
  const { openBooking } = useApp();
  const [open, setOpen] = useState<string | null>(services[0].id);

  return (
    <section className="services" id="servicios">
      <motion.div
        className="section-head"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1, ease: EASE_OUT }}
      >
        <p className="kicker">III — El menú</p>
        <h2>
          Servicios
          <br />
          <em>de autor.</em>
        </h2>
      </motion.div>

      <ul className="svc-list">
        {services.map((s, i) => {
          const isOpen = open === s.id;
          return (
            <motion.li
              key={s.id}
              className={`svc ${isOpen ? "is-open" : ""}`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.9, ease: EASE_OUT, delay: i * 0.06 }}
              layout
              style={{ ["--tone" as string]: s.tono }}
            >
              <button
                className="svc-row"
                aria-expanded={isOpen}
                onClick={() => {
                  haptic(6);
                  setOpen(isOpen ? null : s.id);
                }}
              >
                <span className="svc-n">
                  <i className="dot" />0{i + 1}
                </span>
                <span className="svc-name">{s.nombre}</span>
                <span className="svc-meta">{s.duracion}′</span>
                <motion.span className="svc-plus" animate={{ rotate: isOpen ? 45 : 0 }} transition={{ type: "spring", stiffness: 400, damping: 18 }}>
                  +
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    className="svc-body"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.55, ease: EASE_OUT }}
                  >
                    <div className="svc-inner">
                      <p>{s.bajada}</p>
                      <div className="svc-foot">
                        <span className="svc-price">
                          <small>desde</small> {formatPrice(s.precio)}
                        </span>
                        <motion.button
                          className="btn btn-light btn-sm"
                          whileTap={{ scale: 0.9 }}
                          transition={{ type: "spring", stiffness: 500, damping: 15 }}
                          onClick={() => {
                            haptic(12);
                            openBooking(s.id);
                          }}
                        >
                          Reservar →
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}
