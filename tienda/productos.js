// Configuración de la tienda. Cambia aquí nombre, precios, variantes y fechas.
const TIENDA = {
  marca: "Sedalia", // nombre provisional: comprueba que esté libre en la OEPM antes de usarlo
  envioGratisDesde: 0, // 0 = envío gratis siempre
  // Último día para pedir y recibir antes de Navidad (ajústalo a los plazos reales de tu proveedor)
  fechaLimiteNavidad: "2026-12-18T23:59:59",

  // ---- PAGOS REALES (Stripe Payment Links) ----
  // Crea en Stripe un enlace de pago por pack y pégalo aquí. En cuanto haya
  // al menos uno, la web pasa a "modo venta": el botón dice "Comprar ahora" y
  // lleva directo al pago (sin carrito ni cuenta obligatoria). El color elegido
  // llega a Stripe en el campo client_reference_id del pago.
  enlacesPago: {
    1: "", // p. ej. "https://buy.stripe.com/xxxxxxxx"
    2: "",
    3: "",
  },

  // ---- PÍXEL DE META (Facebook/Instagram Ads) ----
  // Pega aquí el ID de tu píxel. Solo se carga si el visitante acepta las cookies.
  metaPixelId: "",

  // ---- FOTOS REALES ----
  // Sube tus fotos a tienda/img/ y pon aquí sus rutas. Si está vacío se usa la ilustración.
  fotos: [
    // "img/rizador-1.jpg",
    // "img/rizador-2.jpg",
  ],

  // ---- DATOS LEGALES (obligatorios por la LSSI) ----
  empresa: {
    titular: "[TU NOMBRE O RAZÓN SOCIAL]",
    nif: "[NIF/CIF]",
    direccion: "[DIRECCIÓN FISCAL COMPLETA]",
    email: "[EMAIL DE CONTACTO]",
  },
};

const PRODUCTO = {
  id: "rizador-sin-calor",
  nombre: "Rizador sin calor Sedalia",
  subtitulo: "Rizos y ondas de peluquería mientras duermes. Sin plancha, sin calor y sin dañar tu pelo.",
  precio: 19.95, // precio de 1 unidad
  variantes: [
    { id: "rosa", nombre: "Rosa satén", tono: "#e8a3b4", brillo: "#f8d6df", sombra: "#c97f93" },
    { id: "champan", nombre: "Champán", tono: "#e2c79c", brillo: "#f6e9d2", sombra: "#c0a074" },
    { id: "negro", nombre: "Negro", tono: "#3a3438", brillo: "#6a6268", sombra: "#211d20" },
  ],
  // Precio final de cada pack (IVA incluido). El ahorro se calcula solo.
  packs: [
    { unidades: 1, etiqueta: "1 rizador", precio: 19.95 },
    { unidades: 2, etiqueta: "2 rizadores", precio: 29.95, nota: "Uno para ti y otro para regalar" },
    { unidades: 3, etiqueta: "3 rizadores", precio: 39.95, nota: "Para regalar a mamá, hermana y amiga" },
  ],
  incluye: "Barra rizadora de satén con relleno suave, 2 coleteros de satén, 2 pinzas y bolsa de regalo.",
};
