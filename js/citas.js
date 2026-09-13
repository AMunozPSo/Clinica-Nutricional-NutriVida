const citasMock = [
    { id: 1, fecha: '2026-10-15', hora: '10:00', servicio: 'Consulta Nutricional Inicial', modalidad: 'Presencial', estado: 'Confirmada' },
    { id: 2, fecha: '2026-10-22', hora: '15:30', servicio: 'Taller: Lectura de Etiquetas', modalidad: 'Online', estado: 'Pendiente' },
    { id: 3, fecha: '2026-09-05', hora: '09:00', servicio: 'Plan Deportivo Avanzado', modalidad: 'Online', estado: 'Cancelada' }
];

const citasBody = document.getElementById('citasBody');

function renderizarCitas() {
    citasBody.innerHTML = ''; 
    
    if (citasMock.length === 0) {
        citasBody.innerHTML = '<tr><td colspan="5" class="text-center">No tienes citas registradas.</td></tr>';
        return;
    }

    citasMock.forEach(cita => {
        const fila = document.createElement('tr');
        
        let botones = '';
        if (cita.estado !== 'Cancelada') {
            botones = `
                <button class="btn btn--secondary" onclick="reprogramarCita(${cita.id})" style="padding: 5px 10px; font-size: 0.85rem; margin-bottom: 5px;">Reprogramar</button>
                <button class="btn btn--primary" onclick="cancelarCita(${cita.id})" style="padding: 5px 10px; font-size: 0.85rem; background-color: #d9534f; color: white;">Cancelar</button>
            `;
        } else {
            botones = '<span style="color: gray; font-style: italic;">Sin acciones</span>';
        }

        fila.innerHTML = `
            <td>${cita.fecha}<br><small>${cita.hora}</small></td>
            <td>${cita.servicio}</td>
            <td>${cita.modalidad}</td>
            <td><strong>${cita.estado}</strong></td>
            <td>${botones}</td>
        `;
        citasBody.appendChild(fila);
    });
}

window.cancelarCita = function(id) {
    if (confirm('¿Estás seguro de que deseas cancelar esta cita?')) {
        const citaIndex = citasMock.findIndex(c => c.id === id);
        if (citaIndex !== -1) {
            citasMock[citaIndex].estado = 'Cancelada';
            renderizarCitas(); 
        }
    }
};

window.reprogramarCita = function(id) {
    alert('Simulación: Se abriría el calendario para reprogramar la cita ID: ' + id);
};

document.addEventListener('DOMContentLoaded', renderizarCitas);