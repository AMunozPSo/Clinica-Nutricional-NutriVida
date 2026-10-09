document.addEventListener("DOMContentLoaded", function() {
    const formulario = document.getElementById("formulario-cita");
    const campoServicio = document.getElementById("servicio");
    const campoNutricionista = document.getElementById("nutricionista");
    const campoFecha = document.getElementById("fecha");
    const campoHorario = document.getElementById("horario");
    const campoMotivo = document.getElementById("motivo");
    const mensajeResultado = document.getElementById("mensaje-resultado");
    const btnVerCitas = document.getElementById("btn-ver-citas");

    // --- 1. CARGAR DATOS DESDE EL PANEL DE ADMIN ---
    const serviciosDb = JSON.parse(localStorage.getItem("nutrivida_servicios") || "[]");

    // Llenar selector de Servicios
    serviciosDb.forEach(s => {
        const opcion = document.createElement("option");
        opcion.value = s.nombre; 
        const precioStr = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(s.precio);
        opcion.textContent = `${s.nombre} (${precioStr})`;
        campoServicio.appendChild(opcion);
    });

    // Llenar selector de Doctores (sin repetir)
    const doctoresUnicos = [...new Set(serviciosDb.map(s => s.doctor).filter(d => d))];
    doctoresUnicos.forEach(doc => {
        const opcion = document.createElement("option");
        opcion.value = doc;
        opcion.textContent = doc;
        campoNutricionista.appendChild(opcion);
    });
    campoNutricionista.insertAdjacentHTML('beforeend', '<option value="Sin preferencia">Sin preferencia (El más próximo)</option>');

    // --- 2. LEER LA URL Y AUTOCOMPLETAR ---
    const urlParams = new URLSearchParams(window.location.search);
    const codigoSeleccionado = urlParams.get('codigo');

    if (codigoSeleccionado) {
        // Buscar el servicio en la base de datos usando el código
        const servicioEncontrado = serviciosDb.find(s => s.id == codigoSeleccionado);
        if (servicioEncontrado) {
            // Seleccionamos automáticamente el servicio y LO BLOQUEAMOS
            campoServicio.value = servicioEncontrado.nombre;
            campoServicio.disabled = true;
            
            if (servicioEncontrado.doctor) {
                // Seleccionamos automáticamente al doctor y LO BLOQUEAMOS
                campoNutricionista.value = servicioEncontrado.doctor;
                campoNutricionista.disabled = true;
            }
        }
    }

    // --- 3. LÓGICA DE HORARIOS ---
    const hoy = new Date().toISOString().split('T')[0];
    campoFecha.setAttribute('min', hoy);

    const bloquesHorarios = [
        "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
        "12:00", "12:30", "13:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
    ];

    function actualizarHorarios() {
        const fecha = campoFecha.value;
        campoHorario.innerHTML = '<option value="">-- Selecciona hora --</option>';

        if (!fecha) {
            campoHorario.disabled = true;
            campoHorario.innerHTML = '<option value="">Primero elige fecha</option>';
            return;
        }

        const partesFecha = fecha.split("-");
        const fechaObj = new Date(partesFecha[0], partesFecha[1] - 1, partesFecha[2]);
        const diaSemana = fechaObj.getDay(); 
        
        if (diaSemana === 0 || diaSemana === 6) {
            campoHorario.disabled = true;
            campoHorario.innerHTML = '<option value="">Cerrado (Fin de semana)</option>';
            mostrarError("Solo atendemos de Lunes a Viernes. Por favor selecciona un día hábil.");
            return;
        } else {
            mensajeResultado.textContent = ""; 
            mensajeResultado.className = "mensaje-alerta"; 
        }

        let carritoGlobal = JSON.parse(localStorage.getItem("nutrivida_carrito") || "[]");
        const sesionActual = JSON.parse(localStorage.getItem("nutrivida_sesion") || "{}");
        const miCorreo = sesionActual.correo;

        const misHorasOcupadas = carritoGlobal
            .filter(cita => cita.fecha === fecha && cita.correo_usuario === miCorreo && cita.estado !== "Cancelada")
            .map(cita => cita.horario);

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

    campoFecha.addEventListener("change", actualizarHorarios);

    // --- 4. PROCESAR FORMULARIO ---
    formulario.addEventListener("submit", function(evento) {
        evento.preventDefault();

        const servicioTexto = campoServicio.value;
        const nutricionista = campoNutricionista.value;
        const fecha = campoFecha.value;
        const horario = campoHorario.value;
        const motivo = campoMotivo.value.trim();

        if (servicioTexto === "" || nutricionista === "" || fecha === "" || horario === "" || motivo === "") {
            mostrarError("Por favor, complete todos los campos obligatorios.");
            return;
        }

        const sesionActual = JSON.parse(localStorage.getItem("nutrivida_sesion") || "{}");
        const miCorreo = sesionActual.correo || "invitado@nutrivida.cl"; 
        const miNombre = sesionActual.nombre || "Paciente Invitado";
        
        let carritoGlobal = JSON.parse(localStorage.getItem("nutrivida_carrito") || "[]");

        const nuevaCita = {
            id: Date.now(),
            nombre_usuario: miNombre,
            correo_usuario: miCorreo,
            nombre: servicioTexto,
            servicio: servicioTexto,
            nutricionista: nutricionista,
            fecha: fecha,
            horario: horario,
            hora: horario,
            motivo: motivo,
            estado: "Pendiente"
        };
        
        carritoGlobal.push(nuevaCita);
        localStorage.setItem("nutrivida_carrito", JSON.stringify(carritoGlobal));

        mensajeResultado.textContent = "";
        mensajeResultado.className = "mensaje-alerta";
        formulario.reset();
        
        // DESBLOQUEAR LOS CAMPOS EN CASO DE QUERER AGENDAR OTRA COSA NUEVA
        campoServicio.disabled = false;
        campoNutricionista.disabled = false;
        
        campoServicio.value = ""; 
        campoHorario.innerHTML = '<option value="">Primero elige fecha</option>';
        campoHorario.disabled = true;

        const agendarOtra = confirm("¡Cita agendada con éxito!\n\n¿Deseas agendar otra cita para otro servicio?");

        if (agendarOtra) {
            mensajeResultado.textContent = "Puedes continuar agendando.";
            mensajeResultado.className = "mensaje-alerta alerta-exito";
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