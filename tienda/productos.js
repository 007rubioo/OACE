// Configuración de la tienda. Cambia aquí nombre, precios, variantes y fechas.
const TIENDA = {
  marca: "Ámbar Casa", // nombre provisional: comprueba que esté libre en la OEPM antes de usarlo
  envioGratisDesde: 0, // 0 = envío gratis siempre
  // Último día para pedir y recibir antes de Navidad (ajústalo a los plazos reales de tu proveedor)
  fechaLimiteNavidad: "2026-12-18T23:59:59",
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
