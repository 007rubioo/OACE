# Pasos para empezar a vender

La tienda ya está preparada para cobrar de verdad, medir las ventas de tus anuncios y cumplir lo básico legal.
Solo tienes que rellenar la configuración de `productos.js`. Sigue los pasos en orden.

---

## Paso 1 — Proveedor del rizador sin calor

Es un producto muy común, así que hay muchos proveedores. Lo importante es que **envíe desde Europa**: si sale desde China tarda 10–20 días y no llega a Navidad.

| Opción | Qué es | Cómo encontrarlo |
|---|---|---|
| **A. CJdropshipping** (recomendada para empezar) | Dropshipping: tú no tocas el producto. Tiene almacenes en la UE | Busca "heatless curling rod" y filtra por **Ship from: Poland / Germany / Spain**. Pide 1–2 muestras |
| **B. Qogita** (B2B, UE) | Mayorista europeo. Tiene un rizador sin calor de espuma y microfibra (marca COOLCURL) con código de barras polaco | qogita.com → busca "heatless curling rod" (necesitas registrarte como empresa) |
| **C. Comprar 20–30 unidades** y enviarlas tú | Es ligero y barato: puedes tener stock en casa | AliExpress o Alibaba (proveedores con "Envío desde España"). Envías tú con Correos en 1–3 días |

**Mi recomendación:**
- Pide **muestras de 2 proveedores** de la opción A y quédate con el de mejor satén y relleno.
- Si los anuncios funcionan, compra stock (opción C), porque así envías en 24 h y ganas más por venta.

Antes de vender, comprueba con la muestra:
- que el relleno sea suave para dormir;
- que el satén no se enganche;
- que los coleteros aguanten;
- que el producto que llega coincida con los textos de la web. Si algo no coincide (lo que incluye, los colores), cámbialo en `productos.js`.

No pude abrir las webs de los proveedores desde aquí, así que **confirma tú el precio, el stock y los plazos** antes de pagar.

## Paso 2 — Cobrar con Stripe (unos 30 minutos)

1. Crea tu cuenta en **stripe.com/es** y verifica tu identidad y tu cuenta bancaria. Para facturar necesitarás estar dado de alta como autónomo.
2. Ve a **Catálogo de productos → Añadir producto** y crea tres productos con el IVA incluido:
   - "Rizador sin calor — 1 unidad": 19,95 €
   - "Rizador sin calor — Pack 2": 29,95 €
   - "Rizador sin calor — Pack 3": 39,95 €
3. Ve a **Payment Links → Nuevo** y crea un enlace por producto. En cada uno:
   - Activa **Recopilar direcciones de envío** (País: España).
   - Activa **Recopilar números de teléfono**, que el transportista los pide.
   - En **Después del pago**, elige "No mostrar página de confirmación, redirigir a tu web" y pon
     `https://007rubioo.github.io/OACE/tienda/gracias.html?pack=1` (con `pack=2` y `pack=3` en los otros dos enlaces).
4. Copia los 3 enlaces (`https://buy.stripe.com/...`) y pégalos en `productos.js` → `enlacesPago`.

En cuanto pegues el primer enlace, la web cambia sola a **modo venta**:
- El botón pasa a ser **"Comprar ahora"** y lleva directamente al pago. Apple Pay y Google Pay funcionan sin configurar nada.
- Se ocultan el carrito y la cuenta obligatoria, porque cada paso extra hace perder ventas. Stripe ya pide el email y envía el recibo.
- El **color elegido** te llega en cada pago de Stripe en el campo *client_reference_id* (`rosa`, `champan` o `negro`).
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
1. Haz de 4 a 6 fotos:
   - el rizador solo, sobre fondo claro;
   - puesto en la cabeza;
   - el pelo antes y después;
   - el contenido de la caja con la bolsa de regalo.
2. Súbelas a `tienda/img/` (formato .jpg, unos 1200 px de ancho).
3. Escribe sus rutas en `productos.js` → `fotos`. La galería con miniaturas aparece sola.

## Paso 5 — Datos legales

1. Rellena `productos.js` → `empresa` (titular, NIF, dirección y email). Esos datos aparecen solos en `legal.html`, en el pie de página y en la página de gracias.
2. Revisa `legal.html` y completa lo que va entre corchetes, como quién paga el envío de las devoluciones.
3. Si puedes, que lo mire tu gestor.

## Paso 6 — Publicar

1. Activa GitHub Pages (instrucciones en la conversación) o compra un dominio propio (unos 10 €/año, por ejemplo `sedalia.es`). Un dominio propio da más confianza en los anuncios.
2. Haz una compra de prueba con el **modo de prueba de Stripe** (tarjeta `4242 4242 4242 4242`).
3. Comprueba que llegas a la página de gracias y que el evento `Purchase` aparece en el Administrador de eventos.

## Paso 7 — Cuando entra un pedido

1. Stripe te avisa por email. En el pago verás el pack, el color (`client_reference_id`), la dirección y el teléfono.
2. Pide el producto al proveedor, o envíalo tú si tienes stock.
3. Envía al cliente un email con el número de seguimiento.
4. A los 7 días de la entrega, pide una reseña.

## Números (estimación: confírmalos con tu proveedor)

| | 1 rizador | Pack 2 | Pack 3 |
|---|---|---|---|
| Precio (IVA incluido) | 19,95 € | 29,95 € | 39,95 € |
| Sin IVA (÷ 1,21) | 16,49 € | 24,75 € | 33,02 € |
| Producto + envío (estimación) | −8 € | −12 € | −16 € |
| Comisión de Stripe (~2 %) | −0,55 € | −0,70 € | −0,85 € |
| **Margen antes de publicidad** | **≈ 8 €** | **≈ 12 €** | **≈ 16 €** |

Al ser más barato que la lámpara, se vende más fácil, pero **cada venta deja menos**. Por eso el pack de 2 va preseleccionado: es lo que hace rentable el producto.

## Para tus anuncios

- **Tu límite (CPA):** si cada venta te cuesta en anuncios más de **10–12 €**, pierdes dinero. Como referencia, el pack de 2 aguanta unos 12 €.
- **Público:** mujeres de 18 a 45 años en España, con segmentación amplia. Más adelante, prueba también "regalos para mujer" con hombres de 25 a 55.
- **El vídeo es lo que vende:** antes y después en la misma toma (pelo liso → se lo pone → al día siguiente, ondas).
- **Ganchos para los primeros 2 segundos:**
  - "Deja de quemarte el pelo con la plancha"
  - "Me pongo esto antes de dormir y mira cómo me levanto"
  - "El regalo de Navidad que todas me están pidiendo"
  - "Ondas de peluquería por menos de 15 €"
- **Enlaza los anuncios a la página principal**, que ya trae preseleccionado el pack de 2.
- **Navidad:** la cuenta atrás de la barra superior acaba el **18 de diciembre**. Ajústala en `fechaLimiteNavidad` según los plazos reales de tu proveedor.
