// Ámbar Casa — lógica de la tienda.
// Usuarios, sesión, carrito y pedidos se guardan en localStorage del navegador.
// Es una demo: en una tienda real, cuentas, pedidos y cobros van en un servidor.

const CLAVES = {
  usuarios: "ambar_usuarios",
  sesion: "ambar_sesion",
  carrito: "ambar_carrito",
  pedidos: "ambar_pedidos",
};

function leer(clave, porDefecto) {
  try {
    const v = localStorage.getItem(clave);
    return v === null ? porDefecto : JSON.parse(v);
  } catch {
    return porDefecto;
  }
}
function guardar(clave, valor) {
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
  } catch {
    /* sin almacenamiento: la tienda sigue funcionando en memoria */
  }
}

const estado = {
  usuarios: leer(CLAVES.usuarios, []),
  sesion: leer(CLAVES.sesion, null),
  carrito: leer(CLAVES.carrito, []), // [{ variante, unidades, cantidad }]
  pedidos: leer(CLAVES.pedidos, []),
  variante: PRODUCTO.variantes[0].id,
  unidades: PRODUCTO.packs[1].unidades, // por defecto se preselecciona el pack de 2
};

const $ = (s) => document.querySelector(s);
const euros = (n) => n.toLocaleString("es-ES", { style: "currency", currency: "EUR" });
const variante = (id) => PRODUCTO.variantes.find((v) => v.id === id) || PRODUCTO.variantes[0];
const pack = (u) => PRODUCTO.packs.find((p) => p.unidades === u) || PRODUCTO.packs[0];
const precioPack = (u) => Math.round(PRODUCTO.precio * u * (1 - pack(u).descuento) * 100) / 100;
const usuarioActual = () => estado.usuarios.find((u) => u.email === estado.sesion) || null;

function escapar(t) {
  const d = document.createElement("div");
  d.textContent = String(t);
  return d.innerHTML;
}
function avisar(msg) {
  const el = $("#aviso");
  el.textContent = msg;
  el.classList.add("visible");
  clearTimeout(avisar.t);
  avisar.t = setTimeout(() => el.classList.remove("visible"), 2600);
}

// ---------- Contraseñas (SHA-256 + sal aleatoria) ----------
const hex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
async function hashear(password, sal) {
  return hex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(sal + ":" + password)));
}
function nuevaSal() {
  return hex(crypto.getRandomValues(new Uint8Array(16)));
}

// ---------- Fechas de entrega ----------
function sumarDiasLaborables(fecha, dias) {
  const d = new Date(fecha);
  while (dias > 0) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0 && d.getDay() !== 6) dias--;
  }
  return d;
}
const fechaCorta = (d) => d.toLocaleDateString("es-ES", { weekday: "short", day: "numeric", month: "short" });

function pintarEntrega() {
  const hoy = new Date();
  $("#entrega").innerHTML =
    `Pídelo hoy y recíbelo entre el <strong>${fechaCorta(sumarDiasLaborables(hoy, 3))}</strong> ` +
    `y el <strong>${fechaCorta(sumarDiasLaborables(hoy, 6))}</strong>`;

  const limite = new Date(TIENDA.fechaLimiteNavidad);
  const dias = Math.ceil((limite - hoy) / 86400000);
  const el = $("#anuncio-navidad");
  if (dias < 0) el.textContent = "30 días para devolverla";
  else if (dias === 0) el.textContent = "Último día para recibirlo antes de Navidad";
  else
    el.textContent = `Quedan ${dias} días para pedir y recibirlo antes de Navidad`;
}

// ---------- Ficha de producto ----------
function aplicarColor(el, v) {
  el.style.setProperty("--metal", v.metal);
  el.style.setProperty("--brillo", v.brillo);
}

function pintarProducto() {
  $("#nombre-producto").textContent = PRODUCTO.nombre;
  $("#subtitulo").textContent = PRODUCTO.subtitulo;

  const v = variante(estado.variante);
  aplicarColor($("#lampara"), v);
  $("#color-nombre").textContent = v.nombre;
  $("#colores").innerHTML = PRODUCTO.variantes
    .map(
      (x) =>
        `<button class="color ${x.id === v.id ? "activo" : ""}" data-color="${x.id}" ` +
        `style="background:${x.metal}" aria-label="${escapar(x.nombre)}" aria-pressed="${x.id === v.id}"></button>`
    )
    .join("");

  $("#packs").innerHTML = packsDisponibles()
    .map((p) => {
      const total = precioPack(p.unidades);
      const sinDto = PRODUCTO.precio * p.unidades;
      const chip = p.unidades === 2 ? `<span class="chip">MÁS ELEGIDO</span>` : "";
      return `
      <button class="pack ${p.unidades === estado.unidades ? "activo" : ""}" data-pack="${p.unidades}">
        ${chip}
        <span class="radio"></span>
        <span><span class="titulo">${escapar(p.etiqueta)}</span>
          ${p.nota ? `<span class="nota-pack">${escapar(p.nota)}</span>` : ""}</span>
        <span class="p-precio">${euros(total)}
          ${p.descuento ? `<small>Ahorras ${euros(sinDto - total)}</small>` : ""}</span>
      </button>`;
    })
    .join("");

  const total = precioPack(estado.unidades);
  const p = pack(estado.unidades);
  $("#precio").textContent = euros(total);
  $("#barra-precio").textContent = euros(total);
  $("#ahorro").classList.toggle("oculto", !p.descuento);
  $("#ahorro").textContent = `−${Math.round(p.descuento * 100)} % por pack`;
}

// Miniatura del producto con el color de la variante (para el carrito)
function miniatura(idVariante) {
  const svg = $("#lampara").cloneNode(true);
  svg.removeAttribute("id");
  svg.querySelectorAll(".brillo-anim, .aroma").forEach((n) => n.classList.remove("brillo-anim", "aroma"));
  aplicarColor(svg, variante(idVariante));
  return `<span class="mini">${svg.outerHTML}</span>`;
}

// ---------- Carrito ----------
function guardarCarrito() {
  guardar(CLAVES.carrito, estado.carrito);
  pintarCarrito();
}

function anadirAlCarrito() {
  const linea = estado.carrito.find((l) => l.variante === estado.variante && l.unidades === estado.unidades);
  if (linea) linea.cantidad++;
  else estado.carrito.push({ variante: estado.variante, unidades: estado.unidades, cantidad: 1 });
  guardarCarrito();
  abrirCarrito();
  medir("AddToCart", datosEvento(estado.unidades));
}

function cambiarCantidad(i, delta) {
  const linea = estado.carrito[i];
  if (!linea) return;
  linea.cantidad += delta;
  if (linea.cantidad <= 0) estado.carrito.splice(i, 1);
  guardarCarrito();
}

const importeLinea = (l) => precioPack(l.unidades) * l.cantidad;
const totalCarrito = () => estado.carrito.reduce((s, l) => s + importeLinea(l), 0);
const descripcion = (l) => `${pack(l.unidades).etiqueta} · ${variante(l.variante).nombre}`;

function pintarCarrito() {
  const lamparas = estado.carrito.reduce((s, l) => s + l.unidades * l.cantidad, 0);
  $("#contador").textContent = lamparas;
  $("#total").textContent = euros(totalCarrito());
  $("#btn-checkout").disabled = !estado.carrito.length;
  $("#items-carrito").innerHTML = estado.carrito.length
    ? estado.carrito
        .map(
          (l, i) => `
      <li class="item">
        ${miniatura(l.variante)}
        <div>
          <p>${escapar(PRODUCTO.nombre)}</p>
          <p class="sub">${escapar(descripcion(l))}</p>
          <div class="cantidad">
            <button data-menos="${i}" aria-label="Quitar uno">−</button>
            <span>${l.cantidad}</span>
            <button data-mas="${i}" aria-label="Añadir uno">+</button>
          </div>
        </div>
        <span class="importe">${euros(importeLinea(l))}</span>
      </li>`
        )
        .join("")
    : `<li class="vacio">Tu carrito está vacío.</li>`;
}

function abrirCarrito() {
  $("#carrito").classList.add("abierto");
  $("#carrito").setAttribute("aria-hidden", "false");
  $("#velo").classList.remove("oculto");
}
function cerrarCarrito() {
  $("#carrito").classList.remove("abierto");
  $("#carrito").setAttribute("aria-hidden", "true");
  $("#velo").classList.add("oculto");
}

// ---------- Navegación ----------
const VISTAS = ["inicio", "cuenta", "checkout", "pedidos"];
let vistaActual = "inicio";
function mostrar(vista) {
  vistaActual = vista;
  VISTAS.forEach((v) => $("#vista-" + v).classList.toggle("oculto", v !== vista));
  cerrarCarrito();
  if (vista === "checkout") pintarCheckout();
  if (vista === "pedidos") pintarPedidos();
  actualizarBarraMovil();
  window.scrollTo(0, 0);
}

// La barra "Comprar ahora" del móvil aparece cuando el botón principal sale de pantalla
function actualizarBarraMovil() {
  const btn = $("#btn-anadir").getBoundingClientRect();
  const fuera = btn.bottom < 0 || btn.top > window.innerHeight;
  $("#barra-movil").classList.toggle("visible", vistaActual === "inicio" && fuera);
}

// ---------- Cuentas ----------
function pintarCabecera() {
  const u = usuarioActual();
  $("#saludo").textContent = u ? `Hola, ${u.nombre.split(" ")[0]}` : "";
  $("#btn-cuenta").classList.toggle("oculto", !!u || modoVenta);
  $("#btn-pedidos").classList.toggle("oculto", !u);
  $("#btn-salir").classList.toggle("oculto", !u);
}

function cambiarTab(tab) {
  document.querySelectorAll(".tab").forEach((t) => t.classList.toggle("activa", t.dataset.tab === tab));
  $("#form-login").classList.toggle("oculto", tab !== "login");
  $("#form-registro").classList.toggle("oculto", tab !== "registro");
  document.querySelectorAll("[data-error]").forEach((e) => (e.textContent = ""));
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function validarRegistro(d) {
  if (d.nombre.trim().length < 2) return "Introduce tu nombre completo.";
  if (!EMAIL_RE.test(d.email)) return "El correo electrónico no es válido.";
  if (estado.usuarios.some((u) => u.email === d.email)) return "Ya existe una cuenta con ese correo.";
  if (d.password.length < 8 || !/[a-zA-Z]/.test(d.password) || !/\d/.test(d.password))
    return "La contraseña debe tener al menos 8 caracteres, una letra y un número.";
  if (d.password !== d.password2) return "Las contraseñas no coinciden.";
  if (d.direccion.trim().length < 5) return "Introduce una dirección de envío válida.";
  if (!d.terminos) return "Debes aceptar los términos y la política de privacidad.";
  return null;
}

let destinoTrasLogin = "inicio";

async function registrar(e) {
  e.preventDefault();
  const f = e.target;
  const d = {
    nombre: f.nombre.value,
    email: f.email.value.trim().toLowerCase(),
    password: f.password.value,
    password2: f.password2.value,
    direccion: f.direccion.value,
    terminos: f.terminos.checked,
  };
  const error = validarRegistro(d);
  f.querySelector("[data-error]").textContent = error || "";
  if (error) return;
  const sal = nuevaSal();
  estado.usuarios.push({
    nombre: d.nombre.trim(),
    email: d.email,
    direccion: d.direccion.trim(),
    sal,
    hash: await hashear(d.password, sal),
    creado: new Date().toISOString(),
  });
  guardar(CLAVES.usuarios, estado.usuarios);
  f.reset();
  iniciarSesion(d.email);
  avisar("¡Cuenta creada! Bienvenido/a");
}

async function login(e) {
  e.preventDefault();
  const f = e.target;
  const email = f.email.value.trim().toLowerCase();
  const u = estado.usuarios.find((x) => x.email === email);
  const ok = u && (await hashear(f.password.value, u.sal)) === u.hash;
  f.querySelector("[data-error]").textContent = ok ? "" : "Correo o contraseña incorrectos.";
  if (!ok) return;
  f.reset();
  iniciarSesion(email);
  avisar("Sesión iniciada");
}

function iniciarSesion(email) {
  estado.sesion = email;
  guardar(CLAVES.sesion, email);
  pintarCabecera();
  mostrar(destinoTrasLogin);
  destinoTrasLogin = "inicio";
}

function salir() {
  estado.sesion = null;
  guardar(CLAVES.sesion, null);
  pintarCabecera();
  mostrar("inicio");
  avisar("Has cerrado sesión");
}

// ---------- Checkout ----------
function irACheckout() {
  if (!estado.carrito.length) return;
  medir("InitiateCheckout", { value: totalCarrito(), currency: "EUR" });
  if (!usuarioActual()) {
    destinoTrasLogin = "checkout";
    mostrar("cuenta");
    cambiarTab("registro");
    avisar("Crea tu cuenta o inicia sesión para terminar el pedido");
    return;
  }
  mostrar("checkout");
}

function pintarCheckout() {
  $("#resumen-checkout").innerHTML =
    estado.carrito
      .map((l) => `<div class="linea"><span>${escapar(descripcion(l))} × ${l.cantidad}</span><span>${euros(importeLinea(l))}</span></div>`)
      .join("") +
    `<div class="linea"><span>Envío</span><span>Gratis</span></div>` +
    `<div class="linea linea-total"><span>Total (IVA incl.)</span><span>${euros(totalCarrito())}</span></div>`;
  const u = usuarioActual();
  if (u) $("#form-checkout").direccion.value = u.direccion;
}

function confirmarPedido(e) {
  e.preventDefault();
  const f = e.target;
  const u = usuarioActual();
  if (!u) return irACheckout();
  if (!estado.carrito.length) return mostrar("inicio");
  if (f.direccion.value.trim().length < 5) {
    f.querySelector("[data-error]").textContent = "Introduce una dirección de envío válida.";
    return;
  }
  const pedido = {
    id: "AC-" + Date.now().toString(36).toUpperCase(),
    email: u.email,
    fecha: new Date().toISOString(),
    direccion: f.direccion.value.trim(),
    pago: f.pago.value,
    lineas: estado.carrito.map((l) => ({ texto: descripcion(l), cantidad: l.cantidad, importe: importeLinea(l) })),
    total: totalCarrito(),
  };
  estado.pedidos.push(pedido);
  guardar(CLAVES.pedidos, estado.pedidos);
  estado.carrito = [];
  guardarCarrito();
  f.querySelector("[data-error]").textContent = "";
  avisar(`Pedido ${pedido.id} confirmado. ¡Gracias!`);
  mostrar("pedidos");
}

function pintarPedidos() {
  const u = usuarioActual();
  const mios = estado.pedidos.filter((p) => u && p.email === u.email).reverse();
  $("#lista-pedidos").innerHTML = mios.length
    ? mios
        .map(
          (p) => `
    <article class="pedido">
      <h3>Pedido ${escapar(p.id)}</h3>
      <div class="meta">${new Date(p.fecha).toLocaleString("es-ES")} · ${escapar(p.pago)} · ${escapar(p.direccion)}</div>
      ${p.lineas.map((l) => `<div class="linea"><span>${escapar(l.texto)} × ${l.cantidad}</span><span>${euros(l.importe)}</span></div>`).join("")}
      <div class="linea linea-total"><span>Total</span><span>${euros(p.total)}</span></div>
    </article>`
        )
        .join("")
    : `<p class="vacio">Todavía no has hecho ningún pedido.</p>`;
}

// ---------- Modo venta (Stripe Payment Links) ----------
const modoVenta = Object.values(TIENDA.enlacesPago || {}).some(Boolean);

// En modo venta solo se muestran los packs que tienen enlace de pago
function packsDisponibles() {
  return modoVenta ? PRODUCTO.packs.filter((p) => TIENDA.enlacesPago[p.unidades]) : PRODUCTO.packs;
}

function datosEvento(unidades) {
  return {
    value: precioPack(unidades),
    currency: "EUR",
    content_ids: [PRODUCTO.id],
    content_type: "product",
    num_items: unidades,
  };
}

function comprarAhora() {
  const enlace = TIENDA.enlacesPago[estado.unidades];
  if (!enlace) return avisar("Este pack no está disponible ahora mismo");
  medir("InitiateCheckout", datosEvento(estado.unidades));
  const url = new URL(enlace);
  // El color elegido viaja a Stripe y aparece en el pago (client_reference_id)
  url.searchParams.set("client_reference_id", estado.variante);
  const boton = $("#btn-anadir");
  boton.disabled = true;
  boton.textContent = "Redirigiendo al pago seguro…";
  // Pequeña espera para que el píxel registre el evento antes de salir
  setTimeout(() => (location.href = url.toString()), 300);
}

function prepararModoVenta() {
  if (!modoVenta) return;
  const disponibles = packsDisponibles();
  if (!disponibles.some((p) => p.unidades === estado.unidades)) estado.unidades = disponibles[0].unidades;
  $("#btn-anadir").textContent = "Comprar ahora";
  $("#pago-seguro").classList.remove("oculto");
  // En modo venta Stripe gestiona el pago, el email y el recibo: sin carrito ni cuenta obligatoria
  ["#btn-carrito", "#btn-cuenta", "#saludo"].forEach((s) => $(s).classList.add("oculto"));
}

// ---------- Fotos reales ----------
function prepararFotos() {
  const fotos = TIENDA.fotos || [];
  if (!fotos.length) return;
  const caja = $("#foto");
  caja.classList.add("con-fotos");
  const img = document.createElement("img");
  img.src = fotos[0];
  img.alt = PRODUCTO.nombre;
  caja.appendChild(img);
  if (fotos.length > 1) {
    const miniaturas = document.createElement("div");
    miniaturas.className = "miniaturas";
    miniaturas.innerHTML = fotos
      .map((f, i) => `<button class="${i ? "" : "activa"}" data-foto="${i}"><img src="${escapar(f)}" alt="Foto ${i + 1}"></button>`)
      .join("");
    caja.after(miniaturas);
  }
}

// ---------- Eventos ----------
document.addEventListener("click", (e) => {
  const t = e.target.closest("button, a");
  if (!t) return;
  const d = t.dataset;
  if (d.foto) {
    $("#foto img").src = TIENDA.fotos[Number(d.foto)];
    document.querySelectorAll(".miniaturas button").forEach((b) => b.classList.toggle("activa", b === t));
  } else if (d.color) {
    estado.variante = d.color;
    pintarProducto();
  } else if (d.pack) {
    estado.unidades = Number(d.pack);
    pintarProducto();
  } else if (d.mas) cambiarCantidad(Number(d.mas), 1);
  else if (d.menos) cambiarCantidad(Number(d.menos), -1);
  else if (d.tab) cambiarTab(d.tab);
  else if ("subir" in d) {
    if (vistaActual !== "inicio") mostrar("inicio");
    $(".compra").scrollIntoView({ behavior: "smooth", block: "start" });
  } else if (d.view) {
    e.preventDefault();
    mostrar(d.view);
  }
});

$("#btn-anadir").addEventListener("click", () => (modoVenta ? comprarAhora() : anadirAlCarrito()));
$("#btn-cuenta").addEventListener("click", () => {
  mostrar("cuenta");
  cambiarTab("registro");
});
$("#btn-pedidos").addEventListener("click", () => mostrar("pedidos"));
$("#btn-salir").addEventListener("click", salir);
$("#btn-carrito").addEventListener("click", abrirCarrito);
$("#cerrar-carrito").addEventListener("click", cerrarCarrito);
$("#velo").addEventListener("click", cerrarCarrito);
$("#btn-checkout").addEventListener("click", irACheckout);
$("#form-registro").addEventListener("submit", registrar);
$("#form-login").addEventListener("submit", login);
$("#form-checkout").addEventListener("submit", confirmarPedido);
document.addEventListener("keydown", (e) => e.key === "Escape" && cerrarCarrito());
window.addEventListener("scroll", actualizarBarraMovil, { passive: true });

// ---------- Inicio ----------
const contacto = $("#enlace-contacto");
if (TIENDA.empresa.email.includes("@")) contacto.href = "mailto:" + TIENDA.empresa.email;
else contacto.href = "legal.html#aviso-legal";
prepararFotos();
prepararModoVenta();
pintarProducto();
pintarEntrega();
pintarCabecera();
pintarCarrito();
mostrar("inicio");
iniciarCookies();
medir("ViewContent", datosEvento(estado.unidades));
