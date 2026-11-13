// Tienda OACE — lógica de la aplicación.
// Todos los datos (usuarios, sesión, carrito, pedidos, stock) se guardan en
// localStorage del navegador. Es una demo educativa: en una tienda real las
// cuentas y los pedidos deben gestionarse en un servidor.

const CLAVES = {
  usuarios: "oace_usuarios",
  sesion: "oace_sesion",
  carrito: "oace_carrito",
  pedidos: "oace_pedidos",
  stock: "oace_stock",
};

// ---------- Almacenamiento ----------
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
    /* almacenamiento no disponible: la app sigue funcionando en memoria */
  }
}

// ---------- Estado ----------
const estado = {
  usuarios: leer(CLAVES.usuarios, []),
  sesion: leer(CLAVES.sesion, null), // email del usuario conectado
  carrito: leer(CLAVES.carrito, []), // [{ id, cantidad }]
  pedidos: leer(CLAVES.pedidos, []),
  stock: leer(CLAVES.stock, Object.fromEntries(PRODUCTOS.map((p) => [p.id, p.stock]))),
  categoria: "Todas",
  busqueda: "",
};

const $ = (sel) => document.querySelector(sel);
const euros = (n) => n.toLocaleString("es-ES", { style: "currency", currency: "EUR" });
const producto = (id) => PRODUCTOS.find((p) => p.id === id);
const usuarioActual = () => estado.usuarios.find((u) => u.email === estado.sesion) || null;

function escapar(texto) {
  const d = document.createElement("div");
  d.textContent = String(texto);
  return d.innerHTML;
}

function avisar(msg) {
  const el = $("#aviso");
  el.textContent = msg;
  el.classList.add("visible");
  clearTimeout(avisar.t);
  avisar.t = setTimeout(() => el.classList.remove("visible"), 2500);
}

// ---------- Contraseñas ----------
// SHA-256 con sal aleatoria por usuario. Nunca se guarda la contraseña en claro.
async function hashear(password, sal) {
  const datos = new TextEncoder().encode(sal + ":" + password);
  const buffer = await crypto.subtle.digest("SHA-256", datos);
  return [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
function nuevaSal() {
  const a = new Uint8Array(16);
  crypto.getRandomValues(a);
  return [...a].map((b) => b.toString(16).padStart(2, "0")).join("");
}

// ---------- Navegación ----------
const VISTAS = ["catalogo", "cuenta", "checkout", "pedidos"];
function mostrar(vista) {
  VISTAS.forEach((v) => $("#vista-" + v).classList.toggle("oculto", v !== vista));
  cerrarCarrito();
  if (vista === "catalogo") pintarCatalogo();
  if (vista === "checkout") pintarCheckout();
  if (vista === "pedidos") pintarPedidos();
  window.scrollTo(0, 0);
}

// ---------- Catálogo ----------
function pintarFiltros() {
  const cats = ["Todas", ...new Set(PRODUCTOS.map((p) => p.categoria))];
  $("#filtros").innerHTML = cats
    .map(
      (c) =>
        `<button class="filtro ${c === estado.categoria ? "activo" : ""}" data-cat="${escapar(c)}">${escapar(c)}</button>`
    )
    .join("");
}

function pintarCatalogo() {
  pintarFiltros();
  const q = estado.busqueda.trim().toLowerCase();
  const lista = PRODUCTOS.filter(
    (p) =>
      (estado.categoria === "Todas" || p.categoria === estado.categoria) &&
      (!q || p.nombre.toLowerCase().includes(q) || p.categoria.toLowerCase().includes(q))
  );
  if (!lista.length) {
    $("#productos").innerHTML = `<p class="vacio">No hay productos que coincidan.</p>`;
    return;
  }
  $("#productos").innerHTML = lista
    .map((p) => {
      const disp = disponible(p.id);
      return `
      <article class="producto">
        <div class="img" aria-hidden="true">${p.emoji}</div>
        <h3>${escapar(p.nombre)}</h3>
        <span class="cat">${escapar(p.categoria)}</span>
        <span class="precio">${euros(p.precio)}</span>
        <span class="stock">${disp > 0 ? `Quedan ${disp}` : "Agotado"}</span>
        <button class="btn" data-anadir="${p.id}" ${disp > 0 ? "" : "disabled"}>Añadir al carrito</button>
      </article>`;
    })
    .join("");
}

// ---------- Carrito ----------
function enCarrito(id) {
  const linea = estado.carrito.find((l) => l.id === id);
  return linea ? linea.cantidad : 0;
}
function disponible(id) {
  return (estado.stock[id] ?? 0) - enCarrito(id);
}
function guardarCarrito() {
  guardar(CLAVES.carrito, estado.carrito);
  pintarCarrito();
  if (!$("#vista-catalogo").classList.contains("oculto")) pintarCatalogo();
}

function anadir(id) {
  if (disponible(id) <= 0) return avisar("No queda más stock de este producto");
  const linea = estado.carrito.find((l) => l.id === id);
  if (linea) linea.cantidad++;
  else estado.carrito.push({ id, cantidad: 1 });
  guardarCarrito();
  avisar(`«${producto(id).nombre}» añadido al carrito`);
}

function cambiarCantidad(id, delta) {
  const linea = estado.carrito.find((l) => l.id === id);
  if (!linea) return;
  if (delta > 0 && disponible(id) <= 0) return avisar("No queda más stock");
  linea.cantidad += delta;
  if (linea.cantidad <= 0) estado.carrito = estado.carrito.filter((l) => l.id !== id);
  guardarCarrito();
}

function totalCarrito() {
  return estado.carrito.reduce((s, l) => s + producto(l.id).precio * l.cantidad, 0);
}

function pintarCarrito() {
  const unidades = estado.carrito.reduce((s, l) => s + l.cantidad, 0);
  $("#contador").textContent = unidades;
  $("#total").textContent = euros(totalCarrito());
  $("#btn-checkout").disabled = unidades === 0;
  if (!unidades) {
    $("#items-carrito").innerHTML = `<li class="vacio">Tu carrito está vacío.</li>`;
    return;
  }
  $("#items-carrito").innerHTML = estado.carrito
    .map((l) => {
      const p = producto(l.id);
      return `
      <li class="item">
        <span class="img" aria-hidden="true">${p.emoji}</span>
        <div class="info">
          <p>${escapar(p.nombre)}</p>
          <p class="sub">${euros(p.precio)} × ${l.cantidad} = ${euros(p.precio * l.cantidad)}</p>
        </div>
        <div class="cantidad">
          <button data-menos="${p.id}" aria-label="Quitar uno">−</button>
          <span>${l.cantidad}</span>
          <button data-mas="${p.id}" aria-label="Añadir uno">+</button>
        </div>
      </li>`;
    })
    .join("");
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

// ---------- Cuentas ----------
function pintarCabecera() {
  const u = usuarioActual();
  $("#saludo").textContent = u ? `Hola, ${u.nombre.split(" ")[0]}` : "";
  $("#btn-cuenta").classList.toggle("oculto", !!u);
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
  if (!d.terminos) return "Debes aceptar los términos y condiciones.";
  return null;
}

// Tras iniciar sesión o registrarse, si había un checkout pendiente se retoma.
let destinoTrasLogin = "catalogo";

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
  iniciarSesion(d.email);
  f.reset();
  avisar("¡Cuenta creada! Bienvenido/a a Tienda OACE");
}

async function login(e) {
  e.preventDefault();
  const f = e.target;
  const email = f.email.value.trim().toLowerCase();
  const u = estado.usuarios.find((x) => x.email === email);
  const ok = u && (await hashear(f.password.value, u.sal)) === u.hash;
  f.querySelector("[data-error]").textContent = ok ? "" : "Correo o contraseña incorrectos.";
  if (!ok) return;
  iniciarSesion(email);
  f.reset();
  avisar("Sesión iniciada");
}

function iniciarSesion(email) {
  estado.sesion = email;
  guardar(CLAVES.sesion, email);
  pintarCabecera();
  mostrar(destinoTrasLogin);
  destinoTrasLogin = "catalogo";
}

function salir() {
  estado.sesion = null;
  guardar(CLAVES.sesion, null);
  pintarCabecera();
  mostrar("catalogo");
  avisar("Has cerrado sesión");
}

// ---------- Checkout ----------
function irACheckout() {
  if (!estado.carrito.length) return;
  if (!usuarioActual()) {
    destinoTrasLogin = "checkout";
    mostrar("cuenta");
    cambiarTab("login");
    avisar("Inicia sesión o crea una cuenta para finalizar la compra");
    return;
  }
  mostrar("checkout");
}

function pintarCheckout() {
  const lineas = estado.carrito
    .map((l) => {
      const p = producto(l.id);
      return `<div class="linea"><span>${escapar(p.nombre)} × ${l.cantidad}</span><span>${euros(p.precio * l.cantidad)}</span></div>`;
    })
    .join("");
  $("#resumen-checkout").innerHTML =
    lineas + `<div class="linea linea-total"><span>Total</span><span>${euros(totalCarrito())}</span></div>`;
  const u = usuarioActual();
  if (u) $("#form-checkout").direccion.value = u.direccion;
}

function confirmarPedido(e) {
  e.preventDefault();
  const f = e.target;
  const u = usuarioActual();
  if (!u) return irACheckout();
  if (!estado.carrito.length) return mostrar("catalogo");
  if (f.direccion.value.trim().length < 5) {
    f.querySelector("[data-error]").textContent = "Introduce una dirección de envío válida.";
    return;
  }
  const pedido = {
    id: "P" + Date.now().toString(36).toUpperCase(),
    email: u.email,
    fecha: new Date().toISOString(),
    direccion: f.direccion.value.trim(),
    pago: f.pago.value,
    lineas: estado.carrito.map((l) => ({ ...l, precio: producto(l.id).precio, nombre: producto(l.id).nombre })),
    total: totalCarrito(),
  };
  estado.carrito.forEach((l) => (estado.stock[l.id] -= l.cantidad));
  estado.pedidos.push(pedido);
  estado.carrito = [];
  guardar(CLAVES.stock, estado.stock);
  guardar(CLAVES.pedidos, estado.pedidos);
  guardarCarrito();
  f.querySelector("[data-error]").textContent = "";
  avisar(`Pedido ${pedido.id} confirmado. ¡Gracias por tu compra!`);
  mostrar("pedidos");
}

function pintarPedidos() {
  const u = usuarioActual();
  const mios = estado.pedidos.filter((p) => u && p.email === u.email).reverse();
  if (!mios.length) {
    $("#lista-pedidos").innerHTML = `<p class="vacio">Todavía no has hecho ningún pedido.</p>`;
    return;
  }
  $("#lista-pedidos").innerHTML = mios
    .map(
      (p) => `
    <article class="pedido">
      <h3>Pedido ${escapar(p.id)}</h3>
      <div class="meta">${new Date(p.fecha).toLocaleString("es-ES")} · ${escapar(p.pago)} · ${escapar(p.direccion)}</div>
      ${p.lineas
        .map(
          (l) =>
            `<div class="linea"><span>${escapar(l.nombre)} × ${l.cantidad}</span><span>${euros(l.precio * l.cantidad)}</span></div>`
        )
        .join("")}
      <div class="linea linea-total"><span>Total</span><span>${euros(p.total)}</span></div>
    </article>`
    )
    .join("");
}

// ---------- Eventos ----------
document.addEventListener("click", (e) => {
  const t = e.target.closest("button, a");
  if (!t) return;
  if (t.dataset.anadir) anadir(Number(t.dataset.anadir));
  else if (t.dataset.mas) cambiarCantidad(Number(t.dataset.mas), 1);
  else if (t.dataset.menos) cambiarCantidad(Number(t.dataset.menos), -1);
  else if (t.dataset.cat) {
    estado.categoria = t.dataset.cat;
    pintarCatalogo();
  } else if (t.dataset.tab) cambiarTab(t.dataset.tab);
  else if (t.dataset.view) {
    e.preventDefault();
    mostrar(t.dataset.view);
  }
});

$("#buscar").addEventListener("input", (e) => {
  estado.busqueda = e.target.value;
  if ($("#vista-catalogo").classList.contains("oculto")) mostrar("catalogo");
  else pintarCatalogo();
});
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

// ---------- Inicio ----------
pintarCabecera();
pintarCarrito();
mostrar("catalogo");
