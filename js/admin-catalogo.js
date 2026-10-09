const CLAVE_SERVICIOS = "nutrivida_servicios";

document.addEventListener("DOMContentLoaded", () => {
    
    const sesionGuardada = localStorage.getItem("nutrivida_sesion");
    if (!sesionGuardada) {
        window.location.href = "login.html";
        return;
    }
    const sesion = JSON.parse(sesionGuardada);
    if (!sesion.esAdmin) {
        alert("Acceso denegado.");
        window.location.href = "index.html";
        return;
    }

    const btnCerrar = document.getElementById("btnCerrarSesionAdmin");
    if (btnCerrar) {
        btnCerrar.addEventListener("click", (e) => {
            e.preventDefault();
            if (confirm("¿Seguro que deseas cerrar sesión?")) {
                localStorage.removeItem("nutrivida_sesion");
                window.location.href = "login.html";
            }
        });
    }

    inicializarServicios();
    renderizarCatalogo();

    document.getElementById("formServicio").addEventListener("submit", guardarServicio);
});

function inicializarServicios() {
    let servicios = localStorage.getItem(CLAVE_SERVICIOS);
    if (!servicios) {
        // NUEVO CATÁLOGO CON DOCTORES
        const serviciosBase = [
            { 
                id: 1, 
                nombre: "Nutrición Deportiva Avanzada", 
                doctor: "Dr. Felipe Araya", 
                descripcion: "Plan enfocado en maximizar el rendimiento atlético, aumento de masa muscular y recuperación.", 
                precio: 45000 
            },
            { 
                id: 2, 
                nombre: "Alimentación Basada en Plantas", 
                doctor: "Dra. Antonia Muñoz", 
                descripcion: "Asesoría para una transición segura a dietas veganas o vegetarianas sin déficit de nutrientes.", 
                precio: 30000 
            },
            { 
                id: 3, 
                nombre: "Programa de Psiconutrición", 
                doctor: "Dra. Sofía Vergara", 
                descripcion: "Abordaje integral de la relación con la comida, ansiedad y modificación de hábitos alimentarios.", 
                precio: 50000 
            },
            { 
                id: 4, 
                nombre: "Control Nutricional Pediátrico", 
                doctor: "Dr. Carlos Mendoza", 
                descripcion: "Evaluación de crecimiento, peso y talla para niños, fomentando hábitos saludables en familia.", 
                precio: 35000 
            }
        ];
        localStorage.setItem(CLAVE_SERVICIOS, JSON.stringify(serviciosBase));
    }
}

function renderizarCatalogo() {
    const tbody = document.getElementById("tablaServiciosBody");
    tbody.innerHTML = "";

    const servicios = JSON.parse(localStorage.getItem(CLAVE_SERVICIOS) || "[]");

    if (servicios.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 20px;">No hay servicios registrados en el catálogo.</td></tr>`;
        return;
    }

    const formatearCLP = (monto) => {
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(monto);
    };

    servicios.forEach((servicio) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td><strong>${servicio.nombre}</strong></td>
            <td><span style="background-color: var(--color-sage); color: white; padding: 3px 8px; border-radius: 12px; font-size: 0.8rem;">${servicio.doctor || 'Sin asignar'}</span></td>
            <td style="max-width: 250px; font-size: 0.9rem; color: #555;">
                ${servicio.descripcion}
            </td>
            <td style="text-align: right; font-weight: bold; color: var(--color-forest);">
                ${formatearCLP(servicio.precio)}
            </td>
            <td style="text-align: center;">
                <button class="btn btn--secondary" onclick="prepararEdicion(${servicio.id})" style="padding: 5px 10px; font-size: 0.8rem; margin-right: 5px;">Editar</button>
                <button class="btn btn--primary" onclick="eliminarServicio(${servicio.id})" style="padding: 5px 10px; font-size: 0.8rem; background-color: #d9534f; border-color: #d9534f; color: white;">Eliminar</button>
            </td>
        `;
        tbody.appendChild(fila);
    });
}

window.mostrarFormulario = function() {
    document.getElementById("formServicio").reset();
    document.getElementById("csId").value = "";
    document.getElementById("tituloFormServicio").textContent = "Agregar Nuevo Servicio";
    document.getElementById("btnGuardarServicio").textContent = "Guardar Servicio";
    document.getElementById("contenedorFormServicio").style.display = "block";
};

window.ocultarFormulario = function() {
    document.getElementById("contenedorFormServicio").style.display = "none";
};

window.prepararEdicion = function(id) {
    const servicios = JSON.parse(localStorage.getItem(CLAVE_SERVICIOS) || "[]");
    const servicio = servicios.find(s => s.id === id);
    
    if (servicio) {
        document.getElementById("csId").value = servicio.id;
        document.getElementById("csNombre").value = servicio.nombre;
        document.getElementById("csDoctor").value = servicio.doctor || ""; 
        document.getElementById("csPrecio").value = servicio.precio;
        document.getElementById("csDescripcion").value = servicio.descripcion;
        
        document.getElementById("tituloFormServicio").textContent = "Editar Servicio";
        document.getElementById("btnGuardarServicio").textContent = "Actualizar Servicio";
        document.getElementById("contenedorFormServicio").style.display = "block";
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

function guardarServicio(e) {
    e.preventDefault();
    
    const idInput = document.getElementById("csId").value;
    const nombre = document.getElementById("csNombre").value.trim();
    const doctor = document.getElementById("csDoctor").value.trim(); 
    const precio = parseInt(document.getElementById("csPrecio").value, 10);
    const descripcion = document.getElementById("csDescripcion").value.trim();
    
    let servicios = JSON.parse(localStorage.getItem(CLAVE_SERVICIOS) || "[]");

    if (idInput === "") {
        const nuevoId = servicios.length > 0 ? Math.max(...servicios.map(s => s.id)) + 1 : 1;
        servicios.push({ id: nuevoId, nombre, doctor, precio, descripcion });
    } else {
        const idEdit = parseInt(idInput, 10);
        const index = servicios.findIndex(s => s.id === idEdit);
        if (index !== -1) {
            servicios[index] = { id: idEdit, nombre, doctor, precio, descripcion };
        }
    }

    localStorage.setItem(CLAVE_SERVICIOS, JSON.stringify(servicios));
    ocultarFormulario();
    renderizarCatalogo();
}

window.eliminarServicio = function(id) {
    if (confirm("¿Estás seguro de eliminar este servicio del catálogo?")) {
        let servicios = JSON.parse(localStorage.getItem(CLAVE_SERVICIOS) || "[]");
        servicios = servicios.filter(s => s.id !== id);
        localStorage.setItem(CLAVE_SERVICIOS, JSON.stringify(servicios));
        renderizarCatalogo();
    }
};