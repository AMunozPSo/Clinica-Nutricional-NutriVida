document.addEventListener("DOMContentLoaded", () => {
    cargarOpcionesDesdeAdmin();
    autocompletarDesdeURL();


    document.getElementById("fecha").addEventListener("change", (e) => {
        const selectHorario = document.getElementById("horario");
        if (e.target.value) {
            selectHorario.disabled = false;
            selectHorario.innerHTML = `
                <option value="09:00">09:00 hrs</option>
                <option value="11:30">11:30 hrs</option>
                <option value="15:00">15:00 hrs</option>
                <option value="17:00">17:00 hrs</option>
            `;
        } else {
            selectHorario.disabled = true;
            selectHorario.innerHTML = '<option value="">Primero elige fecha</option>';
        }
    });

    document.getElementById("formulario-cita").addEventListener("submit", procesarSolicitud);
});

function cargarOpcionesDesdeAdmin() {
    const servicios = JSON.parse(localStorage.getItem("nutrivida_servicios") || "[]");
    const selectServicio = document.getElementById("servicio");
    const selectNutricionista = document.getElementById("nutricionista");

    if (servicios.length > 0) {
        selectServicio.innerHTML = '<option value="">-- Selecciona un servicio --</option>';
        
        const doctoresUnicos = new Set();
        servicios.forEach(s => {
            selectServicio.innerHTML += `<option value="${s.id}" data-doctor="${s.doctor}">${s.nombre}</option>`;
            if (s.doctor) doctoresUnicos.add(s.doctor);
        });

        selectNutricionista.innerHTML = '<option value="">-- Selecciona un profesional --</option>';
        doctoresUnicos.forEach(doc => {
            selectNutricionista.innerHTML += `<option value="${doc}">${doc}</option>`;
        });
    }
}

function autocompletarDesdeURL() {
    const parametros = new URLSearchParams(window.location.search);
    const idServicio = parametros.get("servicio");

    if (idServicio) {
        const selectServicio = document.getElementById("servicio");
        selectServicio.value = idServicio;

        selectServicio.style.pointerEvents = "none";
        selectServicio.style.backgroundColor = "#e2e8f0";

        const opcionElegida = selectServicio.options[selectServicio.selectedIndex];
        if (opcionElegida && opcionElegida.dataset.doctor) {
            const selectNutri = document.getElementById("nutricionista");
            selectNutri.value = opcionElegida.dataset.doctor;
            

            selectNutri.style.pointerEvents = "none";
            selectNutri.style.backgroundColor = "#e2e8f0";
        }
    } else {

        document.getElementById("servicio").addEventListener("change", (e) => {
            const selectNutri = document.getElementById("nutricionista");
            const opcionElegida = e.target.options[e.target.selectedIndex];
            selectNutri.value = (opcionElegida && opcionElegida.dataset.doctor) ? opcionElegida.dataset.doctor : "";
        });
    }
}

function procesarSolicitud(e) {
    e.preventDefault();
    const servicio = document.getElementById("servicio").value;
    const fecha = document.getElementById("fecha").value;
    const horario = document.getElementById("horario").value;
    const divMensaje = document.getElementById("mensaje-resultado");

    if (!servicio || !fecha || !horario) {
        divMensaje.textContent = "Por favor, completa los campos requeridos.";
        divMensaje.className = "mensaje-alerta error";
        divMensaje.style.display = "block";
        return;
    }

    divMensaje.textContent = "¡Cita agendada con éxito! Revisa tu bandeja para más detalles.";
    divMensaje.className = "mensaje-alerta exito";
    divMensaje.style.display = "block";
    document.getElementById("btn-ver-citas").style.display = "block";
}