document.addEventListener("DOMContentLoaded", () => {
    const servicios = JSON.parse(localStorage.getItem("nutrivida_servicios") || "[]");
    
    const obtenerId = (nombreExacto) => {
        const servicio = servicios.find(s => s.nombre === nombreExacto);
        return servicio ? servicio.id : "";
    };

    // Identificadores de los servicios (DEBEN coincidir exactamente con los nombres en el panel admin)
    const idPediatrica = obtenerId("Evaluación Nutricional Pediátrica");
    const idAdulto = obtenerId("Evaluación Nutricional Integral del Adulto");
    const idDeportiva = obtenerId("Plan de Nutrición para Deportistas");
    const idVegana = obtenerId("Plan de Control de Peso 100% Plant-Based");

    // Conectar enlaces directos (Tarjetas 2 y 3)
    if(idDeportiva) document.getElementById("link-deportiva").href = `detalle-servicio.html?id=${idDeportiva}`;
    if(idVegana) document.getElementById("link-vegana").href = `detalle-servicio.html?id=${idVegana}`;

    // Conectar botones dentro de la ventana emergente
    if(idPediatrica) document.getElementById("modal-link-pediatrica").href = `detalle-servicio.html?id=${idPediatrica}`;
    if(idAdulto) document.getElementById("modal-link-adulto").href = `detalle-servicio.html?id=${idAdulto}`;

    // Lógica para abrir la ventana emergente al hacer clic en Evaluación Inicial
    const btnEvaluacion = document.getElementById("btn-evaluacion");
    const modal = document.getElementById("modal-evaluacion");

    if (btnEvaluacion && modal) {
        btnEvaluacion.addEventListener("click", (e) => {
            e.preventDefault();
            modal.style.display = "flex";
        });
    }
});