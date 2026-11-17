# Pasos para empezar a vender

La tienda ya está preparada para cobrar de verdad, medir las ventas de tus anuncios y cumplir lo básico legal.
Solo tienes que rellenar la configuración de `productos.js`. Sigue los pasos en orden.

---

## Paso 1 — Proveedor

No he encontrado un proveedor con almacén en España confirmado para este producto. Estas son las opciones reales que encontré, de mejor a peor para empezar en Navidad:

| Opción | Qué es | Plazo a España | Ventaja | Pega |
|---|---|---|---|---|
| **A. Comprar stock pequeño a Flamingueo** (vía Faire) | Marca española que vende lámparas calientavelas con enchufe europeo. Tiene venta mayorista en Faire, con pedido mínimo de unos 90 £ | 1–3 días si envías tú | Llegas a Navidad sin problemas; producto ya probado (lo vende El Corte Inglés) | Es su marca: véndela como "Flamingueo" o pídeles marca blanca. Compites en precio con El Corte Inglés |
| **B. CJdropshipping, almacén en Polonia** | Dropshipping: tú no tocas el producto | Aprox. 5–10 días (confírmalo en la ficha) | Sin stock ni inversión inicial | Más lento; revisa la calidad con una muestra |
| **C. Syncee / Spocket** | Marketplaces con varias lámparas calientavelas | Depende del proveedor | Mucha variedad | No indican desde dónde envían: pregúntalo antes |

**Mi recomendación:** para esta Navidad, la **opción A** con 10–20 unidades. Las envías tú con Correos o SEUR y llegan en 1–3 días, lo que convierte mucho mejor en anuncios. Si se agotan rápido, pasa a la B, o pide marca blanca a un fabricante para el año que viene.

Al proveedor que elijas, pídele siempre:
- **marcado CE**;
- **enchufe europeo**;
- **instrucciones en español**;
- **una muestra** antes de vender.

No pude abrir las webs de Faire ni de los proveedores desde aquí, así que **confirma precio, stock y plazos tú mismo** antes de pagar nada.

## Paso 2 — Cobrar con Stripe (unos 30 minutos)

1. Crea tu cuenta en **stripe.com/es** y verifica tu identidad y tu cuenta bancaria. Para facturar necesitarás estar dado de alta como autónomo.
2. Ve a **Catálogo de productos → Añadir producto** y crea tres productos con el IVA incluido:
   - "Lámpara calientavelas — 1 unidad": 39,90 €
   - "Lámpara calientavelas — Pack 2": 67,83 €
   - "Lámpara calientavelas — Pack 3": 89,78 €
3. Ve a **Payment Links → Nuevo** y crea un enlace por producto. En cada uno:
   - Activa **Recopilar direcciones de envío** (País: España).
   - Activa **Recopilar números de teléfono**, que el transportista los pide.
   - En **Después del pago**, elige "No mostrar página de confirmación, redirigir a tu web" y pon
     `https://007rubioo.github.io/OACE/tienda/gracias.html?pack=1` (con `pack=2` y `pack=3` en los otros dos enlaces).
4. Copia los 3 enlaces (`https://buy.stripe.com/...`) y pégalos en `productos.js` → `enlacesPago`.

En cuanto pegues el primer enlace, la web cambia sola a **modo venta**:
- El botón pasa a ser **"Comprar ahora"** y lleva directamente al pago. Apple Pay y Google Pay funcionan sin configurar nada.
- Se ocultan el carrito y la cuenta obligatoria, porque cada paso extra hace perder ventas. Stripe ya pide el email y envía el recibo.
- El **color elegido** te llega en cada pago de Stripe en el campo *client_reference_id* (`negro`, `dorado` o `blanco`).
- Los packs sin enlace no se muestran.

## Paso 3 — Píxel de Meta, para tus anuncios (unos 10 minutos)

1. Ve a **Meta Business Suite → Administrador de eventos → Conectar orígenes de datos → Web** y crea el píxel.
2. Copia el **ID del píxel** (un número) y pégalo en `productos.js` → `metaPixelId`.
3. La web enviará automáticamente estos eventos:
   - `PageView` y `ViewContent` al entrar;
   - `InitiateCheckout` al pulsar "Comprar ahora";
   - **`Purchase` con el importe** al volver de Stripe.
4. En tus campañas, optimiza por **Compra (Purchase)**.

El píxel solo se activa si el visitante pulsa **"Aceptar"** en el aviso de cookies, como exige la ley. Ese aviso aparece solo cuando hay un píxel configurado.

## Paso 4 — Fotos reales

Las fotos reales de tu muestra venden mucho más que la ilustración.
1. Haz de 4 a 6 fotos: lámpara encendida de noche, plano de la cera fundida, sobre una mesita con una manta y detalle de los botones.
2. Súbelas a `tienda/img/` (formato .jpg, unos 1200 px de ancho).
3. Escribe sus rutas en `productos.js` → `fotos`. La galería con miniaturas aparece sola.

## Paso 5 — Datos legales

1. Rellena `productos.js` → `empresa` (titular, NIF, dirección y email). Esos datos aparecen solos en `legal.html`, en el pie de página y en la página de gracias.
2. Revisa `legal.html` y completa lo que va entre corchetes, como quién paga el envío de las devoluciones.
3. Si puedes, que lo mire tu gestor.

## Paso 6 — Publicar

1. Activa GitHub Pages (instrucciones en la conversación) o compra un dominio propio (unos 10 €/año, por ejemplo `ambarcasa.es`). Un dominio propio da más confianza en los anuncios.
2. Haz una compra de prueba con el **modo de prueba de Stripe** (tarjeta `4242 4242 4242 4242`).
3. Comprueba que llegas a la página de gracias y que el evento `Purchase` aparece en el Administrador de eventos.

## Paso 7 — Cuando entra un pedido

1. Stripe te avisa por email. En el pago verás el pack, el color (`client_reference_id`), la dirección y el teléfono.
2. Pide el producto al proveedor, o envíalo tú si tienes stock.
3. Envía al cliente un email con el número de seguimiento.
4. A los 7 días de la entrega, pide una reseña.

## Para tus anuncios

- **Tu límite:** cada venta de una unidad deja unos 17 € antes de publicidad. Si una venta te cuesta más de 17 € en anuncios, pierdes dinero. El pack de 2 aguanta unos 25 €.
- **Enlaza los anuncios a la página principal**, que ya trae preseleccionado el pack de 2.
- **Ganchos que suelen funcionar con este producto:**
  - "Deja de encender velas";
  - "El regalo que todos me piden";
  - "Mi vela dura el triple";
  - "Si tienes gato, necesitas esto".
- **Fecha límite de Navidad:** la cuenta atrás de la barra superior acaba el **18 de diciembre**. Ajústala en `fechaLimiteNavidad` según los plazos reales de tu proveedor.
