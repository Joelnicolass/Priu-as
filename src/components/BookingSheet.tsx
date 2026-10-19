"use client";

import { AnimatePresence, motion, useDragControls, type PanInfo } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useApp } from "./Providers";
import Nail from "./Nail";
import { SLOTS, formatPrice, services } from "@/lib/data";
import { book, fetchTaken } from "@/lib/supabase";
import { EASE_OUT, haptic, springSoft } from "@/lib/motion";

const DAYS = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
const MONTHS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const STEPS = ["Servicio", "Fecha", "Tus datos"];

const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

function nextDays(n: number) {
  const out: Date[] = [];
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  while (out.length < n) {
    if (d.getDay() !== 0) out.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return out;
}

function isPast(date: Date, slot: string) {
  const [h, m] = slot.split(":").map(Number);
  const t = new Date(date);
  t.setHours(h, m, 0, 0);
  return t.getTime() <= Date.now();
}

function icsFor(servicio: string, date: Date, slot: string, minutes: number) {
  const [h, m] = slot.split(":").map(Number);
  const start = new Date(date);
  start.setHours(h, m, 0, 0);
  const end = new Date(start.getTime() + minutes * 60000);
  const f = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const body = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Priscila Kaiter//Turnos//ES",
    "BEGIN:VEVENT",
    `UID:${f(start)}-pk@priscilakaiter`,
    `DTSTAMP:${f(new Date())}`,
    `DTSTART:${f(start)}`,
    `DTEND:${f(end)}`,
    `SUMMARY:${servicio} · Priscila Kaiter`,
    "DESCRIPTION:Tu turno de manicura. Llegá 5 minutos antes.",
    "BEGIN:VALARM",
    "TRIGGER:-PT2H",
    "ACTION:DISPLAY",
    "DESCRIPTION:Turno con Priscila Kaiter",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  return URL.createObjectURL(new Blob([body], { type: "text/calendar" }));
}

function Burst() {
  const bits = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => {
        const a = (i / 22) * Math.PI * 2;
        const r = 110 + (i % 4) * 30;
        return {
          x: Math.cos(a) * r,
          y: Math.sin(a) * r * 0.8 - 40,
          rot: (i % 2 ? 1 : -1) * (180 + i * 20),
          c: ["#C8102E", "#E9A6B2", "#B9A6E0", "#E8C766", "#7FBF9E", "#0A0A0A"][i % 6],
          s: 0.6 + (i % 3) * 0.25,
        };
      }),
    []
  );
  return (
    <div className="burst" aria-hidden>
      {bits.map((b, i) => (
        // Arcos + gravedad: suben, se abren y caen.
        <motion.span
          key={i}
          className="burst-bit"
          style={{ background: b.c }}
          initial={{ x: 0, y: 0, scale: 0, rotate: 0, opacity: 1 }}
          animate={{ x: [0, b.x * 0.8, b.x], y: [0, b.y, b.y + 180], scale: [0, b.s, b.s * 0.6], rotate: b.rot, opacity: [1, 1, 0] }}
          transition={{ duration: 1.6, times: [0, 0.4, 1], ease: ["easeOut", "easeIn"], delay: 0.15 }}
        />
      ))}
    </div>
  );
}

export default function BookingSheet() {
  const { bookingOpen, bookingService, closeBooking } = useApp();
  const drag = useDragControls();
  const days = useMemo(() => (bookingOpen ? nextDays(30) : []), [bookingOpen]);

  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [service, setService] = useState<string | null>(null);
  const [day, setDay] = useState<Date | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [taken, setTaken] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [notas, setNotas] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!bookingOpen) return;
    setService(bookingService);
    setStep(bookingService ? 1 : 0);
    setDir(1);
    setDay(null);
    setSlot(null);
    setError(null);
    setDone(false);
  }, [bookingOpen, bookingService]);

  useEffect(() => {
    if (!day) return;
    let alive = true;
    setLoadingSlots(true);
    setSlot(null);
    fetchTaken(iso(day)).then((t) => {
      if (!alive) return;
      setTaken(t);
      setLoadingSlots(false);
    });
    return () => {
      alive = false;
    };
  }, [day]);

  const svc = services.find((s) => s.id === service);
  const phoneOk = telefono.replace(/\D/g, "").length >= 8;
  const canNext = step === 0 ? !!service : step === 1 ? !!day && !!slot : nombre.trim().length >= 2 && phoneOk;

  const go = (n: number) => {
    haptic(8);
    setDir(n > step ? 1 : -1);
    setStep(n);
  };

  const submit = async () => {
    if (!svc || !day || !slot) return;
    setSending(true);
    setError(null);
    const res = await book({ nombre, telefono, servicio: svc.nombre, fecha: iso(day), hora: slot, notas });
    setSending(false);
    if (res.ok) {
      haptic([20, 60, 30]);
      setDone(true);
    } else {
      haptic([40, 40, 40]);
      setError(res.message);
      if (res.message.includes("horario")) {
        setDir(-1);
        setStep(1);
        fetchTaken(iso(day)).then(setTaken);
        setSlot(null);
      }
    }
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > 120 || info.velocity.y > 600) closeBooking();
  };

  return (
    <AnimatePresence>
      {bookingOpen && (
        <>
          <motion.div
            className="sheet-backdrop"
            key="bd"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={closeBooking}
          />
          <motion.div
            className="sheet"
            key="sheet"
            role="dialog"
            aria-modal="true"
            aria-label="Reservar turno"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 30, mass: 0.9 }}
            drag="y"
            dragListener={false}
            dragControls={drag}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.05, bottom: 0.8 }}
            onDragEnd={onDragEnd}
          >
            <div className="sheet-grab" onPointerDown={(e) => drag.start(e)}>
              <span className="sheet-handle" />
              <div className="sheet-head">
                {!done && step > 0 ? (
                  <button className="sheet-back" onClick={() => go(step - 1)} aria-label="Volver">
                    ←
                  </button>
                ) : (
                  <span className="sheet-back-ph" />
                )}
                <div className="sheet-title">
                  <small>{done ? "Confirmado" : `Paso ${step + 1} de 3`}</small>
                  <b>{done ? "¡Te esperamos!" : STEPS[step]}</b>
                </div>
                <button className="sheet-close" onClick={closeBooking} aria-label="Cerrar">
                  ✕
                </button>
              </div>
              {!done && (
                <div className="sheet-progress">
                  {STEPS.map((_, i) => (
                    <span key={i}>
                      <motion.i initial={false} animate={{ scaleX: i <= step ? 1 : 0 }} transition={{ duration: 0.5, ease: EASE_OUT }} />
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="sheet-body" data-lenis-prevent>
              <AnimatePresence mode="wait" custom={dir} initial={false}>
                {done ? (
                  <motion.div key="done" className="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={springSoft}>
                    <div className="done-art">
                      <Burst />
                      <motion.div
                        className="done-nail"
                        initial={{ y: 40, scale: 0.4, rotate: -30 }}
                        animate={{ y: 0, scale: 1, rotate: -8 }}
                        transition={{ type: "spring", stiffness: 220, damping: 10 }}
                      >
                        <Nail shape="almond" color="#C8102E" color2="#E03A4E" minimal />
                      </motion.div>
                    </div>
                    <h3>
                      {nombre.split(" ")[0]}, <em>tu turno está reservado.</em>
                    </h3>
                    <div className="summary">
                      <div>
                        <small>Servicio</small>
                        <b>{svc?.nombre}</b>
                      </div>
                      <div>
                        <small>Día</small>
                        <b>
                          {day && `${DAYS[day.getDay()]} ${day.getDate()} ${MONTHS[day.getMonth()]}`}
                        </b>
                      </div>
                      <div>
                        <small>Hora</small>
                        <b>{slot} h</b>
                      </div>
                    </div>
                    <p className="muted">Te vamos a escribir al {telefono} para confirmar. Llegá 5 minutos antes.</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key={step}
                    custom={dir}
                    variants={{
                      enter: (d: number) => ({ x: d * 60, opacity: 0 }),
                      center: { x: 0, opacity: 1 },
                      exit: (d: number) => ({ x: d * -60, opacity: 0 }),
                    }}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.38, ease: EASE_OUT }}
                  >
                    {step === 0 && (
                      <div className="opt-list">
                        {services.map((s, i) => (
                          <motion.button
                            key={s.id}
                            className={`opt ${service === s.id ? "is-on" : ""}`}
                            style={{ ["--tone" as string]: s.tono }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05, duration: 0.5, ease: EASE_OUT }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => {
                              haptic(8);
                              setService(s.id);
                            }}
                          >
                                                        <i className="dot" />
                            <span className="opt-main">
                              <b>{s.nombre}</b>
                              <small>
                                {s.duracion} min · desde {formatPrice(s.precio)}
                              </small>
                            </span>
                            <span className="opt-check">{service === s.id ? "✓" : ""}</span>
                          </motion.button>
                        ))}
                      </div>
                    )}

                    {step === 1 && (
                      <div>
                        <p className="field-label">Elegí el día</p>
                        <div className="days" data-lenis-prevent>
                          {days.map((d) => {
                            const on = day && iso(day) === iso(d);
                            return (
                              <motion.button
                                key={iso(d)}
                                className={`day ${on ? "is-on" : ""}`}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => {
                                  haptic(6);
                                  setDay(d);
                                }}
                              >
                                {on && <motion.span className="day-bg" layoutId="day-bg" transition={{ type: "spring", stiffness: 500, damping: 32 }} />}
                                <small>{DAYS[d.getDay()]}</small>
                                <b>{d.getDate()}</b>
                                <small>{MONTHS[d.getMonth()]}</small>
                              </motion.button>
                            );
                          })}
                        </div>
                        <p className="field-label">Horario</p>
                        {!day ? (
                          <p className="muted">Primero elegí un día para ver los horarios libres.</p>
                        ) : (
                          <div className="slots">
                            {SLOTS.map((s, i) => {
                              const off = taken.includes(s) || isPast(day, s);
                              return (
                                <motion.button
                                  key={s}
                                  className={`slot ${slot === s ? "is-on" : ""} ${loadingSlots ? "is-loading" : ""}`}
                                  disabled={off || loadingSlots}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: i * 0.035, type: "spring", stiffness: 400, damping: 20 }}
                                  whileTap={{ scale: 0.88 }}
                                  onClick={() => {
                                    haptic(8);
                                    setSlot(s);
                                  }}
                                >
                                  {s}
                                  {off && !loadingSlots && <small>ocupado</small>}
                                </motion.button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}

                    {step === 2 && (
                      <div className="form">
                        <div className="summary summary--mini">
                          <div>
                            <small>Servicio</small>
                            <b>{svc?.nombre}</b>
                          </div>
                          <div>
                            <small>Cuándo</small>
                            <b>
                              {day && `${DAYS[day.getDay()]} ${day.getDate()} ${MONTHS[day.getMonth()]}`} · {slot}
                            </b>
                          </div>
                        </div>
                        <label className="field">
                          <span>Nombre y apellido</span>
                          <input value={nombre} onChange={(e) => setNombre(e.target.value)} autoComplete="name" maxLength={80} placeholder="Tu nombre" />
                        </label>
                        <label className="field">
                          <span>WhatsApp</span>
                          <input
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                            inputMode="tel"
                            autoComplete="tel"
                            maxLength={30}
                            placeholder="11 5555 5555"
                          />
                        </label>
                        <label className="field">
                          <span>¿Alguna idea o referencia? (opcional)</span>
                          <textarea value={notas} onChange={(e) => setNotas(e.target.value)} rows={3} maxLength={400} placeholder="Ej: cromado lila, forma almendra…" />
                        </label>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
              <AnimatePresence>
                {error && (
                  <motion.p className="error" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0, x: [0, -8, 8, -5, 5, 0] }} exit={{ opacity: 0 }}>
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div className="sheet-foot">
              {done ? (
                <div className="foot-row">
                  {svc && day && slot && (
                    <a className="btn btn-ghost btn-block" href={icsFor(svc.nombre, day, slot, svc.duracion)} download="turno-priscila-kaiter.ics">
                      Agendar en calendario
                    </a>
                  )}
                  <button className="btn btn-dark btn-block" onClick={closeBooking}>
                    Listo
                  </button>
                </div>
              ) : (
                <motion.button
                  className="btn btn-primary btn-block"
                  disabled={!canNext || sending}
                  whileTap={canNext ? { scale: 0.95 } : undefined}
                  onClick={() => (step < 2 ? go(step + 1) : submit())}
                >
                  {sending ? <span className="spinner" /> : step < 2 ? "Continuar" : "Confirmar turno"}
                </motion.button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
