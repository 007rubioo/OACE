# Ámbar Casa — tienda de un solo producto

Tienda online para vender una **lámpara calientavelas**, hecha con HTML, CSS y JavaScript sin dependencias.

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
| `GUIA-LANZAMIENTO.md` | Plan paso a paso para empezar a vender |

## Probarla

```bash
cd tienda
python3 -m http.server 8000   # y abre http://localhost:8000
```

Es una demo: los datos se guardan en el navegador y **no hay cobros reales**.
Para vender de verdad, sigue el apartado 6 de la guía.
