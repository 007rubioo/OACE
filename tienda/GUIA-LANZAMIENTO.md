# Guía de lanzamiento — Lámpara calientavelas

Plan para pasar de la tienda de demo a las primeras ventas reales.
Las cifras son **estimaciones**: compruébalas con tu proveedor antes de decidir.

---

## 1. Por qué este producto

- **Demanda alta y actual**: los calentadores de velas ("candle warmer") están entre las 5 búsquedas de producto más altas en 2026.
- **Temporada perfecta**: noviembre–diciembre es temporada de velas, hogar y regalos.
- **Muy visual**: el contraste "luz cálida + vela fundiéndose" funciona muy bien en vídeo corto (TikTok, Reels).
- **Margen suficiente**: coste aproximado de 12–18 €, precio de venta de 35–45 €.
- **Pocos problemas legales** en comparación con suplementos, cosmética o juguetes.

Productos alternativos, por si este no te convence: masajeador de cuello, lámpara de luz roja, accesorios para mascotas o un organizador de cocina.

## 2. Validar antes de gastar (1–3 días)

1. Busca "candle warmer lamp" y "lámpara calientavelas" en **Google Trends** (región España) y confirma que la curva sube en noviembre y diciembre.
2. Busca el mismo término en **TikTok** e **Instagram** y anota los vídeos con más de 100 000 visualizaciones y qué ángulo usan (regalo, decoración, seguridad).
3. Busca el término en la **Biblioteca de anuncios de Meta** (facebook.com/ads/library). Si hay tiendas que llevan semanas con el mismo anuncio activo, es que les está siendo rentable.
4. Mira **Amazon.es**: precio de la competencia y, sobre todo, las **reseñas negativas**. Te dicen qué evitar (bombilla que se funde, cable corto, poca altura).

## 3. Proveedor (lo más importante)

- **Almacén en la UE o en España**: entrega en 3–7 días. Si envías desde China (10–20 días) **no llegas a Navidad** y recibirás quejas.
  - Dónde buscar: CJdropshipping (almacén en la UE), BigBuy, Spocket, o fabricantes en Alibaba con stock en Europa.
- **Pide 1 o 2 muestras** antes de vender. Sirven para comprobar la calidad y para grabar tus propios vídeos y fotos.
- **Exige**:
  - marcado **CE** y certificados RoHS (es un aparato eléctrico que se calienta);
  - enchufe europeo;
  - instrucciones en español;
  - bombillas de repuesto disponibles.
- Comprueba con tus muestras las afirmaciones de la web ("hasta 3 veces más", temporizador, atenuador). Si algo no se cumple, cámbialo en `index.html`.

## 4. Números (ejemplo)

| Concepto | 1 lámpara | Pack de 2 |
|---|---|---|
| Precio de venta (IVA incluido) | 39,90 € | 67,83 € |
| Sin IVA (÷ 1,21) | 32,98 € | 56,06 € |
| Producto + envío (estimación) | −15,00 € | −30,00 € |
| Comisión de pago (~2 %) | −0,80 € | −1,35 € |
| **Margen antes de publicidad** | **≈ 17 €** | **≈ 25 €** |

- **CPA de equilibrio** (lo máximo que puedes pagar en anuncios por cada venta) ≈ 17 €. Si cada venta te cuesta más en publicidad, pierdes dinero.
- Por eso el pack de 2 aparece preseleccionado: sube el ticket medio y el margen.

## 5. Legal en España (mínimo imprescindible)

- **Alta**: para vender de forma habitual tienes que darte de alta como autónomo (Hacienda + Seguridad Social) o constituir una sociedad. Pregunta a un gestor; la cuota inicial con tarifa plana es reducida.
- **Textos legales** en la web: aviso legal, política de privacidad (RGPD), política de cookies y condiciones de venta.
- **Devoluciones**: la ley exige un mínimo de **14 días**; la web ofrece 30, lo cual es válido como mejora. La garantía legal es de **3 años** (la web ya lo indica).
- **Precios honestos**: no muestres un precio tachado "antes" inventado. La ley (Directiva Omnibus) obliga a que el precio anterior sea el más bajo de los últimos 30 días. Por eso la tienda usa descuentos por pack, que son reales.
- **Reseñas**: no publiques reseñas inventadas; es ilegal. Pide reseñas a tus primeros clientes por email una semana después de la entrega.
- **Marca**: comprueba en la **OEPM** que el nombre que elijas esté libre ("Ámbar Casa" es provisional).

## 6. Montar la tienda real (elige una opción)

**Opción A — Shopify (recomendada para empezar rápido)**
- Incluye pagos con tarjeta, Bizum y PayPal, gestión de pedidos, emails automáticos y plantillas de textos legales.
- Usa el tema gratuito "Dawn" y copia la estructura de esta tienda: hero, packs, beneficios, comparativa, FAQ y llamada final.
- Conecta la app de tu proveedor (CJ, Spocket…) para que los pedidos se envíen solos.

**Opción B — Esta misma web**
- Publícala gratis en Netlify o GitHub Pages.
- Sustituye el checkout de demo por **Stripe Payment Links**: crea un enlace por pack en Stripe y pon ese enlace en el botón.
- Es más barata (no hay cuota mensual), pero tendrás que gestionar a mano los pedidos y los emails.

## 7. Contenido y fotos

- Graba con la muestra, con luz cálida y de noche: vela fundiéndose, plano cenital de la cera, mano encendiendo la lámpara, sofá con manta.
- Haz 5–10 vídeos de 15–30 segundos con ganchos distintos en los primeros 2 segundos:
  - "Deja de encender velas"
  - "El regalo que todos me han pedido"
  - "Mi vela me dura 3 veces más"
  - "Si tienes gato, necesitas esto"
- Sustituye la ilustración de la web por tus fotos reales (en `index.html`, el bloque `<svg id="lampara">`).

## 8. Conseguir las primeras ventas

1. **Orgánico (gratis)**: publica 1–3 vídeos al día en TikTok y Reels durante 2 semanas. Esto te dice qué gancho funciona antes de pagar anuncios.
2. **Anuncios de Meta (Facebook/Instagram)**:
   - Presupuesto de prueba: 20–30 €/día.
   - Monta 3–5 anuncios con los vídeos que mejor funcionaron en orgánico.
   - Segmentación amplia en España, con mayores de 25 años.
   - Mira los resultados tras 3–4 días o unos 60–100 € gastados. Apaga los anuncios con CPA mayor de 17 € y sube un 20–30 % el presupuesto de los que estén por debajo.
3. **Métricas a vigilar**:
   - CTR > 1,5 %;
   - coste por añadir al carrito;
   - conversión de la web > 2 %;
   - CPA < 17 €.
4. **Después de vender**:
   - email con el seguimiento del envío;
   - email pidiendo reseña a los 7 días;
   - oferta de velas aromáticas como segundo producto para subir el valor de cada cliente.

## 9. Calendario sugerido (desde hoy, 13 de noviembre)

| Fecha | Tarea |
|---|---|
| 13–16 nov | Validación + pedir muestras a un proveedor con almacén en la UE |
| 17–23 nov | Alta, tienda en Shopify, textos legales, grabar contenido con la muestra |
| 24 nov–1 dic | Lanzamiento con orgánico + anuncios (Black Friday / Cyber Monday) |
| 1–18 dic | Escalar lo que funcione; último día de pedido para Navidad: 18 dic |
| Enero | Analizar resultados, añadir velas como segundo producto |
