# Sedalia — tienda de un solo producto

Tienda online para vender un **rizador sin calor**, hecha con HTML, CSS y JavaScript sin dependencias.

- Ficha de producto con elección de color y packs con descuento (1, 2 o 3 unidades).
- Fecha estimada de entrega y cuenta atrás hasta el último día para recibirlo en Navidad.
- Secciones de venta: beneficios, comparativa, cómo funciona, preguntas frecuentes y llamada final.
- Barra "Comprar ahora" fija en el móvil.
- Carrito lateral, **creación de cuenta** e inicio de sesión (contraseñas cifradas con SHA-256 y sal), checkout e historial de pedidos.

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `index.html` | Estructura y textos de la página |
| `styles.css` | Diseño |
| `productos.js` | **Configuración**: nombre, precio, colores, packs y fecha límite de Navidad |
| `app.js` | Lógica: carrito, cuentas, pedidos |
| `medicion.js` | Píxel de Meta y aviso de cookies |
| `gracias.html` | Página tras el pago (registra la compra en el píxel) |
| `legal.html` | Aviso legal, condiciones, envíos y devoluciones, privacidad y cookies |
| `PASOS-PARA-VENDER.md` | **Empieza aquí**: proveedor, Stripe, píxel, fotos, datos legales, números y anuncios |

## Probarla

```bash
cd tienda
python3 -m http.server 8000   # y abre http://localhost:8000
```

Sin configurar, funciona como demo (carrito, cuentas y pedidos en el navegador, sin cobros).
Al pegar los enlaces de pago de Stripe en `productos.js` pasa a **modo venta** con cobros reales:
sigue `PASOS-PARA-VENDER.md`.
