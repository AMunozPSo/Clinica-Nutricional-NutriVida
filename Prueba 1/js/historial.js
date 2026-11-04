// Historial de progreso — manejo de formulario, localStorage y gráfico de barras

const STORAGE_KEY = "nutrivida_historial_peso";

const form = document.getElementById("form-historial");
const inputFecha = document.getElementById("fecha");
const inputPeso = document.getElementById("peso");
const errorFecha = document.getElementById("error-fecha");
const errorPeso = document.getElementById("error-peso");
const tablaBody = document.getElementById("tabla-historial-body");
const canvas = document.getElementById("grafico-peso");
const ctx = canvas.getContext("2d");
const mensajeVacio = document.getElementById("mensaje-vacio");

// --- Utilidades de almacenamiento ---
function obtenerRegistros() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function guardarRegistros(registros) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(registros));
}

// --- Validación ---
function validarFormulario() {
  let valido = true;
  errorFecha.textContent = "";
  errorPeso.textContent = "";

  if (!inputFecha.value) {
    errorFecha.textContent = "Debes seleccionar una fecha.";
    valido = false;
  } else if (new Date(inputFecha.value) > new Date()) {
    errorFecha.textContent = "La fecha no puede ser futura.";
    valido = false;
  }

  const peso = parseFloat(inputPeso.value);
  if (isNaN(peso) || peso < 20 || peso > 300) {
    errorPeso.textContent = "Ingresa un peso válido entre 20 y 300 kg.";
    valido = false;
  }

  return valido;
}

// --- Renderizado de tabla ---
function renderTabla(registros) {
  tablaBody.innerHTML = "";

  registros.forEach((registro, index) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${formatearFecha(registro.fecha)}</td>
      <td>${registro.peso} kg</td>
      <td><button class="btn btn--secondary btn-eliminar" data-index="${index}">Eliminar</button></td>
    `;
    tablaBody.appendChild(fila);
  });
}

function formatearFecha(fechaISO) {
  const [anio, mes, dia] = fechaISO.split("-");
  return `${dia}-${mes}-${anio}`;
}

// --- Renderizado del gráfico de barras (Canvas puro) ---
function renderGrafico(registros) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (registros.length === 0) {
    canvas.style.display = "none";
    mensajeVacio.style.display = "block";
    return;
  }
  canvas.style.display = "block";
  mensajeVacio.style.display = "none";

  const estilos = getComputedStyle(document.documentElement);
  const colorBarra = estilos.getPropertyValue("--color-forest").trim() || "#2F5233";
  const colorTexto = estilos.getPropertyValue("--color-text").trim() || "#1F2A22";

  const padding = 40;
  const ancho = canvas.width - padding * 2;
  const alto = canvas.height - padding * 2;

  const pesos = registros.map(r => r.peso);
  const pesoMax = Math.max(...pesos) * 1.1; // margen visual del 10%
  const pesoMin = 0;

  const anchoBarra = ancho / registros.length - 10;

  registros.forEach((registro, index) => {
    const alturaBarra = ((registro.peso - pesoMin) / (pesoMax - pesoMin)) * alto;
    const x = padding + index * (anchoBarra + 10);
    const y = canvas.height - padding - alturaBarra;

    // Barra
    ctx.fillStyle = colorBarra;
    ctx.fillRect(x, y, anchoBarra, alturaBarra);

    // Valor sobre la barra
    ctx.fillStyle = colorTexto;
    ctx.font = "12px 'Work Sans', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`${registro.peso}`, x + anchoBarra / 2, y - 5);

    // Fecha bajo la barra
    ctx.fillText(formatearFecha(registro.fecha), x + anchoBarra / 2, canvas.height - padding + 15);
  });

  // Línea base (eje X)
  ctx.strokeStyle = colorTexto;
  ctx.beginPath();
  ctx.moveTo(padding, canvas.height - padding);
  ctx.lineTo(canvas.width - padding, canvas.height - padding);
  ctx.stroke();
}

// --- Render general ---
function renderTodo() {
  const registros = obtenerRegistros();
  renderTabla(registros);
  renderGrafico(registros);
}

// --- Eventos ---
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!validarFormulario()) return;

  const registros = obtenerRegistros();
  registros.push({ fecha: inputFecha.value, peso: parseFloat(inputPeso.value) });
  registros.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

  guardarRegistros(registros);
  form.reset();
  renderTodo();
});

tablaBody.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-eliminar")) {
    const index = parseInt(e.target.dataset.index, 10);
    const registros = obtenerRegistros();
    registros.splice(index, 1);
    guardarRegistros(registros);
    renderTodo();
  }
});

// --- Inicialización ---
document.addEventListener("DOMContentLoaded", renderTodo);