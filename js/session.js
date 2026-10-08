const CLAVE_SESION = "nutrivida_sesion";

document.addEventListener("DOMContentLoaded", () => {
  const sesionGuardada = localStorage.getItem(CLAVE_SESION);
  const linkAuth = document.getElementById("navAuthLink"); // El botón original
  const navMenu = document.getElementById("navMenu");

  if (!linkAuth || !navMenu) return;

  if (sesionGuardada) {
    const sesion = JSON.parse(sesionGuardada);
    
    // Ocultamos el botón original de Iniciar Sesión
    linkAuth.style.display = "none";
    
    // 1. Enlace a "Mis Citas"
    const linkCitas = document.createElement("a");
    linkCitas.href = "citas.html";
    linkCitas.className = window.location.pathname.includes("citas.html") ? "navbar__link is-active" : "navbar__link";
    linkCitas.textContent = "Mis Citas";
    navMenu.appendChild(linkCitas);

    // 2. Enlace a "Panel Admin" (solo administradores)
    if (sesion.esAdmin) {
        const linkAdmin = document.createElement("a");
        linkAdmin.href = "home-admin.html";
        linkAdmin.className = "navbar__link";
        linkAdmin.textContent = "Panel Admin";
        linkAdmin.style.color = "var(--color-gold)";
        linkAdmin.style.fontWeight = "bold";
        navMenu.appendChild(linkAdmin);
    }

    // 3. NUEVO: Enlace "Hola, [Nombre]" que lleva al perfil
    const linkPerfil = document.createElement("a");
    linkPerfil.href = "perfil.html";
    linkPerfil.className = window.location.pathname.includes("perfil.html") ? "navbar__link is-active" : "navbar__link";
    linkPerfil.textContent = `Hola, ${sesion.nombre}`;
    linkPerfil.style.fontWeight = "600";
    navMenu.appendChild(linkPerfil);

    // 4. NUEVO: Botón de Cerrar Sesión separado
    const btnLogout = document.createElement("a");
    btnLogout.href = "#";
    btnLogout.className = "navbar__link navbar__link--cta";
    btnLogout.textContent = "Cerrar sesión";
    btnLogout.style.backgroundColor = "#d9534f"; // Rojo sutil para diferenciar
    btnLogout.style.borderColor = "#d9534f";
    
    btnLogout.addEventListener("click", (e) => {
      e.preventDefault();
      if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
        localStorage.removeItem(CLAVE_SESION);
        window.location.href = "index.html";
      }
    });
    
    navMenu.appendChild(btnLogout);
  }
});