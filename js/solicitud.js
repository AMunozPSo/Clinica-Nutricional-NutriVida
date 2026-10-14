document.addEventListener("DOMContentLoaded", () => {
    cargarOpcionesDesdeAdmin();
    autocompletarDesdeURL();

    // 1. Bloquear fechas del pasado (poner como fecha mínima hoy)
    const inputFecha = document.getElementById("fecha");
    const fechaHoy = new Date().toISOString().split("T")[0];
    inputFecha.setAttribute("min", fechaHoy);

    // 2. Controlar qué pasa cuando el paciente elige una fecha
    inputFecha.addEventListener("change", (e) => {
        const selectHorario = document.getElementById("horario");
        const divMensaje = document.getElementById("mensaje-resultado");
        
        if (e.target.value) {
            // El truco de la 'T00:00:00' es para que no se desfase por la zona horaria
            const fechaSeleccionada = new Date(e.target.value + "T00:00:00");
            const diaSemana = fechaSeleccionada.getDay(); // 0 es Domingo, 6 es Sábado

            if (diaSemana === 0 || diaSemana === 6) {
                // Si es fin de semana: borramos la fecha, bloqueamos la hora y mostramos error
                e.target.value = ""; 
                selectHorario.disabled = true;
                selectHorario.innerHTML = '<option value="">Primero elige fecha</option>';
                
                divMensaje.textContent = "Atendemos de Lunes a Viernes. Por favor, elige un día hábil.";
                divMensaje.className = "mensaje-alerta error";
                divMensaje.style.display = "block";
                return;
            }

            // Si es día hábil (Lunes a Viernes): ocultamos errores y mostramos horas cada 30 min
            divMensaje.style.display = "none";
            selectHorario.disabled = false;
            
            // Lista de horarios disponibles (puedes borrar alguna si quieres simular hora de colación)
            const horasDisponibles = [
                "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
                "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
                "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
                "18:00", "18:30"
            ];
            
            selectHorario.innerHTML = '<option value="">-- Elige una hora --</option>';
            horasDisponibles.forEach(hora => {
                selectHorario.innerHTML += `<option value="${hora}">${hora} hrs</option>`;
            });

        } else {
            // Si el usuario borra la fecha manualmente
            selectHorario.disabled = true;
            selectHorario.innerHTML = '<option value="">Primero elige fecha</option>';
            divMensaje.style.display = "none";
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

        // BLOQUEO DE SERVICIO: Impide hacer clic y lo pone en gris
        selectServicio.style.pointerEvents = "none";
        selectServicio.style.backgroundColor = "#e2e8f0";

        const opcionElegida = selectServicio.options[selectServicio.selectedIndex];
        if (opcionElegida && opcionElegida.dataset.doctor) {
            const selectNutri = document.getElementById("nutricionista");
            selectNutri.value = opcionElegida.dataset.doctor;
            
            // BLOQUEO DE DOCTOR: Impide hacer clic y lo pone en gris
            selectNutri.style.pointerEvents = "none";
            selectNutri.style.backgroundColor = "#e2e8f0";
        }
    } else {
        // Si alguien entra a agendar sin seleccionar un servicio previo, el doctor cambia automáticamente al elegir servicio
        document.getElementById("servicio").addEventListener("change", (e) => {
            const selectNutri = document.getElementById("nutricionista");
            const opcionElegida = e.target.options[e.target.selectedIndex];
            selectNutri.value = (opcionElegida && opcionElegida.dataset.doctor) ? opcionElegida.dataset.doctor : "";
        });
    }
}

function procesarSolicitud(e) {
    e.preventDefault();
    
    const selectServicio = document.getElementById("servicio");
    const servicioId = selectServicio.value;
    const nombreServicio = selectServicio.options[selectServicio.selectedIndex]?.text || "Servicio Médico";
    
    const nutricionista = document.getElementById("nutricionista").value;
    const fecha = document.getElementById("fecha").value;
    const horario = document.getElementById("horario").value;
    const motivo = document.getElementById("motivo").value;
    const divMensaje = document.getElementById("mensaje-resultado");

    if (!servicioId || !fecha || !horario || !nutricionista) {
        divMensaje.textContent = "Por favor, completa los campos requeridos.";
        divMensaje.className = "mensaje-alerta error";
        divMensaje.style.display = "block";
        return;
    }

    // 1. Identificamos quién inició sesión
    const sesionActual = JSON.parse(localStorage.getItem("nutrivida_sesion"));
    const nombrePaciente = sesionActual ? sesionActual.nombre : "Usuario Invitado";
    const correoPaciente = sesionActual ? sesionActual.correo : "Sin correo";

    // 2. Traemos las citas anteriores (si no hay, creamos una lista vacía)
    let citasGuardadas = JSON.parse(localStorage.getItem("nutrivida_citas") || "[]");

    // 3. Creamos la "ficha" de la nueva cita
    const nuevaCita = {
        id: Date.now(), 
        pacienteNombre: nombrePaciente,
        pacienteCorreo: correoPaciente,
        servicioId: servicioId,
        servicioNombre: nombreServicio,
        doctor: nutricionista,
        fecha: fecha,
        hora: horario,
        motivo: motivo,
        estado: "Pendiente" 
    };

    // 4. Guardamos la cita en el sistema
    citasGuardadas.push(nuevaCita);
    localStorage.setItem("nutrivida_citas", JSON.stringify(citasGuardadas));

    divMensaje.textContent = "¡Cita agendada con éxito! Ya está guardada en el sistema.";
    divMensaje.className = "mensaje-alerta exito";
    divMensaje.style.display = "block";
    
    document.getElementById("btn-ver-citas").style.display = "block";
    document.querySelector(".btn-submit").disabled = true;
}