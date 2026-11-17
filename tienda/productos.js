// Configuración de la tienda. Cambia aquí nombre, precios, variantes y fechas.
const TIENDA = {
  marca: "Ámbar Casa", // nombre provisional: comprueba que esté libre en la OEPM antes de usarlo
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
    // "img/lampara-1.jpg",
    // "img/lampara-2.jpg",
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
  id: "lampara-calientavelas",
  nombre: "Lámpara calientavelas Ámbar",
  subtitulo: "Tu vela favorita, sin llama, sin humo y durando hasta 3 veces más.",
  precio: 39.9,
  variantes: [
    { id: "negro", nombre: "Negro mate", metal: "#2b2724", brillo: "#4a443f" },
    { id: "dorado", nombre: "Dorado", metal: "#b8893e", brillo: "#e2c07d" },
    { id: "blanco", nombre: "Blanco roto", metal: "#e9e3da", brillo: "#ffffff" },
  ],
  // Packs con descuento real sobre el precio unitario
  packs: [
    { unidades: 1, etiqueta: "1 lámpara", descuento: 0 },
    { unidades: 2, etiqueta: "2 lámparas", descuento: 0.15, nota: "Una para ti y otra para regalar" },
    { unidades: 3, etiqueta: "3 lámparas", descuento: 0.25, nota: "La mejor opción para regalos" },
  ],
};
