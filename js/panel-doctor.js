document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Validar que sea un doctor (dominio @clinnutrivida.cl)
    const sesionGuardada = localStorage.getItem("nutrivida_sesion");
    if (!sesionGuardada) {
        window.location.href = "login.html";
        return;
    }
    
    const sesion = JSON.parse(sesionGuardada);
    const esDoctor = sesion.correo.toLowerCase().endsWith("@clinnutrivida.cl");
    
    if (!esDoctor && !sesion.esAdmin) {
        alert("Acceso exclusivo para personal médico.");
        window.location.href = "index.html";
        return;
    }

    document.getElementById("tituloDoctor").textContent = `Agenda - Dr/a. ${sesion.nombre}`;

    // 2. Cerrar sesión desde el panel
    const btnCerrar = document.getElementById("btnCerrarSesionDoc");
    if (btnCerrar) {
        btnCerrar.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("nutrivida_sesion");
            window.location.href = "login.html";
        });
    }

    // 3. Renderizar tabla de citas asignadas a este doctor
    renderizarCitasDoctor(sesion.nombre);
});

function renderizarCitasDoctor(nombreDoctor) {
    const tbody = document.getElementById("tablaCitasDoctor");
    tbody.innerHTML = "";

    const todasLasCitas = JSON.parse(localStorage.getItem("nutrivida_carrito") || "[]");
    
    // Filtrar citas donde el campo 'nutricionista' incluya el nombre del usuario logueado
    const misCitas = todasLasCitas.filter(cita => 
        cita.nutricionista && 
        cita.nutricionista.toLowerCase().includes(nombreDoctor.toLowerCase())
    );

    // Ordenar por fecha (las más recientes primero)
    misCitas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    if (misCitas.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 20px;">No tienes citas agendadas actualmente.</td></tr>`;
        return;
    }

    misCitas.forEach(cita => {
        const estado = cita.estado || "Pendiente";
        let colorEstado = "#f0ad4e"; // Naranja para pendiente
        
        if (estado === "Completada") colorEstado = "var(--color-sage)";
        if (estado === "Cancelada") colorEstado = "#d9534f";

        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>
                <strong>${cita.fecha}</strong><br>
                <span style="font-size: 0.85rem; color: #a0aec0;">${cita.horario}</span>
            </td>
            <td><strong>${cita.nombre_usuario || cita.correo_usuario}</strong></td>
            <td>${cita.servicio}</td>
            <td style="max-width: 200px; font-size: 0.9rem; color: #cbd5e0;">
                ${cita.motivo || 'Sin motivo especificado'}
            </td>
            <td>
                <span style="background-color: ${colorEstado}; color: white; padding: 4px 10px; border-radius: 12px; font-size: 0.8rem; font-weight: 500;">
                    ${estado}
                </span>
            </td>
        `;
        tbody.appendChild(fila);
    });
}