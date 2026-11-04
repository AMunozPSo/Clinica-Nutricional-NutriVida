let SERVICIOS = [];
const formatoCLP = new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 2 });

const estadoFiltro = {
  categoria: "todos",
  modalidad: "todos",
  texto: "",
};

document.addEventListener("DOMContentLoaded", () => {
  cargarServiciosDesdeAdmin();
  renderCatalogo();
  initFiltros();
  initBuscador();
});

function cargarServiciosDesdeAdmin() {
    const serviciosAdmin = NutriData.services();

    if (serviciosAdmin && serviciosAdmin.length > 0) {
        SERVICIOS = serviciosAdmin.map(s => {

            let catLabel = "Evaluación";
            if(s.categoria === "planes") catLabel = "Plan Especializado";
            else if(s.categoria === "talleres") catLabel = "Taller Grupal";
            else if(s.categoria === "evaluaciones") catLabel = "Evaluaciones / Consultas";

            return {
                codigo: s.id,
                imagen: s.imagen, stock: s.stock, stockCritico: s.stockCritico,
                categoriaId: s.categoria || "evaluaciones",
                categoria: catLabel,
                nombre: s.nombre,
                doctor: s.doctor,
                duracion: "45 min",
                modalidad: (s.modalidad || "Presencial").toLowerCase(),
                modalidadLabel: s.modalidad || "Presencial",
                precio: s.precio,
                descripcion: s.descripcion,
                cuposLimitados: s.stockCritico !== '' && s.stock <= Number(s.stockCritico)
            };
        });
    } else {
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
    const filtroCat = estadoFiltro.categoria.toLowerCase();
    const sCat = (servicio.categoriaId || "").toLowerCase();


    let coincideCategoria = false;
    if (filtroCat === "todos" || filtroCat === "") {
        coincideCategoria = true;
    } else if (filtroCat.includes("plan") && sCat.includes("plan")) {
        coincideCategoria = true;
    } else if ((filtroCat.includes("evaluacion") || filtroCat.includes("consulta")) && sCat.includes("evaluacion")) {
        coincideCategoria = true;
    } else if (filtroCat.includes("taller") && sCat.includes("taller")) {
        coincideCategoria = true;
    } else {
        coincideCategoria = (sCat === filtroCat);
    }

    const coincideModalidad = estadoFiltro.modalidad === "todos" || servicio.modalidad === estadoFiltro.modalidad;

    const coincideTexto =
      estadoFiltro.texto === "" ||
      servicio.nombre.toLowerCase().includes(estadoFiltro.texto) ||
      servicio.descripcion.toLowerCase().includes(estadoFiltro.texto) ||
      (servicio.doctor && servicio.doctor.toLowerCase().includes(estadoFiltro.texto));

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

  const infoEspecialista = servicio.doctor
      ? `Especialista: <strong>${NutriData.escape(servicio.doctor)}</strong>`
      : `${servicio.duracion} · ${servicio.modalidadLabel}`;

  const cuposTag = servicio.cuposLimitados ? `<span class="servicio-card__cupos">Cupos limitados</span>` : "";

  card.innerHTML = `
    <a href="detalle-servicio.html?id=${servicio.codigo}"><img src="${NutriData.escape(servicio.imagen)}" alt="${NutriData.escape(servicio.nombre)}" style="width:100%;height:180px;object-fit:cover;border-radius:8px"></a>
    <span class="servicio-card__categoria">${NutriData.escape(servicio.categoria)}</span>
    ${cuposTag}
    <h3>${NutriData.escape(servicio.nombre)}</h3>
    <div class="servicio-card__meta">
      <span style="color: var(--color-forest);">${infoEspecialista}</span>
    </div>
    <p>${NutriData.escape(servicio.descripcion)}</p>
    <p class="servicio-card__precio">${formatoCLP.format(servicio.precio)}</p>
    <div class="servicio-card__acciones">
      <a href="detalle-servicio.html?id=${servicio.codigo}" class="btn btn--primary" style="width: 100%; text-align: center;">Ver detalle</a>
      <button class="btn btn--secondary" data-add-cart="${servicio.codigo}" ${servicio.stock === 0 ? 'disabled' : ''}>Añadir al carrito</button>
    </div>
  `;
  return card;
}
