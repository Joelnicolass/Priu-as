export type NailShape = "oval" | "square" | "almond" | "coffin" | "stiletto";
export type Finish = "gloss" | "chrome" | "milky" | "french" | "aura" | "cateye";

export const palette = {
  cream: "#FBF5EF",
  ink: "#1C1416",
  blush: "#F7D3D8",
  lilac: "#DCCDF5",
  butter: "#F8E9B8",
  mint: "#CBEBDC",
  sky: "#CFE3F7",
  cherry: "#D7264F",
  coral: "#FF7A66",
};

export type Service = {
  id: string;
  nombre: string;
  bajada: string;
  duracion: number;
  precio: number;
  tono: string;
};

// Precios de referencia: editar acá para actualizar toda la app.
export const services: Service[] = [
  {
    id: "semi",
    nombre: "Semipermanente",
    bajada: "Esmaltado de larga duración, brillo espejo durante tres semanas. Incluye limado y cutícula.",
    duracion: 60,
    precio: 18000,
    tono: "#E9A6B2",
  },
  {
    id: "kapping",
    nombre: "Kapping en gel",
    bajada: "Una capa de gel sobre la uña natural que la fortalece sin alargarla. Ideal para uñas que se quiebran.",
    duracion: 75,
    precio: 23000,
    tono: "#B9A6E0",
  },
  {
    id: "softgel",
    nombre: "Soft gel · Extensión",
    bajada: "Tips de gel suave a medida: almendra, coffin o stiletto. Largo y forma impecables desde el primer día.",
    duracion: 105,
    precio: 32000,
    tono: "#E8C766",
  },
  {
    id: "nailart",
    nombre: "Nail art de autor",
    bajada: "Cromados, aura, french micro, ojo de gato y dibujo a mano alzada. Cada set es una pieza única.",
    duracion: 90,
    precio: 28000,
    tono: "#7FBF9E",
  },
  {
    id: "spa",
    nombre: "Spa de manos",
    bajada: "Exfoliación, máscara hidratante, masaje y esmaltado tradicional. Un ritual para frenar el tiempo.",
    duracion: 50,
    precio: 15000,
    tono: "#9EC3E6",
  },
];

// Acentos de temporada: aparecen solo como detalle.
export const accents = ["#C8102E", "#E9A6B2", "#B9A6E0", "#E8C766", "#7FBF9E"];

export const shapes: { id: NailShape; nombre: string; nota: string; color: string; bg: string; finish: Finish }[] = [
  { id: "oval", nombre: "Oval", nota: "La forma clásica que alarga los dedos.", color: "#E8A3B0", bg: palette.blush, finish: "gloss" },
  { id: "square", nombre: "Square", nota: "Líneas rectas, actitud minimalista.", color: "#A68BE0", bg: palette.lilac, finish: "milky" },
  { id: "almond", nombre: "Almendra", nota: "Femenina y estilizada. La favorita de la temporada.", color: "#E7C15A", bg: palette.butter, finish: "chrome" },
  { id: "coffin", nombre: "Coffin", nota: "Punta recta y afilada, pura pasarela.", color: "#4FB58C", bg: palette.mint, finish: "aura" },
  { id: "stiletto", nombre: "Stiletto", nota: "Para quien no pasa desapercibida.", color: "#D7264F", bg: "#F6C7CF", finish: "cateye" },
];

export const trends: { n: string; titulo: string; texto: string; colores: string[]; finish: Finish; shape: NailShape; bg: string }[] = [
  {
    n: "01",
    titulo: "Milky nails",
    texto: "Un blanco lechoso y translúcido que deja ver la uña. Limpio, luminoso, quiet luxury en estado puro.",
    colores: ["#F6EEE9", "#F3DCD8"],
    finish: "milky",
    shape: "almond",
    bg: "#F3EAE4",
  },
  {
    n: "02",
    titulo: "Glazed chrome",
    texto: "El efecto donut glaseado: un velo perlado que refleja la luz como una joya recién pulida.",
    colores: ["#F4E7DF", "#D9C9E8"],
    finish: "chrome",
    shape: "oval",
    bg: palette.lilac,
  },
  {
    n: "03",
    titulo: "French micro",
    texto: "La francesa se afina hasta volverse un trazo. En blanco, en colores pastel o en doble línea.",
    colores: ["#F7D3D8", "#FFFFFF"],
    finish: "french",
    shape: "square",
    bg: palette.blush,
  },
  {
    n: "04",
    titulo: "Aura nails",
    texto: "Un degradé difuso del centro hacia afuera, como un halo de energía. Pide colores que vibren.",
    colores: ["#FF7A66", "#F8E9B8"],
    finish: "aura",
    shape: "coffin",
    bg: palette.butter,
  },
  {
    n: "05",
    titulo: "Cherry lacquer",
    texto: "El rojo cereza más profundo, en acabado laca. Un clásico que vuelve con más intensidad que nunca.",
    colores: ["#D7264F", "#7A1030"],
    finish: "gloss",
    shape: "stiletto",
    bg: "#F6C7CF",
  },
  {
    n: "06",
    titulo: "Velvet cat eye",
    texto: "Pigmentos magnéticos que crean un brillo aterciopelado y profundo que se mueve con la luz.",
    colores: ["#4FB58C", "#1D4F45"],
    finish: "cateye",
    shape: "almond",
    bg: palette.mint,
  },
];

export const care = [
  { titulo: "Aceite de cutícula, todos los días", texto: "Dos gotas por la noche mantienen la piel flexible y el esmalte intacto por más tiempo." },
  { titulo: "Nunca arranques el semipermanente", texto: "Retiralo siempre con un profesional: arrancarlo se lleva capas de tu uña natural." },
  { titulo: "Guantes para las tareas de la casa", texto: "El agua caliente y los detergentes son los enemigos silenciosos del brillo." },
  { titulo: "Descansos de base fortalecedora", texto: "Cada tanto, una semana de tratamiento devuelve a la uña su fuerza natural." },
];

export const quotes = [
  { texto: "No es una manicura, es una experiencia. Salí sintiéndome otra.", autor: "Valentina R." },
  { texto: "El nivel de detalle es de revista. Mis uñas duran perfectas tres semanas.", autor: "Camila S." },
  { texto: "Priscila entiende lo que querés antes de que lo digas.", autor: "Florencia M." },
  { texto: "El cromado más lindo que tuve en mi vida. Ya reservé el próximo.", autor: "Julieta P." },
];

export const SLOTS = ["09:00", "10:30", "12:00", "14:00", "15:30", "17:00", "18:30"];

export const formatPrice = (n: number) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);
