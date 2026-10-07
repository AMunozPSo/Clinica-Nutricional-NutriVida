document.addEventListener("DOMContentLoaded", function() {
    const formulario = document.getElementById("formulario-cita");
    const campoServicio = document.getElementById("servicio");
    const campoNutricionista = document.getElementById("nutricionista");
    const campoFecha = document.getElementById("fecha");
    const campoHorario = document.getElementById("horario");
    const campoMotivo = document.getElementById("motivo");
    const mensajeResultado = document.getElementById("mensaje-resultado");
    const btnVerCitas = document.getElementById("btn-ver-citas");

    // Evitar seleccionar fechas en el pasado
    const hoy = new Date().toISOString().split('T')[0];
    campoFecha.setAttribute('min', hoy);

    // Bloques de 30 minutos desde 08:30 hasta 17:00
    const bloquesHorarios = [
        "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
        "12:00", "12:30", "13:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
    ];

    function actualizarHorarios() {
        const fecha = campoFecha.value;

        // Limpiar las opciones anteriores
        campoHorario.innerHTML = '<option value="">-- Selecciona hora --</option>';

        if (!fecha) {
            campoHorario.disabled = true;
            campoHorario.innerHTML = '<option value="">Primero elige fecha</option>';
            return;
        }

        // --- 1. Validación Lunes a Viernes ---
        const partesFecha = fecha.split("-");
        const fechaObj = new Date(partesFecha[0], partesFecha[1] - 1, partesFecha[2]);
        const diaSemana = fechaObj.getDay(); 
        
        // 0 = Domingo, 6 = Sábado
        if (diaSemana === 0 || diaSemana === 6) {
            campoHorario.disabled = true;
            campoHorario.innerHTML = '<option value="">Cerrado (Fin de semana)</option>';
            mostrarError("Solo atendemos de Lunes a Viernes. Por favor selecciona un día hábil.");
            return;
        } else {
            // CORRECCIÓN: Quitamos el texto Y quitamos la clase roja para que desaparezca la caja
            mensajeResultado.textContent = ""; 
            mensajeResultado.className = "mensaje-alerta"; 
        }

        // --- 2. Evitar topes con mis propias citas ---
        let carritoGlobal = [];
        const dataGuardada = localStorage.getItem("nutrivida_carrito");
        if (dataGuardada) {
            carritoGlobal = JSON.parse(dataGuardada);
        }

        const sesionActual = JSON.parse(localStorage.getItem("nutrivida_sesion") || "{}");
        const miCorreo = sesionActual.correo;

        // Buscar qué horas de ESE día ya tengo agendadas yo
        const misHorasOcupadas = carritoGlobal
            .filter(cita => cita.fecha === fecha && cita.correo_usuario === miCorreo && cita.estado !== "Cancelada")
            .map(cita => cita.horario);

        // --- 3. Llenar el select con los bloques libres ---
        let horasDisponibles = 0;
        bloquesHorarios.forEach(hora => {
            if (!misHorasOcupadas.includes(hora)) {
                const opcion = document.createElement("option");
                opcion.value = hora;
                opcion.textContent = hora;
                campoHorario.appendChild(opcion);
                horasDisponibles++;
            }
        });

        if (horasDisponibles === 0) {
            campoHorario.innerHTML = '<option value="">Ya agendaste todos los horarios libres de este día</option>';
            campoHorario.disabled = true;
        } else {
            campoHorario.disabled = false;
        }
    }

    // Volver a generar los horarios cada vez que cambia la fecha
    campoFecha.addEventListener("change", actualizarHorarios);

    // --- PROCESAR FORMULARIO ---
    formulario.addEventListener("submit", function(evento) {
        evento.preventDefault();

        const servicioTexto = campoServicio.value;
        const nutricionista = campoNutricionista.value;
        const fecha = campoFecha.value;
        const horario = campoHorario.value;
        const motivo = campoMotivo.value.trim();

        // CORRECCIÓN: Ahora validamos también que "servicioTexto" no esté vacío
        if (servicioTexto === "" || nutricionista === "" || fecha === "" || horario === "" || motivo === "") {
            mostrarError("Por favor, complete todos los campos obligatorios.");
            return;
        }

        const sesionActual = JSON.parse(localStorage.getItem("nutrivida_sesion") || "{}");
        const miCorreo = sesionActual.correo || "invitado@nutrivida.cl"; 

        let carritoGlobal = [];
        const dataGuardada = localStorage.getItem("nutrivida_carrito");
        if (dataGuardada) {
            carritoGlobal = JSON.parse(dataGuardada);
        }

        const nuevaCita = {
            id: Date.now(),
            correo_usuario: miCorreo,
            servicio: servicioTexto,
            nutricionista: nutricionista,
            fecha: fecha,
            horario: horario,
            motivo: motivo,
            estado: "Pendiente"
        };
        

        carritoGlobal.push(nuevaCita);
        localStorage.setItem("nutrivida_carrito", JSON.stringify(carritoGlobal));

        // Limpiar el formulario
        mensajeResultado.textContent = "";
        mensajeResultado.className = "mensaje-alerta";
        formulario.reset();
        
        // CORRECCIÓN: Se resetean los selects manualmente
        campoServicio.value = ""; 
        campoHorario.innerHTML = '<option value="">Primero elige fecha</option>';
        campoHorario.disabled = true;

        const agendarOtra = confirm("¡Cita agendada con éxito!\n\n¿Deseas agendar otra cita para otro servicio?");

        if (agendarOtra) {
            mensajeResultado.textContent = "Puedes continuar agendando.";
            mensajeResultado.className = "mensaje-alerta alerta-exito";
            
            // <-- AGREGA ESTO: Muestra el botón abajo del mensaje
            if (btnVerCitas) btnVerCitas.style.display = "block"; 
            
        } else {
            window.location.href = "citas.html";
        }
    });

    function mostrarError(mensaje) {
        mensajeResultado.textContent = mensaje;
        mensajeResultado.className = "mensaje-alerta alerta-error";
        if (btnVerCitas) btnVerCitas.style.display = "none";
    }
});