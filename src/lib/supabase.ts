import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  client ??= createClient(url, key, { auth: { persistSession: false } });
  return client;
}

/** Horarios ("HH:MM") ya reservados para una fecha "YYYY-MM-DD". */
export async function fetchTaken(fecha: string): Promise<string[]> {
  const sb = getClient();
  if (!sb) return [];
  const { data, error } = await sb.rpc("horarios_ocupados", { p_fecha: fecha });
  if (error || !data) return [];
  return data as string[];
}

export type BookingInput = {
  nombre: string;
  telefono: string;
  servicio: string;
  fecha: string;
  hora: string;
  notas?: string;
};

const ERRORS: Record<string, string> = {
  horario_ocupado: "Ese horario se acaba de reservar. Elegí otro, por favor.",
  hora_pasada: "Ese horario ya pasó. Elegí uno más adelante.",
  domingo_cerrado: "Los domingos el estudio descansa.",
  fecha_invalida: "Podés reservar hasta 60 días hacia adelante.",
  hora_invalida: "Elegí uno de los horarios disponibles.",
};

export async function book(input: BookingInput): Promise<{ ok: true } | { ok: false; message: string }> {
  const sb = getClient();
  if (!sb) return { ok: false, message: "La agenda online no está disponible en este momento." };
  const { error } = await sb.rpc("reservar_turno", {
    p_nombre: input.nombre,
    p_telefono: input.telefono,
    p_servicio: input.servicio,
    p_fecha: input.fecha,
    p_hora: input.hora,
    p_notas: input.notas ?? null,
  });
  if (!error) return { ok: true };
  const key = Object.keys(ERRORS).find((k) => error.message.includes(k));
  return { ok: false, message: key ? ERRORS[key] : "No pudimos confirmar el turno. Probá de nuevo en unos segundos." };
}
