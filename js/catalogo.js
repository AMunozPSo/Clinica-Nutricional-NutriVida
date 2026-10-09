// Variable global que ahora se llenará dinámicamente
let SERVICIOS = [];

const formatoCLP = new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });

const estadoFiltro = {
  categoria: "todos",
  modalidad: "todos",
  texto: "",
};

document.addEventListener("DOMContentLoaded", () => {
  // 1. Cargamos los datos desde la base de datos del Admin
  cargarServiciosDesdeAdmin();
  
  // 2. Renderizamos y activamos los filtros
  renderCatalogo();
  initFiltros();
  initBuscador();
});

function cargarServiciosDesdeAdmin() {
    const serviciosAdmin = JSON.parse(localStorage.getItem("nutrivida_servicios"));

    if (serviciosAdmin && serviciosAdmin.length > 0) {
        // Si el admin ha creado servicios, los adaptamos para la vista pública
        SERVICIOS = serviciosAdmin.map(s => {
            return {
                codigo: s.id, // Usamos el ID como código para agendar
                categoria: "Consulta", // Categoría por defecto para que funcionen los filtros
                nombre: s.nombre,
                doctor: s.doctor, // Capturamos al especialista
                duracion: "45 min", // Valor referencial
                modalidad: "presencial",
                modalidadLabel: "Presencial",
                precio: s.precio,
                descripcion: s.descripcion,
                cuposLimitados: false
            };
        });
    } else {
        // Si la base de datos está vacía, mostramos un mensaje de error o dejamos el arreglo vacío
        SERVICIOS = [];
    }
}

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
      servicio.descripcion.toLowerCase().includes(estadoFiltro.texto) ||
      (servicio.doctor && servicio.doctor.toLowerCase().includes(estadoFiltro.texto)); // Permite buscar por doctor

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
    vacio.textContent = "No hay servicios disponibles en este momento o ninguno coincide con tu búsqueda.";
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

  // Destacamos al doctor si existe, de lo contrario mostramos la duración
  const infoEspecialista = servicio.doctor 
      ? `👨‍⚕️ Especialista: <strong>${servicio.doctor}</strong>` 
      : `${servicio.duracion} · ${servicio.modalidadLabel}`;
      
  const cuposTag = servicio.cuposLimitados ? `<span class="servicio-card__cupos">Cupos limitados</span>` : "";

  card.innerHTML = `
    <span class="servicio-card__categoria">${servicio.categoria}</span>
    ${cuposTag}
    <h3>${servicio.nombre}</h3>
    <div class="servicio-card__meta">
      <span style="color: var(--color-forest);">${infoEspecialista}</span>
    </div>
    <p>${servicio.descripcion}</p>
    <p class="servicio-card__precio">${formatoCLP.format(servicio.precio)}</p>
    <div class="servicio-card__acciones">
      <a href="solicitud-cita.html?codigo=${servicio.codigo}" class="btn btn--primary" style="width: 100%; text-align: center;">Agendar Especialista</a>
    </div>
  `;

  return card;
}