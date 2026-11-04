document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Protección de ruta y cierre de sesión
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

    // 2. Generar Reportes
    calcularEstadisticas();
});

function calcularEstadisticas() {
    // Obtener las tres bases de datos
    const citas = JSON.parse(localStorage.getItem("nutrivida_carrito") || "[]");
    const usuarios = JSON.parse(localStorage.getItem("nutrivida_usuarios") || "[]");
    const servicios = JSON.parse(localStorage.getItem("nutrivida_servicios") || "[]");

    let totalIngresos = 0;
    let totalCompletadas = 0;
    let totalPendientes = 0;
    let totalPacientes = 0;

    // Calcular Citas e Ingresos
    citas.forEach(cita => {
        // Por defecto, si no tiene estado es Pendiente
        const estadoCita = cita.estado || "Pendiente";

        if (estadoCita === "Pendiente") {
            totalPendientes++;
        } else if (estadoCita === "Completada") {
            totalCompletadas++;
            
            // Buscar el precio del servicio en el catálogo usando el nombre
            const servicioAsociado = servicios.find(s => s.nombre === cita.servicio);
            if (servicioAsociado && servicioAsociado.precio) {
                totalIngresos += servicioAsociado.precio;
            }
        }
    });

    // Calcular Pacientes (usuarios que no son admin)
    usuarios.forEach(usuario => {
        if (!usuario.esAdmin) {
            totalPacientes++;
        }
    });

    // Formatear CLP
    const formatoDinero = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(totalIngresos);

    // Inyectar en el HTML
    document.getElementById("kpi-ingresos").textContent = formatoDinero;
    document.getElementById("kpi-citas-completadas").textContent = totalCompletadas;
    document.getElementById("kpi-citas-pendientes").textContent = totalPendientes;
    document.getElementById("kpi-pacientes").textContent = totalPacientes;
}