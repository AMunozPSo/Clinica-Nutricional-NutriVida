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

    document.getElementById("btnFiltrar").addEventListener("click", renderizarCitas);
    document.getElementById("filtroPaciente").addEventListener("input", renderizarCitas);
    document.getElementById("filtroEstado").addEventListener("change", renderizarCitas);

    renderizarCitas();
});

function renderizarCitas() {
    const tbody = document.getElementById("tablaCitasBody");
    tbody.innerHTML = "";

    // AHORA SÍ BUSCA EN LA BASE DE DATOS CORRECTA
    let citas = JSON.parse(localStorage.getItem("nutrivida_citas") || "[]");

    if (citas.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 20px;">No hay citas agendadas en el sistema.</td></tr>`;
        return;
    }

    const textoFiltro = document.getElementById("filtroPaciente").value.toLowerCase();
    const estadoFiltro = document.getElementById("filtroEstado").value;

    citas.reverse();

    citas.forEach((cita, indexRealInvertido) => {
        if (!cita.estado) cita.estado = "Pendiente";
        
        const indexOriginal = (citas.length - 1) - indexRealInvertido;

        // Variables actualizadas para coincidir con el nuevo formato de agendamiento
        const nombrePaciente = cita.pacienteNombre || cita.nombre_usuario || "";
        const correoPaciente = cita.pacienteCorreo || cita.correo_usuario || "";

        const matchTexto = nombrePaciente.toLowerCase().includes(textoFiltro) || 
                           correoPaciente.toLowerCase().includes(textoFiltro);
        const matchEstado = estadoFiltro === "Todos" || cita.estado === estadoFiltro;

        if (!matchTexto || !matchEstado) return;

        let fechaMostrada = cita.fecha || 'Sin fecha';
        let horaMostrada = cita.hora || cita.horario || 'Por coordinar';

        let colorEstado = "#f0ad4e"; 
        if (cita.estado === "Completada") colorEstado = "#5cb85c"; 
        if (cita.estado === "Cancelada") colorEstado = "#d9534f"; 

        const etiquetaEstado = `<span style="background-color: ${colorEstado}; color: white; padding: 4px 8px; border-radius: 12px; font-size: 0.8rem; font-weight: bold;">${cita.estado}</span>`;

        const selectEstado = `
            <select onchange="cambiarEstadoCita(${indexOriginal}, this.value)" style="padding: 4px; font-size: 0.8rem; border-radius: 4px; border: 1px solid #ccc; cursor: pointer;">
                <option value="" disabled selected>Cambiar estado...</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Completada">Completada</option>
                <option value="Cancelada">Cancelada</option>
            </select>
        `;

        const nombreServicio = cita.servicioNombre || cita.nombre || 'Servicio Nutricional';

        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td><strong>${fechaMostrada}</strong><br><small>${horaMostrada}</small></td>
            <td><strong>${nombrePaciente || 'Paciente'}</strong><br><small style="color: #666;">${correoPaciente}</small></td>
            <td>${nombreServicio}</td>
            <td>${etiquetaEstado}</td>
            <td>${selectEstado}</td>
        `;
        tbody.appendChild(fila);
    });
}

window.cambiarEstadoCita = function(indexOriginal, nuevoEstado) {
    if (confirm(`¿Seguro que deseas cambiar el estado de esta cita a ${nuevoEstado}?`)) {
        // ACTUALIZACIÓN DE ESTADO EN LA BASE CORRECTA
        let citas = JSON.parse(localStorage.getItem("nutrivida_citas") || "[]");
        
        if (citas[indexOriginal]) {
            citas[indexOriginal].estado = nuevoEstado;
            localStorage.setItem("nutrivida_citas", JSON.stringify(citas));
            renderizarCitas(); 
        }
    } else {
        renderizarCitas();
    }
};