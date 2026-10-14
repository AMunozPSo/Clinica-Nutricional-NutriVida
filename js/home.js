document.addEventListener("DOMContentLoaded", () => {
    
    setTimeout(() => {

        const servicios = JSON.parse(localStorage.getItem("nutrivida_servicios") || "[]");
        
 
        const btnPediatrica = document.getElementById("modal-link-pediatrica");
        if(btnPediatrica && servicios.length > 0) {
            btnPediatrica.href = `solicitud-cita.html?servicio=${servicios[0].id}`;
        }

 
        const btnAdulto = document.getElementById("modal-link-adulto");
        if(btnAdulto && servicios.length > 1) {
            btnAdulto.href = `solicitud-cita.html?servicio=${servicios[1].id}`;
        }


        const btnDeportiva = document.getElementById("link-deportiva");
        if(btnDeportiva && servicios.length > 2) {
            btnDeportiva.href = `solicitud-cita.html?servicio=${servicios[2].id}`;
        }

        const btnVegana = document.getElementById("link-vegana");
        if(btnVegana && servicios.length > 3) {
            btnVegana.href = `solicitud-cita.html?servicio=${servicios[3].id}`;
        }

    }, 200); 


    const btnEvaluacion = document.getElementById("btn-evaluacion");
    const modal = document.getElementById("modal-evaluacion");

    if (btnEvaluacion && modal) {
        btnEvaluacion.addEventListener("click", (e) => {
            e.preventDefault();
            modal.style.display = "flex";
        });
    }
});