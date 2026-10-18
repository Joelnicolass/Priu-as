"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { useApp } from "./Providers";
import { haptic, springSnappy } from "@/lib/motion";

type BIPEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

/** Barra superior: transparente sobre la portada, vidrio esmerilado al scrollear. */
export function AppBar() {
  const { scrollY } = useScroll();
  const { ready, scrollTo } = useApp();
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [install, setInstall] = useState<BIPEvent | null>(null);

  useMotionValueEvent(scrollY, "change", (v) => {
    const prev = scrollY.getPrevious() ?? 0;
    setSolid(v > 40);
    setHidden(v > 400 && v > prev + 2 ? true : v < prev - 2 ? false : hidden);
  });

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setInstall(e as BIPEvent);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  return (
    <motion.header
      className={`appbar ${solid ? "is-solid" : ""}`}
      initial={{ y: -80 }}
      animate={{ y: ready && !hidden ? 0 : -90 }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
    >
      <button className="monogram" onClick={() => scrollTo(0)} aria-label="Ir al inicio">
        P<i>K</i>
      </button>
      <AnimatePresence>
        {solid && (
          <motion.span className="appbar-title" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}>
            Priscila Kaiter
          </motion.span>
        )}
      </AnimatePresence>
      {install ? (
        <motion.button
          className="pill"
          whileTap={{ scale: 0.9 }}
          onClick={async () => {
            haptic(10);
            await install.prompt();
            setInstall(null);
          }}
        >
          Instalar app
        </motion.button>
      ) : (
        <span className="appbar-issue">Nº 01</span>
      )}
    </motion.header>
  );
}

const TABS = [
  { id: "inicio", label: "Inicio", icon: "M4 11.5 12 5l8 6.5V20h-5v-5H9v5H4z" },
  { id: "formas", label: "Formas", icon: "M12 3c3.5 0 6 4 6 9v6.5c0 1.4-2.7 2.5-6 2.5s-6-1.1-6-2.5V12c0-5 2.5-9 6-9z" },
  { id: "book", label: "", icon: "" },
  { id: "tendencias", label: "Tendencias", icon: "M12 3l2.3 5.6L20 9.3l-4.4 3.9 1.3 5.8L12 16l-4.9 3 1.3-5.8L4 9.3l5.7-.7z" },
  { id: "servicios", label: "Servicios", icon: "M5 6h14M5 12h14M5 18h9" },
];

/** Barra de pestañas inferior, al estilo de una app nativa. */
export function TabBar() {
  const { ready, scrollTo, openBooking } = useApp();
  const [active, setActive] = useState("inicio");

  useEffect(() => {
    const ids = ["inicio", "formas", "tendencias", "servicios", "cuidados", "reservar"];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const id = e.target.id;
          setActive(id === "cuidados" || id === "reservar" ? "servicios" : id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return (
    <motion.nav
      className="tabbar"
      initial={{ y: 120 }}
      animate={{ y: ready ? 0 : 120 }}
      transition={{ type: "spring", stiffness: 200, damping: 22, delay: 1.6 }}
      aria-label="Secciones"
    >
      {TABS.map((t) =>
        t.id === "book" ? (
          <motion.button
            key={t.id}
            className="tab-book"
            aria-label="Reservar turno"
            whileTap={{ scale: 0.82, rotate: -8 }}
            transition={{ type: "spring", stiffness: 600, damping: 12 }}
            onClick={() => {
              haptic(14);
              openBooking();
            }}
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <rect x="4" y="5" width="16" height="15" rx="3" />
              <path d="M8 3v4M16 3v4M4 10h16M12 13v4M10 15h4" />
            </svg>
          </motion.button>
        ) : (
          <button
            key={t.id}
            className={`tab ${active === t.id ? "is-active" : ""}`}
            onClick={() => {
              haptic(6);
              scrollTo(t.id === "inicio" ? 0 : `#${t.id}`);
            }}
          >
            {active === t.id && <motion.span className="tab-pill" layoutId="tab-pill" transition={springSnappy} />}
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">
              <path d={t.icon} />
            </svg>
            <span>{t.label}</span>
          </button>
        )
      )}
    </motion.nav>
  );
}
