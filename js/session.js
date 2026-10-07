const CLAVE_SESION = "nutrivida_sesion";

document.addEventListener("DOMContentLoaded", () => {
  const sesionGuardada = localStorage.getItem(CLAVE_SESION);
  const linkAuth = document.getElementById("navAuthLink");
  const navMenu = document.getElementById("navMenu");

  if (!linkAuth) return;

  if (sesionGuardada) {
    const sesion = JSON.parse(sesionGuardada);
    
    linkAuth.textContent = `Hola, ${sesion.nombre} · Cerrar sesión`;
    linkAuth.href = "#";
    
    if (navMenu) {
      const linkCitas = document.createElement("a");
      linkCitas.href = "citas.html";
      
      // NUEVO: Verificar si estamos en la página de citas para resaltarlo en blanco
      if (window.location.pathname.includes("citas.html")) {
          linkCitas.className = "navbar__link is-active";
      } else {
          linkCitas.className = "navbar__link";
      }
      
      linkCitas.textContent = "Mis Citas";
      navMenu.insertBefore(linkCitas, linkAuth);
    }
    
    linkAuth.addEventListener("click", (e) => {
      e.preventDefault();
      const confirmar = confirm("¿Estás seguro de que deseas cerrar sesión?");
      if (confirmar) {
        localStorage.removeItem(CLAVE_SESION);
        window.location.href = "index.html";
      }
    });
  }
});