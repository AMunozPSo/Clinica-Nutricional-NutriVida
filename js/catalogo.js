const SERVICIOS = [
  { codigo: "CN001", categoria: "Consulta", nombre: "Primera consulta nutricional", duracion: "50 min", modalidad: "presencial", modalidadLabel: "Presencial", precio: 35000, descripcion: "Evaluación inicial: anamnesis, antropometría completa y diseño del primer plan alimenticio." },
  { codigo: "CN002", categoria: "Consulta", nombre: "Control nutricional (seguimiento)", duracion: "30 min", modalidad: "presencial", modalidadLabel: "Presencial", precio: 25000, descripcion: "Seguimiento mensual: medición de indicadores y ajuste del plan vigente." },
  { codigo: "CN003", categoria: "Consulta", nombre: "Control nutricional quincenal", duracion: "30 min", modalidad: "presencial", modalidadLabel: "Presencial", precio: 22000, descripcion: "Seguimiento intensivo cada 15 días. Recomendado en los primeros 2 meses." },
  { codigo: "CN004", categoria: "Consulta", nombre: "Teleconsulta nutricional", duracion: "30 min", modalidad: "online", modalidadLabel: "Online (video)", precio: 20000, descripcion: "Consulta de seguimiento vía videollamada. Requiere consulta presencial previa." },
  { codigo: "CN005", categoria: "Consulta", nombre: "Consulta de urgencia / reagendada", duracion: "30 min", modalidad: "presencial", modalidadLabel: "Presencial", precio: 28000, descripcion: "Para pacientes que requieren atención fuera de su control habitual." },

  { codigo: "PL001", categoria: "Plan especializado", nombre: "Plan pérdida de peso (1 mes)", duracion: null, modalidad: "presencial", modalidadLabel: "Presencial", precio: 65000, descripcion: "Primera consulta + 1 control quincenal + plan alimenticio personalizado + seguimiento por WhatsApp." },
  { codigo: "PL002", categoria: "Plan especializado", nombre: "Plan pérdida de peso (3 meses)", duracion: null, modalidad: "presencial", modalidadLabel: "Presencial", precio: 170000, descripcion: "Primera consulta + 5 controles + 3 planes mensuales + seguimiento continuo." },
  { codigo: "PL003", categoria: "Plan especializado", nombre: "Plan nutrición deportiva (1 mes)", duracion: null, modalidad: "presencial", modalidadLabel: "Presencial", precio: 70000, descripcion: "Para deportistas y personas con actividad física frecuente. Cálculo de requerimientos energéticos y proteicos." },
  { codigo: "PL004", categoria: "Plan especializado", nombre: "Plan control diabetes / hipertensión", duracion: null, modalidad: "presencial", modalidadLabel: "Presencial", precio: 75000, descripcion: "Plan adaptado para patologías metabólicas. Coordinación con médico tratante si aplica." },
  { codigo: "PL005", categoria: "Plan especializado", nombre: "Plan alimentación vegetariana/vegana", duracion: null, modalidad: "presencial", modalidadLabel: "Presencial", precio: 68000, descripcion: "Diseñado para garantizar aporte adecuado de proteínas, hierro, vitamina B12 y calcio sin productos animales." },
  { codigo: "PL006", categoria: "Plan especializado", nombre: "Plan alimentación infantil (2-12 años)", duracion: null, modalidad: "presencial", modalidadLabel: "Presencial", precio: 65000, descripcion: "Evaluación nutricional pediátrica y diseño de plan adaptado a la etapa de desarrollo del niño." },

  { codigo: "EV001", categoria: "Evaluación", nombre: "Antropometría completa", duracion: "20 min", modalidad: "presencial", modalidadLabel: "Presencial", precio: 18000, descripcion: "Peso, talla, IMC, circunferencia de cintura, cadera, brazo y % de grasa corporal con bioimpedanciometría." },
  { codigo: "EV002", categoria: "Evaluación", nombre: "Bioimpedanciometría", duracion: "15 min", modalidad: "presencial", modalidadLabel: "Presencial", precio: 12000, descripcion: "Medición de composición corporal: masa grasa, masa muscular, agua corporal y edad metabólica." },
  { codigo: "EV003", categoria: "Evaluación", nombre: "Encuesta de hábitos alimentarios", duracion: "20 min", modalidad: "presencial", modalidadLabel: "Presencial", precio: 10000, descripcion: "Análisis del patrón alimentario actual. Identificación de déficit y excesos nutricionales." },
  { codigo: "EV004", categoria: "Evaluación", nombre: "Análisis de exámenes de laboratorio", duracion: "20 min", modalidad: "presencial", modalidadLabel: "Presencial", precio: 15000, descripcion: "Interpretación de hemograma, perfil bioquímico y lipídico en contexto nutricional." },

  { codigo: "TG001", categoria: "Taller grupal", nombre: "Taller de alimentación saludable", duracion: "90 min", modalidad: "presencial", modalidadLabel: "Presencial (grupo)", precio: 15000, descripcion: "Máx. 10 personas. Conceptos básicos de alimentación equilibrada y lectura de etiquetas.", cuposLimitados: true },
  { codigo: "TG002", categoria: "Taller grupal", nombre: "Taller de cocina nutritiva", duracion: "120 min", modalidad: "presencial", modalidadLabel: "Presencial (grupo)", precio: 20000, descripcion: "Preparación de recetas saludables. Incluye degustación. Máx. 8 personas.", cuposLimitados: true },
  { codigo: "TG003", categoria: "Taller grupal", nombre: "Taller nutrición para deportistas", duracion: "90 min", modalidad: "presencial", modalidadLabel: "Presencial (grupo)", precio: 18000, descripcion: "Hidratación, nutrición pre y post entrenamiento, suplementación básica. Máx. 12 personas.", cuposLimitados: true },
];

const formatoCLP = new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });

const estadoFiltro = {
  categoria: "todos",
  modalidad: "todos",
  texto: "",
};

document.addEventListener("DOMContentLoaded", () => {
  renderCatalogo();
  initFiltros();
  initBuscador();
});

function initFiltros() {
  document.querySelectorAll("#filtroCategoria .filtro-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#filtroCategoria .filtro-btn").forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      estadoFiltro.categoria = btn.dataset.categoria;
      renderCatalogo();
    });
  });

  document.querySelectorAll("#filtroModalidad .filtro-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#filtroModalidad .filtro-btn").forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      estadoFiltro.modalidad = btn.dataset.modalidad;
      renderCatalogo();
    });
  });
}

function initBuscador() {
  const input = document.getElementById("buscadorInput");
  if (!input) return;

  input.addEventListener("input", () => {
    estadoFiltro.texto = input.value.trim().toLowerCase();
    renderCatalogo();
  });
}

function filtrarServicios() {
  return SERVICIOS.filter((servicio) => {
    const coincideCategoria = estadoFiltro.categoria === "todos" || servicio.categoria === estadoFiltro.categoria;
    const coincideModalidad = estadoFiltro.modalidad === "todos" || servicio.modalidad === estadoFiltro.modalidad;
    const coincideTexto =
      estadoFiltro.texto === "" ||
      servicio.nombre.toLowerCase().includes(estadoFiltro.texto) ||
      servicio.descripcion.toLowerCase().includes(estadoFiltro.texto);

    return coincideCategoria && coincideModalidad && coincideTexto;
  });
}

function renderCatalogo() {
  const grid = document.getElementById("catalogoGrid");
  const vacio = document.getElementById("catalogoVacio");
  const resultados = filtrarServicios();

  grid.innerHTML = "";

  if (resultados.length === 0) {
    vacio.hidden = false;
    return;
  }
  vacio.hidden = true;

  resultados.forEach((servicio) => {
    grid.appendChild(crearTarjetaServicio(servicio));
  });
}

function crearTarjetaServicio(servicio) {
  const card = document.createElement("article");
  card.className = "card";

  const duracionTexto = servicio.duracion ? `${servicio.duracion} · ${servicio.modalidadLabel}` : servicio.modalidadLabel;
  const cuposTag = servicio.cuposLimitados ? `<span class="servicio-card__cupos">Cupos limitados</span>` : "";

  card.innerHTML = `
    <span class="servicio-card__categoria">${servicio.categoria}</span>
    ${cuposTag}
    <h3>${servicio.nombre}</h3>
    <div class="servicio-card__meta">
      <span>${duracionTexto}</span>
    </div>
    <p>${servicio.descripcion}</p>
    <p class="servicio-card__precio">${formatoCLP.format(servicio.precio)}</p>
    <div class="servicio-card__acciones">
      <a href="detalle-servicio.html?codigo=${servicio.codigo}" class="btn btn--secondary">Ver detalle</a>
      <a href="solicitud-cita.html?codigo=${servicio.codigo}" class="btn btn--primary">Agendar</a>
    </div>
  `;

  return card;
}
