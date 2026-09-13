document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const errorEmail = document.getElementById("errorEmail");
  const errorPassword = document.getElementById("errorPassword");

  form.addEventListener("submit", (e) => {
    e.preventDefault(); 
    let isValid = true; 

    // Validcacion de correo electronico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value)) {
      errorEmail.style.display = "block"; 
      emailInput.style.borderColor = "#b3402c"; 
      isValid = false;
    } else {
      errorEmail.style.display = "none"; 
      emailInput.style.borderColor = "var(--color-3)"; 
    }

    // Validacion de contrasena 
    if (passwordInput.value.trim().length < 6) {
      errorPassword.style.display = "block";
      passwordInput.style.borderColor = "#b3402c";
      isValid = false;
    } else {
      errorPassword.style.display = "none";
      passwordInput.style.borderColor = "var(--color-3)";
    }

    if (isValid) {
      alert("La validacion fue exitosa!. Iniciando sesión...");
    }
  });
});