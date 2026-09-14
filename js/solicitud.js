document.addEventListener("DOMContentLoaded", function() {
    
    const formulario = document.getElementById("formulario-cita");
    const campoNutricionista = document.getElementById("nutricionista");
    const campoFecha = document.getElementById("fecha");
    const campoHorario = document.getElementById("horario");
    const campoMotivo = document.getElementById("motivo");
    const mensajeResultado = document.getElementById("mensaje-resultado");

    formulario.addEventListener("submit", function(evento) {
        evento.preventDefault();

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

        // Si todo está correcto
        mensajeResultado.textContent = "¡Solicitud confirmada! Cita el " + fecha + " a las " + horario + ".";
        mensajeResultado.className = "mensaje-alerta alerta-exito";
        
        formulario.reset();
        
        // Mantener el servicio bloqueado con su valor
        document.getElementById("servicio").value = "Evaluación Nutricional Integral ($25.000)";
    });
});