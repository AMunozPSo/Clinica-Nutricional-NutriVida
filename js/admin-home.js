
function cargarMensajesContacto() {
    const contenedor = document.getElementById('contenedor-mensajes');
    if (!contenedor) return;

    const mensajes = JSON.parse(localStorage.getItem('nutrivida_mensajes')) || [];

    if (mensajes.length === 0) {
        contenedor.innerHTML = '<p class="text-muted" style="grid-column: 1 / -1;">No hay mensajes nuevos en la bandeja.</p>';
        return;
    }

    contenedor.innerHTML = mensajes.reverse().map(msg => `
        <div class="card" style="padding: 15px; border-left: 4px solid var(--color-1); background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <strong style="color: var(--color-4);">${msg.nombre}</strong>
                <span style="font-size: 0.8rem; color: #a0aec0;">${msg.fecha}</span>
            </div>
            <a href="mailto:${msg.correo}" style="color: var(--color-3); font-size: 0.85rem; text-decoration: none; display: block; margin-bottom: 10px;">${msg.correo}</a>
            <p style="font-size: 0.95rem; color: #4a5568; line-height: 1.4; word-wrap: break-word;">${msg.comentario}</p>
        </div>
    `).join('');
}

document.addEventListener("DOMContentLoaded", () => {
    
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

    document.getElementById("saludoAdmin").textContent = `Bienvenido, ${sesion.nombre}`;

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

    const usuarios = JSON.parse(localStorage.getItem("nutrivida_usuarios") || "[]");
    const carritoGlobal = JSON.parse(localStorage.getItem("nutrivida_carrito") || "[]");

    const hoy = new Date().toISOString().split('T')[0];

    const citasHoy = carritoGlobal.filter(cita => cita.fecha === hoy && cita.estado !== "Cancelada").length;
    document.getElementById("metricaCitasHoy").textContent = citasHoy;

    const ADMIN_CORREOS = ["anto.munozp@duocuc.cl", "feli.arayah@duocuc.cl"];
    const totalPacientes = usuarios.filter(u => !ADMIN_CORREOS.includes(u.correo)).length;
    document.getElementById("metricaPacientes").textContent = totalPacientes;

    const planesActivos = carritoGlobal.filter(cita => 
        cita.servicio.toLowerCase().includes("plan") && cita.estado !== "Cancelada"
    ).length;
    document.getElementById("metricaPlanes").textContent = planesActivos;

    const tbodyCitas = document.getElementById("tablaProximasCitas");
    tbodyCitas.innerHTML = "";

    let proximasCitas = carritoGlobal.filter(cita => cita.fecha >= hoy && cita.estado !== "Cancelada");

    proximasCitas.sort((a, b) => {
        const fechaHoraA = new Date(`${a.fecha}T${a.horario}`);
        const fechaHoraB = new Date(`${b.fecha}T${b.horario}`);
        return fechaHoraA - fechaHoraB;
    });

    const topCitas = proximasCitas.slice(0, 5);

    if (topCitas.length === 0) {
        tbodyCitas.innerHTML = `<tr><td colspan="4" style="text-align:center; padding: 20px;">No hay citas programadas próximamente.</td></tr>`;
    } else {
        topCitas.forEach(cita => {

            const pacienteRef = usuarios.find(u => u.correo === cita.correo_usuario);
            const nombrePaciente = pacienteRef ? pacienteRef.nombre : cita.correo_usuario;

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

    cargarMensajesContacto();
});