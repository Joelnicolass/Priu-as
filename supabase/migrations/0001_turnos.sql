-- Turnos de Priscila Kaiter. La tabla queda cerrada (RLS sin políticas):
-- el cliente solo usa las dos funciones RPC de abajo.
create table if not exists public.turnos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null check (char_length(nombre) between 2 and 80),
  telefono text not null check (char_length(telefono) between 6 and 30),
  servicio text not null check (char_length(servicio) between 2 and 60),
  fecha date not null,
  hora time not null,
  notas text check (notas is null or char_length(notas) <= 400),
  created_at timestamptz not null default now()
);
create unique index if not exists turnos_slot_unique on public.turnos (fecha, hora);
alter table public.turnos enable row level security;
revoke all on public.turnos from anon, authenticated;

-- Solo expone los horarios tomados de un día, nunca datos personales.
create or replace function public.horarios_ocupados(p_fecha date)
returns setof text
language sql
stable
security definer
set search_path = public
as $$
  select to_char(hora, 'HH24:MI') from public.turnos where fecha = p_fecha order by hora;
$$;

create or replace function public.reservar_turno(
  p_nombre text, p_telefono text, p_servicio text, p_fecha date, p_hora text, p_notas text default null
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_hora time := p_hora::time;
  v_ahora timestamp := now() at time zone 'America/Argentina/Buenos_Aires';
begin
  if p_fecha < v_ahora::date or p_fecha > v_ahora::date + 60 then
    raise exception 'fecha_invalida';
  end if;
  if extract(isodow from p_fecha) = 7 then
    raise exception 'domingo_cerrado';
  end if;
  if to_char(v_hora, 'HH24:MI') not in ('09:00','10:30','12:00','14:00','15:30','17:00','18:30') then
    raise exception 'hora_invalida';
  end if;
  if p_fecha + v_hora <= v_ahora then
    raise exception 'hora_pasada';
  end if;
  insert into public.turnos (nombre, telefono, servicio, fecha, hora, notas)
  values (trim(p_nombre), trim(p_telefono), trim(p_servicio), p_fecha, v_hora, nullif(trim(coalesce(p_notas, '')), ''))
  returning id into v_id;
  return v_id;
exception when unique_violation then
  raise exception 'horario_ocupado';
end;
$$;

revoke all on function public.horarios_ocupados(date) from public;
revoke all on function public.reservar_turno(text, text, text, date, text, text) from public;
grant execute on function public.horarios_ocupados(date) to anon, authenticated;
grant execute on function public.reservar_turno(text, text, text, date, text, text) to anon, authenticated;
