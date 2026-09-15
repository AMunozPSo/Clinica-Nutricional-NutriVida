// Mantenedor de servicios — CRUD con localStorage (sin backend en esta entrega)

const STORAGE_KEY = "nutrivida_servicios";

const btnNuevo = document.getElementById("btn-nuevo");
const modal = document.getElementById("modal-servicio");
const modalTitulo = document.getElementById("modal-titulo");
const btnCancelar = document.getElementById("btn-cancelar");
const form = document.getElementById("form-servicio");
const tablaBody = document.getElementById("tabla-servicios-body");
const mensajeVacio = document.getElementById("mensaje-vacio");
const inputId = document.getElementById("servicio-id");

// --- Datos de ejemplo iniciales (solo si localStorage está vacío) ---
const SERVICIOS_INICIALES = [
  { id: 1, nombre: "Consulta nutricional inicial", categoria: "Control de Peso", modalidad: "Presencial", precio: 25000, duracion: 45, descripcion: "Evaluación completa y plan personalizado." },
  { id: 2, nombre: "Plan deportivo mensual", categoria: "Nutrición Deportiva", modalidad: "Online", precio: 40000, duracion: 30, descripcion: "Seguimiento nutricional para deportistas." },
];

// --- Utilidades de almacenamiento ---
function obtenerServicios() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    guardarServicios(SERVICIOS_INICIALES);
    return SERVICIOS_INICIALES;
  }
  return JSON.parse(data);
}

function guardarServicios(servicios) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(servicios));
}

function generarNuevoId(servicios) {
  return servicios.length > 0 ? Math.max(...servicios.map(s => s.id)) + 1 : 1;
}

// --- Formato de precio en pesos chilenos ---
function formatearPrecio(precio) {
  return precio.toLocaleString("es-CL", { style: "currency", currency: "CLP" });
}

// --- Renderizado de la tabla ---
function renderTabla() {
  const servicios = obtenerServicios();
  tablaBody.innerHTML = "";

  mensajeVacio.hidden = servicios.length > 0;

  servicios.forEach((servicio) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${servicio.nombre}</td>
      <td>${servicio.categoria}</td>
      <td>${servicio.modalidad}</td>
      <td>${formatearPrecio(servicio.precio)}</td>
      <td>${servicio.duracion} min</td>
      <td>
        <button class="btn btn--secondary btn-editar" data-id="${servicio.id}">Editar</button>
        <button class="btn btn--secondary btn-eliminar" data-id="${servicio.id}">Eliminar</button>
      </td>
    `;
    tablaBody.appendChild(fila);
  });
}

// --- Abrir modal (nuevo o edición) ---
function abrirModal(servicio = null) {
  form.reset();
  limpiarErrores();

  if (servicio) {
    modalTitulo.textContent = "Editar servicio";
    inputId.value = servicio.id;
    document.getElementById("nombre").value = servicio.nombre;
    document.getElementById("categoria").value = servicio.categoria;
    document.getElementById("modalidad").value = servicio.modalidad;
    document.getElementById("precio").value = servicio.precio;
    document.getElementById("duracion").value = servicio.duracion;
    document.getElementById("descripcion").value = servicio.descripcion;
  } else {
    modalTitulo.textContent = "Nuevo servicio";
    inputId.value = "";
  }

  modal.hidden = false;
}

function cerrarModal() {
  modal.hidden = true;
}

function limpiarErrores() {
  document.querySelectorAll(".form__error").forEach(span => span.textContent = "");
}

// --- Validación del formulario ---
function validarFormulario() {
  let valido = true;
  limpiarErrores();

  const nombre = document.getElementById("nombre").value.trim();
  const categoria = document.getElementById("categoria").value;
  const modalidad = document.getElementById("modalidad").value;
  const precio = parseFloat(document.getElementById("precio").value);
  const duracion = parseInt(document.getElementById("duracion").value, 10);
  const descripcion = document.getElementById("descripcion").value.trim();

  if (!nombre) {
    document.getElementById("error-nombre").textContent = "El nombre es obligatorio.";
    valido = false;
  }
  if (!categoria) {
    document.getElementById("error-categoria").textContent = "Selecciona una categoría.";
    valido = false;
  }
  if (!modalidad) {
    document.getElementById("error-modalidad").textContent = "Selecciona una modalidad.";
    valido = false;
  }
  if (isNaN(precio) || precio < 0) {
    document.getElementById("error-precio").textContent = "Ingresa un precio válido.";
    valido = false;
  }
  if (isNaN(duracion) || duracion <= 0) {
    document.getElementById("error-duracion").textContent = "Ingresa una duración válida.";
    valido = false;
  }
  if (!descripcion) {
    document.getElementById("error-descripcion").textContent = "La descripción es obligatoria.";
    valido = false;
  }

  return valido;
}

// --- Guardar (crear o editar) ---
function guardarServicio(e) {
  e.preventDefault();
  if (!validarFormulario()) return;

  const servicios = obtenerServicios();
  const id = inputId.value ? parseInt(inputId.value, 10) : null;

  const datos = {
    nombre: document.getElementById("nombre").value.trim(),
    categoria: document.getElementById("categoria").value,
    modalidad: document.getElementById("modalidad").value,
    precio: parseFloat(document.getElementById("precio").value),
    duracion: parseInt(document.getElementById("duracion").value, 10),
    descripcion: document.getElementById("descripcion").value.trim(),
  };

  if (id) {
    // Editar: buscamos el servicio existente y lo reemplazamos
    const index = servicios.findIndex(s => s.id === id);
    servicios[index] = { id, ...datos };
  } else {
    // Crear: le asignamos un id nuevo
    servicios.push({ id: generarNuevoId(servicios), ...datos });
  }

  guardarServicios(servicios);
  cerrarModal();
  renderTabla();
}

// --- Eliminar ---
function eliminarServicio(id) {
  const servicios = obtenerServicios().filter(s => s.id !== id);
  guardarServicios(servicios);
  renderTabla();
}

// --- Eventos ---
btnNuevo.addEventListener("click", () => abrirModal());
btnCancelar.addEventListener("click", cerrarModal);
form.addEventListener("submit", guardarServicio);

tablaBody.addEventListener("click", (e) => {
  const id = parseInt(e.target.dataset.id, 10);
  if (!id) return;

  if (e.target.classList.contains("btn-editar")) {
    const servicio = obtenerServicios().find(s => s.id === id);
    abrirModal(servicio);
  }

  if (e.target.classList.contains("btn-eliminar")) {
    if (confirm("¿Seguro que quieres eliminar este servicio?")) {
      eliminarServicio(id);
    }
  }
});

// --- Inicialización ---
document.addEventListener("DOMContentLoaded", renderTabla);