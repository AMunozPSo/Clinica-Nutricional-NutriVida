document.addEventListener("DOMContentLoaded", () => {
    const navAuthLink = document.getElementById("navAuthLink");
    const navMenu = document.getElementById("navMenu");
    
    const sesionGuardada = localStorage.getItem("nutrivida_sesion");

    if (sesionGuardada && navAuthLink) {
        const sesion = JSON.parse(sesionGuardada);
        
        // 1. Detectar si el correo termina en el dominio de la clínica
        const esDoctor = sesion.correo.toLowerCase().endsWith("@clinnutrivida.cl");
        
        // 2. Modificar el saludo
        let saludo = `Hola, ${sesion.nombre}`;
        if (sesion.esAdmin) {
            saludo = "Hola, Administrador";
        } else if (esDoctor) {
            saludo = `Hola, Dr/a. ${sesion.nombre}`;
        }

        // 3. Crear los enlaces condicionales
        let enlacesEspeciales = "";
        
        if (sesion.esAdmin) {
            enlacesEspeciales = `<a href="home-admin.html" class="navbar__link" style="color: var(--color-sage); font-weight: 600;">Panel Admin</a>`;
        } else if (esDoctor) {
            enlacesEspeciales = `<a href="panel-doctor.html" class="navbar__link" style="color: var(--color-sage); font-weight: 600;">Control Citas</a>`;
        } else {
            enlacesEspeciales = `<a href="citas.html" class="navbar__link">Mis Citas</a>`;
        }

        // Reemplazar el botón de login por el menú de usuario conectado
        navAuthLink.outerHTML = `
            ${enlacesEspeciales}
            <span class="navbar__link" style="font-weight: 500; cursor: default;">${saludo}</span>
            <a href="#" id="btnCerrarSesionGlobal" class="navbar__link navbar__link--cta" style="background-color: #d9534f; color: white;">Cerrar sesión</a>
        `;

        document.getElementById("btnCerrarSesionGlobal").addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("nutrivida_sesion");
            window.location.href = "index.html";
        });
    }
});