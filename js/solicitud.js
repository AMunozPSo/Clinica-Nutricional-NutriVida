document.addEventListener("DOMContentLoaded", function() {
    
    const formulario = document.getElementById("formulario-cita");
    const campoServicio = document.getElementById("servicio");
    const campoNutricionista = document.getElementById("nutricionista");
    const campoFecha = document.getElementById("fecha");
    const campoHorario = document.getElementById("horario");
    const campoMotivo = document.getElementById("motivo");
    const mensajeResultado = document.getElementById("mensaje-resultado");

    formulario.addEventListener("submit", function(evento) {
        evento.preventDefault();

        const servicioTexto = campoServicio.value;
        const nutricionista = campoNutricionista.value;
        const fecha = campoFecha.value;
        const horario = campoHorario.value;
        const motivo = campoMotivo.value.trim();

        // Validación de campos vacíos
        if (nutricionista === "" || fecha === "" || horario === "" || motivo === "") {
            mensajeResultado.textContent = "Por favor, complete todos los campos obligatorios.";
            mensajeResultado.className = "mensaje-alerta alerta-error";
            return;
        }

        // --- LÓGICA DEL CARRITO (localStorage) ---
        
        // 1. Obtener el carrito actual o crear uno vacío
        let carrito = [];
        const carritoGuardado = localStorage.getItem("nutrivida_carrito");
        if (carritoGuardado) {
            carrito = JSON.parse(carritoGuardado);
        }

        // 2. Crear el objeto de la nueva cita
        const nuevaCita = {
            id: Date.now(), // Genera un ID único basado en el tiempo
            servicio: servicioTexto,
            nutricionista: nutricionista,
            fecha: fecha,
            horario: horario,
            motivo: motivo,
            estado: "Pendiente"
        };

        // 3. Agregar la cita al carrito y guardar en localStorage
        carrito.push(nuevaCita);
        localStorage.setItem("nutrivida_carrito", JSON.stringify(carrito));

        // --- LÓGICA DE NAVEGACIÓN ---

        // Limpiar mensajes y formulario
        mensajeResultado.textContent = "";
        formulario.reset();
        campoServicio.value = "Evaluación Nutricional Integral ($25.000)"; // Mantener valor bloqueado por ahora

        // Preguntar al usuario qué desea hacer
        const agendarOtra = confirm("¡Cita agendada y guardada en tu carrito con éxito!\n\n¿Deseas agendar otra cita para otro servicio?");

        if (agendarOtra) {
            // Se queda en la página para seguir agendando
            mensajeResultado.textContent = "Puedes continuar agendando.";
            mensajeResultado.className = "mensaje-alerta alerta-exito";
        } else {
            // Redirige al carrito / mis citas
            window.location.href = "citas.html";
        }
    });
});