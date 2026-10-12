document.addEventListener("DOMContentLoaded", () => {
    
    const sesionGuardada = localStorage.getItem("nutrivida_sesion");
    if (!sesionGuardada) {
        window.location.href = "login.html";
        return;
    }
    const sesion = JSON.parse(sesionGuardada);
    if (!sesion.esAdmin) {
        alert("Acceso denegado.");
        window.location.href = "index.html";
        return;
    }

    const btnCerrar = document.getElementById("btnCerrarSesionAdmin");
    if (btnCerrar) {
        btnCerrar.addEventListener("click", (e) => {
            e.preventDefault();
            if (confirm("¿Seguro que deseas cerrar sesión?")) {
                localStorage.removeItem("nutrivida_sesion");
                window.location.href = "login.html";
            }
        });
    }

    const formNP = document.getElementById("formNuevoPaciente");
    if (formNP) {
        formNP.addEventListener("submit", function(e) {
            e.preventDefault();
            
            const nombre = document.getElementById("npNombre").value.trim();
            const run = document.getElementById("npRun").value.trim();
            const correo = document.getElementById("npCorreo").value.trim().toLowerCase();
            const password = document.getElementById("npPass").value.trim();

            let usuarios = JSON.parse(localStorage.getItem("nutrivida_usuarios") || "[]");
            
            if (usuarios.some(u => u.correo === correo)) {
                alert("Error: Ya existe una cuenta con este correo electrónico.");
                return;
            }
            const rolAsignado = correo.endsWith("@clinnutrivida.cl") ? "medico" : "paciente";

            usuarios.push({
                nombre: nombre,
                run: run,
                correo: correo,
                password: password,
                rol: rolAsignado, 
                region: "", 
                comuna: "",
                telefono: ""
            });
            
            localStorage.setItem("nutrivida_usuarios", JSON.stringify(usuarios));
            alert(`Usuario ${nombre} registrado con éxito.\nContraseña temporal: ${password}`);
            
            formNP.reset();
            toggleFormNuevoPaciente();
            renderizarTablaUsuarios();
        });
    }

    renderizarTablaUsuarios();
});

window.toggleFormNuevoPaciente = function() {
    const div = document.getElementById("contenedorNuevoPaciente");
    div.style.display = div.style.display === "none" ? "block" : "none";
};

function renderizarTablaUsuarios() {
    const tbody = document.getElementById("tablaUsuariosBody");
    tbody.innerHTML = "";

    const usuarios = JSON.parse(localStorage.getItem("nutrivida_usuarios") || "[]");
    const carritoGlobal = JSON.parse(localStorage.getItem("nutrivida_carrito") || "[]");

    const ADMIN_CORREOS_BASE = ["anto.munozp@duocuc.cl", "feli.arayah@duocuc.cl"];
    const sesionActual = JSON.parse(localStorage.getItem("nutrivida_sesion"));
    const yoSoySuperAdmin = ADMIN_CORREOS_BASE.includes(sesionActual.correo);

    if (usuarios.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 20px;">No hay usuarios registrados.</td></tr>`;
        return;
    }

    usuarios.forEach((usuario) => {
        const serviciosTomados = carritoGlobal.filter(cita => cita.correo_usuario === usuario.correo).length;
        
        const esSuperAdmin = ADMIN_CORREOS_BASE.includes(usuario.correo);
        const esAdminRegular = usuario.rol === "admin" && !esSuperAdmin;
        

        const esMedico = usuario.rol === "medico" || (usuario.correo && usuario.correo.toLowerCase().endsWith("@clinnutrivida.cl"));
        
        let etiquetaRol = 'Paciente';
        if (esSuperAdmin) {
            etiquetaRol = '<span style="color: var(--color-gold); font-weight: bold;">Super Admin</span>';
        } else if (esAdminRegular) {
            etiquetaRol = '<span style="color: #4a90e2; font-weight: bold;">Admin</span>';
        } else if (esMedico) {
            etiquetaRol = '<span style="color: var(--color-forest); font-weight: bold; background-color: rgba(62, 124, 114, 0.1); padding: 3px 8px; border-radius: 12px; font-size: 0.85rem;">Médico Especialista</span>';
        }

        let botones = '';
        if (esSuperAdmin) {

            botones = '<span style="color: gray; font-size: 0.85rem;">Intocable</span>';
        } else if (esAdminRegular) {
            if (yoSoySuperAdmin) {

                botones += `<button class="btn btn--secondary" onclick="quitarAdmin('${usuario.correo}')" style="padding: 5px 10px; font-size: 0.8rem; margin-right: 5px;">Quitar Admin</button>`;
                botones += `<button class="btn btn--primary" onclick="eliminarUsuario('${usuario.correo}')" style="padding: 5px 10px; font-size: 0.8rem; background-color: #d9534f; border-color: #d9534f; color: white;">Eliminar</button>`;
            } else {

                botones = '<span style="color: gray; font-size: 0.85rem;">Protegido</span>';
            }
        } else {

            if (yoSoySuperAdmin) {

                botones += `<button class="btn btn--secondary" onclick="hacerAdmin('${usuario.correo}')" style="padding: 5px 10px; font-size: 0.8rem; margin-right: 5px;">Hacer Admin</button>`;
            }

            botones += `<button class="btn btn--primary" onclick="eliminarUsuario('${usuario.correo}')" style="padding: 5px 10px; font-size: 0.8rem; background-color: #d9534f; border-color: #d9534f; color: white;">Eliminar</button>`;
        }

        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td><strong>${usuario.nombre || 'Sin nombre'}</strong><br><small>${usuario.run || 'Sin RUN'}</small></td>
            <td>${usuario.correo}</td>
            <td>${etiquetaRol}</td>
            <td style="text-align: center;"><strong>${serviciosTomados}</strong></td>
            <td>${botones}</td>
        `;
        tbody.appendChild(fila);
    });
}

window.hacerAdmin = function(correo) {
    if (confirm(`¿Dar privilegios de administrador a ${correo}?`)) {
        let usuarios = JSON.parse(localStorage.getItem("nutrivida_usuarios") || "[]");
        const index = usuarios.findIndex(u => u.correo === correo);
        if (index !== -1) {
            usuarios[index].rol = "admin";
            localStorage.setItem("nutrivida_usuarios", JSON.stringify(usuarios));
            renderizarTablaUsuarios(); 
        }
    }
};

window.quitarAdmin = function(correo) {
    if (confirm(`¿Revocar privilegios de administrador a ${correo}?`)) {
        let usuarios = JSON.parse(localStorage.getItem("nutrivida_usuarios") || "[]");
        const index = usuarios.findIndex(u => u.correo === correo);
        if (index !== -1) {
            usuarios[index].rol = correo.endsWith("@clinnutrivida.cl") ? "medico" : "paciente";
            localStorage.setItem("nutrivida_usuarios", JSON.stringify(usuarios));
            renderizarTablaUsuarios(); 
        }
    }
};

window.eliminarUsuario = function(correo) {
    if (confirm(`¿Estás 100% seguro de eliminar la cuenta de ${correo}?`)) {
        let usuarios = JSON.parse(localStorage.getItem("nutrivida_usuarios") || "[]");
        usuarios = usuarios.filter(u => u.correo !== correo);
        localStorage.setItem("nutrivida_usuarios", JSON.stringify(usuarios));
        renderizarTablaUsuarios();
    }
};