// Vista Contacto: validación de formulario + mapa con Leaflet

// --- Dominios de correo permitidos (mismos que login/registro) ---
const DOMINIOS_PERMITIDOS = ["duoc.cl", "profesor.duoc.cl", "gmail.com"];

const form = document.getElementById("form-contacto");
const inputNombre = document.getElementById("nombre");
const inputCorreo = document.getElementById("correo");
const inputComentario = document.getElementById("comentario");
const mensajeExito = document.getElementById("mensaje-exito");

function validarCorreo(correo) {
  const partes = correo.split("@");
  if (partes.length !== 2) return false;
  const dominio = partes[1].toLowerCase();
  return DOMINIOS_PERMITIDOS.includes(dominio);
}

function validarFormulario() {
  let valido = true;

  document.getElementById("error-nombre").textContent = "";
  document.getElementById("error-correo").textContent = "";
  document.getElementById("error-comentario").textContent = "";

  if (!inputNombre.value.trim()) {
    document.getElementById("error-nombre").textContent = "El nombre es obligatorio.";
    valido = false;
  } else if (inputNombre.value.length > 100) {
    document.getElementById("error-nombre").textContent = "Máximo 100 caracteres.";
    valido = false;
  }

  if (!inputCorreo.value.trim()) {
    document.getElementById("error-correo").textContent = "El correo es obligatorio.";
    valido = false;
  } else if (!validarCorreo(inputCorreo.value.trim())) {
    document.getElementById("error-correo").textContent =
      "Solo se aceptan correos @duoc.cl, @profesor.duoc.cl o @gmail.com.";
    valido = false;
  }

  if (!inputComentario.value.trim()) {
    document.getElementById("error-comentario").textContent = "El comentario es obligatorio.";
    valido = false;
  } else if (inputComentario.value.length > 500) {
    document.getElementById("error-comentario").textContent = "Máximo 500 caracteres.";
    valido = false;
  }

  return valido;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  mensajeExito.hidden = true;

  if (!validarFormulario()) return;

  
  mensajeExito.hidden = false;
  form.reset();
});

// --- Mapa con Leaflet ---
// Coordenadas de ejemplo: centro de Temuco, Chile
const COORDENADAS_CLINICA = [-38.7397, -72.5977];

const mapa = L.map("mapa").setView(COORDENADAS_CLINICA, 15);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
  maxZoom: 19,
}).addTo(mapa);

L.marker(COORDENADAS_CLINICA)
  .addTo(mapa)
  .bindPopup("Clínica NutriVida<br>Av. Alemania 671, Temuco")
  .openPopup();