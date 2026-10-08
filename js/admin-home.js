document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Proteger la ruta: Verificar si el usuario logueado es admin
    const sesionGuardada = localStorage.getItem("nutrivida_sesion");
    if (!sesionGuardada) {
        window.location.href = "login.html";
        return;
    }
    const sesion = JSON.parse(sesionGuardada);
    if (!sesion.esAdmin) {
        alert("Acceso denegado. No tienes permisos de administrador.");
        window.location.href = "index.html";
        return;
    }

    // Saludo personalizado
    document.getElementById("saludoAdmin").textContent = `Bienvenido, ${sesion.nombre}`;

// Lógica para cerrar sesión
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

    // 2. Extraer datos del LocalStorage
    const usuarios = JSON.parse(localStorage.getItem("nutrivida_usuarios") || "[]");
    const carritoGlobal = JSON.parse(localStorage.getItem("nutrivida_carrito") || "[]");

    // Fecha de hoy en formato YYYY-MM-DD
    const hoy = new Date().toISOString().split('T')[0];

    // --- CÁLCULO DE MÉTRICAS ---
    
    // A) Citas de hoy (que no estén canceladas)
    const citasHoy = carritoGlobal.filter(cita => cita.fecha === hoy && cita.estado !== "Cancelada").length;
    document.getElementById("metricaCitasHoy").textContent = citasHoy;

    // B) Total de Pacientes (Excluimos a los que tienen correos de admin)
    const ADMIN_CORREOS = ["anto.munozp@duocuc.cl", "feli.arayah@duocuc.cl"];
    const totalPacientes = usuarios.filter(u => !ADMIN_CORREOS.includes(u.correo)).length;
    document.getElementById("metricaPacientes").textContent = totalPacientes;

    // C) Planes Alimenticios (citas donde el servicio contiene la palabra "Plan")
    const planesActivos = carritoGlobal.filter(cita => 
        cita.servicio.toLowerCase().includes("plan") && cita.estado !== "Cancelada"
    ).length;
    document.getElementById("metricaPlanes").textContent = planesActivos;

    // --- TABLA DE PRÓXIMAS CITAS ---
    const tbodyCitas = document.getElementById("tablaProximasCitas");
    tbodyCitas.innerHTML = "";

    // Filtramos citas desde hoy en adelante
    let proximasCitas = carritoGlobal.filter(cita => cita.fecha >= hoy && cita.estado !== "Cancelada");
    
    // Ordenamos por fecha y hora
    proximasCitas.sort((a, b) => {
        const fechaHoraA = new Date(`${a.fecha}T${a.horario}`);
        const fechaHoraB = new Date(`${b.fecha}T${b.horario}`);
        return fechaHoraA - fechaHoraB;
    });

    // Mostramos solo las primeras 5 para no saturar el resumen
    const topCitas = proximasCitas.slice(0, 5);

    if (topCitas.length === 0) {
        tbodyCitas.innerHTML = `<tr><td colspan="4" style="text-align:center; padding: 20px;">No hay citas programadas próximamente.</td></tr>`;
    } else {
        topCitas.forEach(cita => {
            // Buscamos el nombre del paciente cruzando el correo con la base de usuarios
            const pacienteRef = usuarios.find(u => u.correo === cita.correo_usuario);
            const nombrePaciente = pacienteRef ? pacienteRef.nombre : cita.correo_usuario;

            // Damos color al estado
            let claseEstado = "status-pendiente";
            if (cita.estado === "Confirmada") claseEstado = "status-confirmada";

            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${cita.fecha} <br><small>${cita.horario}</small></td>
                <td><strong>${nombrePaciente}</strong></td>
                <td>${cita.servicio}</td>
                <td><span class="status-badge ${claseEstado}">${cita.estado || "Pendiente"}</span></td>
            `;
            tbodyCitas.appendChild(fila);
        });
    }
});