const CLAVE_SESION = "nutrivida_sesion";

document.addEventListener("DOMContentLoaded", () => {
  const sesionGuardada = localStorage.getItem(CLAVE_SESION);
  const linkAuth = document.getElementById("navAuthLink");

  if (!linkAuth) return; 

  if (sesionGuardada) {
    const sesion = JSON.parse(sesionGuardada);
    linkAuth.textContent = `Hola, ${sesion.nombre} · Cerrar sesión`;
    linkAuth.href = "#";
    
    linkAuth.addEventListener("click", (e) => {
      e.preventDefault();
      
      // Agregamos una confirmación antes de cerrar
      const confirmar = confirm("¿Estás seguro de que deseas cerrar sesión?");
      
      if (confirmar) {
        localStorage.removeItem(CLAVE_SESION);
        window.location.href = "index.html";
      }
    });
  }
});