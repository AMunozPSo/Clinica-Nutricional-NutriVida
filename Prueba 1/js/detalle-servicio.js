document.addEventListener("DOMContentLoaded", () => {

    const parametros = new URLSearchParams(window.location.search);
    const idServicio = parseInt(parametros.get("id"));

    if (!idServicio) {
        window.location.href = "catalogo.html";
        return;
    }


    const servicios = NutriData.services();
    const servicio = servicios.find(s => s.id === idServicio);

    if (!servicio) {
        alert("El servicio no existe o fue eliminado.");
        window.location.href = "catalogo.html";
        return;
    }


    const formatoCLP = new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 2 });
    let catLabel = "Evaluaciones / Consultas";
    if (servicio.categoria === "planes") catLabel = "Plan Especializado";
    if (servicio.categoria === "talleres") catLabel = "Taller Grupal";


    document.getElementById("detalle-titulo").textContent = servicio.nombre;
    document.getElementById("detalle-categoria").textContent = catLabel;
    document.getElementById("detalle-desc").textContent = servicio.descripcion;
    document.getElementById("detalle-doctor").textContent = servicio.doctor || "Profesional por asignar";
    document.getElementById("detalle-precio").textContent = `Valor: ${formatoCLP.format(servicio.precio)}`;
    

    const image=document.createElement('img');image.src=servicio.imagen;image.alt=servicio.nombre;image.style.cssText='width:100%;max-width:500px;border-radius:12px';document.getElementById('detalle-desc').before(image)
    const button=document.createElement('button');button.textContent='Añadir al carrito';button.className='btn btn--primary';button.dataset.addCart=servicio.id;button.disabled=servicio.stock===0;document.getElementById('detalle-desc').after(button)
    document.getElementById("btn-agendar").href = `solicitud-cita.html?servicio=${servicio.id}`;
});