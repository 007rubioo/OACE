// Píxel de Meta + consentimiento de cookies (RGPD/LSSI).
// El píxel solo se carga si TIENDA.metaPixelId está configurado Y el visitante acepta.

const CLAVE_CONSENTIMIENTO = "ambar_cookies"; // "si" | "no"

function leerConsentimiento() {
  try {
    return localStorage.getItem(CLAVE_CONSENTIMIENTO);
  } catch {
    return null;
  }
}
function guardarConsentimiento(valor) {
  try {
    localStorage.setItem(CLAVE_CONSENTIMIENTO, valor);
  } catch {
    /* sin almacenamiento: se volverá a preguntar */
  }
}

function cargarPixel() {
  if (window.fbq || !TIENDA.metaPixelId) return;
  // Código oficial del píxel de Meta
  !(function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = "2.0";
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
  fbq("init", TIENDA.metaPixelId);
  fbq("track", "PageView");
  (medir.cola || []).forEach(([e, p]) => fbq("track", e, p));
  medir.cola = [];
}

// Registra un evento estándar de Meta (ViewContent, AddToCart, InitiateCheckout, Purchase).
// Si el visitante aún no ha decidido sobre cookies, se guarda y se envía al aceptar.
function medir(evento, params) {
  if (!TIENDA.metaPixelId) return;
  const consentimiento = leerConsentimiento();
  if (consentimiento === "si" && window.fbq) fbq("track", evento, params);
  else if (consentimiento !== "no") (medir.cola = medir.cola || []).push([evento, params]);
}

function iniciarCookies() {
  if (!TIENDA.metaPixelId) return;
  const consentimiento = leerConsentimiento();
  if (consentimiento === "si") return cargarPixel();
  if (consentimiento === "no") return;
  const aviso = document.getElementById("cookies");
  if (!aviso) return;
  aviso.classList.remove("oculto");
  document.getElementById("cookies-si").onclick = () => {
    guardarConsentimiento("si");
    aviso.classList.add("oculto");
    cargarPixel();
  };
  document.getElementById("cookies-no").onclick = () => {
    guardarConsentimiento("no");
    aviso.classList.add("oculto");
    medir.cola = [];
  };
}
