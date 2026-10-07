document.addEventListener('DOMContentLoaded', renderizarCitas);

function renderizarCitas() {
    const citasBody = document.getElementById('citasBody');
    citasBody.innerHTML = ''; 
    
    // 1. Revisar quién está logueado
    const sesionGuardada = localStorage.getItem("nutrivida_sesion");
    if (!sesionGuardada) {
        citasBody.innerHTML = '<tr><td colspan="5" class="text-center">Debes iniciar sesión para ver tus citas.</td></tr>';
        return;
    }
    const miCorreo = JSON.parse(sesionGuardada).correo;

    // 2. Traer el carrito global
    let carritoGlobal = [];
    const dataGuardada = localStorage.getItem("nutrivida_carrito");
    if (dataGuardada) {
        carritoGlobal = JSON.parse(dataGuardada);
    }

    // 3. Filtrar solo mis citas
    const misCitas = carritoGlobal.filter(cita => cita.correo_usuario === miCorreo);

    if (misCitas.length === 0) {
        citasBody.innerHTML = '<tr><td colspan="5" class="text-center" style="padding: 2rem;">No tienes citas registradas en tu carrito.</td></tr>';
        return;
    }

    // Opcional: Ordenar las citas por fecha para que se vean más ordenadas
    misCitas.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    // 4. Dibujar la tabla
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

        // Asumimos presencial ya que no lo pedimos en el nuevo form
        const modalidad = cita.modalidad || 'Presencial';

        fila.innerHTML = `
            <td>${cita.fecha}<br><small>${cita.horario}</small></td>
            <td><strong>${cita.servicio}</strong><br><small style="color: var(--color-text-soft);">${cita.nutricionista}</small></td>
            <td>${modalidad}</td>
            <td><strong>${cita.estado}</strong></td>
            <td>${botones}</td>
        `;
        citasBody.appendChild(fila);
    });
}

// 5. Lógica real para cancelar citas
window.cancelarCita = function(id) {
    if (confirm('¿Estás seguro de que deseas cancelar esta cita? Al hacerlo, liberarás el horario.')) {
        
        let carritoGlobal = JSON.parse(localStorage.getItem("nutrivida_carrito") || "[]");
        
        const citaIndex = carritoGlobal.findIndex(c => c.id === id);
        if (citaIndex !== -1) {
            carritoGlobal[citaIndex].estado = 'Cancelada';
            localStorage.setItem("nutrivida_carrito", JSON.stringify(carritoGlobal));
            
            // Volvemos a dibujar la tabla para que se actualice al instante
            renderizarCitas(); 
        }
    }
};

window.reprogramarCita = function(id) {
    alert('Función en desarrollo: Próximamente podrás reprogramar la cita directamente.');
};