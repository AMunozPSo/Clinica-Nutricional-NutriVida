// 1. Simulación de base de datos (Arreglo de objetos)
const servicios = [
    {
        id: 1,
        titulo: "Consulta Nutricional Inicial",
        descripcion: "Evaluación completa de hábitos, medidas y definición de objetivos.",
        categoria: "Control de Peso",
        modalidad: "Presencial",
        precio: "$30.000",
        duracion: "45 min"
    },
    {
        id: 2,
        titulo: "Plan Deportivo Avanzado",
        descripcion: "Optimización de rendimiento y composición corporal para atletas.",
        categoria: "Nutrición Deportiva",
        modalidad: "Online",
        precio: "$35.000",
        duracion: "60 min"
    },
    {
        id: 3,
        titulo: "Transición a Dieta Basada en Plantas",
        descripcion: "Asesoría para evitar déficits vitamínicos al dejar la carne.",
        categoria: "Vegetariana",
        modalidad: "Presencial",
        precio: "$28.000",
        duracion: "45 min"
    },
    {
        id: 4,
        titulo: "Taller: Lectura de Etiquetas",
        descripcion: "Aprende a identificar ingredientes ocultos en el supermercado.",
        categoria: "Talleres",
        modalidad: "Online",
        precio: "$15.000",
        duracion: "90 min"
    }
];

// 2. Referencias al DOM (Conectar HTML con JS)
const contenedorCatalogo = document.getElementById('catalogoGrid');
const inputBuscar = document.getElementById('buscarInput');
const selectCategoria = document.getElementById('categoriaSelect');
const selectModalidad = document.getElementById('modalidadSelect');

// 3. Función para pintar las tarjetas en el HTML
function renderizarServicios(listaServicios) {
    // Limpiamos el contenedor antes de inyectar nuevos datos
    contenedorCatalogo.innerHTML = '';

    // Si no hay resultados tras filtrar, mostramos un mensaje
    if (listaServicios.length === 0) {
        contenedorCatalogo.innerHTML = '<p>No se encontraron servicios con esos filtros.</p>';
        return;
    }

    // Recorremos el arreglo e inyectamos el HTML de cada tarjeta
    listaServicios.forEach(servicio => {
        const tarjeta = document.createElement('div');
        tarjeta.classList.add('card');

        tarjeta.innerHTML = `
            <h3>${servicio.titulo}</h3>
            <p>${servicio.descripcion}</p>
            <hr>
            <p><strong>Categoría:</strong> ${servicio.categoria}</p>
            <p><strong>Modalidad:</strong> ${servicio.modalidad}</p>
            <p><strong>Duración:</strong> ${servicio.duracion}</p>
            <p class="precio"><strong>Precio:</strong> ${servicio.precio}</p>
            <button class="btn btn--primary">Agendar</button>
        `;
        contenedorCatalogo.appendChild(tarjeta);
    });
}

// 4. Función de filtrado múltiple
function filtrarServicios() {
    const textoBuscado = inputBuscar.value.toLowerCase();
    const categoriaSeleccionada = selectCategoria.value;
    const modalidadSeleccionada = selectModalidad.value;

    const serviciosFiltrados = servicios.filter(servicio => {
        // Filtrar por texto (busca en título)
        const coincideTexto = servicio.titulo.toLowerCase().includes(textoBuscado);
        
        // Filtrar por categoría
        const coincideCategoria = categoriaSeleccionada === 'todas' || servicio.categoria === categoriaSeleccionada;
        
        // Filtrar por modalidad
        const coincideModalidad = modalidadSeleccionada === 'todas' || servicio.modalidad === modalidadSeleccionada;

        // Retorna true solo si cumple los 3 filtros a la vez
        return coincideTexto && coincideCategoria && coincideModalidad;
    });

    renderizarServicios(serviciosFiltrados);
}

// 5. Event Listeners (Escuchamos cuando el usuario interactúa)
inputBuscar.addEventListener('keyup', filtrarServicios);
selectCategoria.addEventListener('change', filtrarServicios);
selectModalidad.addEventListener('change', filtrarServicios);

// 6. Ejecución inicial para mostrar todos al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    renderizarServicios(servicios);
});