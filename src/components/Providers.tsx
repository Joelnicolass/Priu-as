"use client";

import Lenis from "lenis";
import { MotionConfig } from "framer-motion";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

type Ctx = {
  ready: boolean;
  setReady: (v: boolean) => void;
  scrollTo: (target: string | number) => void;
  bookingOpen: boolean;
  bookingService: string | null;
  openBooking: (serviceId?: string) => void;
  closeBooking: () => void;
};

const AppCtx = createContext<Ctx | null>(null);

export const useApp = () => {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp fuera de Providers");
  return ctx;
};

export default function Providers({ children }: { children: React.ReactNode }) {
  const lenis = useRef<Lenis | null>(null);
  const [ready, setReady] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingService, setBookingService] = useState<string | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const l = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4), smoothWheel: true });
    lenis.current = l;
    let id = 0;
    const raf = (time: number) => {
      l.raf(time);
      id = requestAnimationFrame(raf);
    };
    id = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(id);
      l.destroy();
      lenis.current = null;
    };
  }, []);

  // Con la hoja de reserva abierta el fondo queda quieto, como en una app nativa.
  useEffect(() => {
    if (bookingOpen) {
      lenis.current?.stop();
      document.documentElement.classList.add("locked");
    } else {
      lenis.current?.start();
      document.documentElement.classList.remove("locked");
    }
  }, [bookingOpen]);

  const scrollTo = useCallback((target: string | number) => {
    if (lenis.current) lenis.current.scrollTo(target, { offset: 0, duration: 1.4 });
    else if (typeof target === "number") window.scrollTo({ top: target, behavior: "smooth" });
    else document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const openBooking = useCallback((serviceId?: string) => {
    setBookingService(serviceId ?? null);
    setBookingOpen(true);
  }, []);
  const closeBooking = useCallback(() => setBookingOpen(false), []);

  const value = useMemo(
    () => ({ ready, setReady, scrollTo, bookingOpen, bookingService, openBooking, closeBooking }),
    [ready, scrollTo, bookingOpen, bookingService, openBooking, closeBooking]
  );

  return (
    <MotionConfig reducedMotion="user">
      <AppCtx.Provider value={value}>{children}</AppCtx.Provider>
    </MotionConfig>
  );
}
