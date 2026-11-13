# Tienda OACE

Tienda online sencilla hecha con HTML, CSS y JavaScript, sin dependencias.

## Funciones

- **Catálogo** con búsqueda y filtro por categoría; muestra el stock disponible.
- **Carrito** lateral: añadir, quitar y cambiar cantidades, con el total calculado.
- **Crear cuenta**: nombre, correo, contraseña (mín. 8 caracteres, una letra y un número), dirección y aceptación de términos. Comprueba que el correo no esté repetido.
- **Iniciar y cerrar sesión**. Las contraseñas se guardan cifradas con SHA-256 y una sal aleatoria, nunca en texto plano.
- **Finalizar compra**: pide iniciar sesión, permite elegir dirección y método de pago, y descuenta el stock.
- **Mis pedidos**: historial de compras del usuario.

## Cómo usarla

Abre `index.html` en el navegador, o sírvela en local:

```bash
cd tienda
python3 -m http.server 8000
# y abre http://localhost:8000
```

Para añadir o cambiar productos, edita `productos.js`.

## Limitaciones

Es una demo educativa: usuarios, carrito y pedidos se guardan en el `localStorage`
del navegador, así que solo existen en ese navegador y no hay pagos reales.
Para una tienda real hace falta un servidor con base de datos y una pasarela de pago.
