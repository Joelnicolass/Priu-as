# Priscila Kaiter — Manicurista

Landing PWA con agenda de turnos. Next.js 15 + Framer Motion + Lenis + Supabase.

## Desarrollo

```bash
cp .env.example .env.local   # completar con la URL y la publishable key de Supabase
npm install
npm run dev
```

- Servicios, precios, tendencias y horarios: `src/lib/data.ts`
- Esquema de la base: `supabase/migrations/0001_turnos.sql` (tabla `turnos` cerrada por RLS; el cliente solo usa las RPC `horarios_ocupados` y `reservar_turno`)
- Íconos de la PWA: `node scripts/icons.mjs`
