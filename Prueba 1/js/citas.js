document.addEventListener('DOMContentLoaded', renderizarCitas);

function renderizarCitas() {
    const citasBody = document.getElementById('citasBody');
    citasBody.innerHTML = ''; 
    

    const sesionGuardada = localStorage.getItem("nutrivida_sesion");
    if (!sesionGuardada) {
        citasBody.innerHTML = '<tr><td colspan="5" class="text-center">Debes iniciar sesión para ver tus citas.</td></tr>';
        return;
    }
    const miCorreo = JSON.parse(sesionGuardada).correo;


    let citasGlobales = [];
    const dataGuardada = localStorage.getItem("nutrivida_citas");
    if (dataGuardada) {
        citasGlobales = JSON.parse(dataGuardada);
    }

 
    const misCitas = citasGlobales.filter(cita => cita.pacienteCorreo === miCorreo);

    if (misCitas.length === 0) {
        citasBody.innerHTML = '<tr><td colspan="5" class="text-center" style="padding: 2rem;">No tienes citas registradas.</td></tr>';
        return;
    }

    misCitas.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));


    misCitas.forEach(cita => {
        const fila = document.createElement('tr');
        
        let botones = '';
        if (cita.estado !== 'Cancelada') {
            botones = `
                <button class="btn btn--secondary" onclick="reprogramarCita(${cita.id})" style="padding: 5px 10px; font-size: 0.85rem; margin-bottom: 5px;">Reprogramar</button>
                <button class="btn btn--primary" onclick="cancelarCita(${cita.id})" style="padding: 5px 10px; font-size: 0.85rem; background-color: #d9534f; color: white; border-color: #d9534f;">Cancelar</button>
            `;
        } else {
            botones = '<span style="color: gray; font-style: italic;">Sin acciones</span>';
        }

        const modalidad = cita.modalidad || 'Presencial';

        fila.innerHTML = `
            <td>${cita.fecha}<br><small>${cita.hora}</small></td>
            <td><strong>${cita.servicioNombre}</strong><br><small style="color: var(--color-text-soft);">${cita.doctor}</small></td>
            <td>${modalidad}</td>
            <td><strong>${cita.estado}</strong></td>
            <td>${botones}</td>
        `;
        citasBody.appendChild(fila);
    });
}

window.cancelarCita = function(id) {
    if (confirm('¿Estás seguro de que deseas cancelar esta cita? Al hacerlo, liberarás el horario.')) {
        
        let citasGlobales = JSON.parse(localStorage.getItem("nutrivida_citas") || "[]");
        
        const citaIndex = citasGlobales.findIndex(c => c.id === id);
        if (citaIndex !== -1) {
            citasGlobales[citaIndex].estado = 'Cancelada';
            localStorage.setItem("nutrivida_citas", JSON.stringify(citasGlobales));
            

            renderizarCitas(); 
        }
    }
};

window.reprogramarCita = function(id) {
    alert('Función en desarrollo: Próximamente podrás reprogramar la cita directamente.');
};