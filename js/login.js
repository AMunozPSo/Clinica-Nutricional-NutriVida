const CLAVE_USUARIOS = "nutrivida_usuarios";
const CLAVE_SESION = "nutrivida_sesion";
const ADMIN_CORREO = "admin@nutrivida.cl";

document.addEventListener("DOMContentLoaded", () => {
  sembrarAdminSiNoExiste();

  const form = document.getElementById("loginForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const errorEmail = document.getElementById("errorEmail");
  const errorPassword = document.getElementById("errorPassword");
  const errorCredenciales = document.getElementById("errorCredenciales");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let isValid = true;

    if (errorCredenciales) errorCredenciales.style.display = "none";

    // Validación de formato + dominio permitido
    const emailRegex = /^[^\s@]+@(duocuc\.cl|gmail\.com)$/i;
    if (!emailRegex.test(emailInput.value.trim())) {
      errorEmail.textContent = "Solo se aceptan correos @duocuc.cl o @gmail.com.";
      errorEmail.style.display = "block";
      emailInput.style.borderColor = "#b3402c";
      isValid = false;
    } else {
      errorEmail.style.display = "none";
      emailInput.style.borderColor = "var(--color-3)";
    }

    // Validación de contraseña
    if (passwordInput.value.trim().length < 6) {
      errorPassword.style.display = "block";
      passwordInput.style.borderColor = "#b3402c";
      isValid = false;
    } else {
      errorPassword.style.display = "none";
      passwordInput.style.borderColor = "var(--color-3)";
    }

    if (!isValid) return;

    // Buscar credenciales entre los usuarios guardados
    const usuarios = obtenerUsuarios();
    const correoNormalizado = emailInput.value.trim().toLowerCase();
    const usuario = usuarios.find(
      (u) => u.correo === correoNormalizado && u.password === passwordInput.value
    );

    if (!usuario) {
      if (errorCredenciales) {
        errorCredenciales.textContent = "Correo o contraseña incorrectos.";
        errorCredenciales.style.display = "block";
      } else {
        alert("Correo o contraseña incorrectos.");
      }
      return;
    }

    // Guardar sesión activa
    const sesion = {
      correo: usuario.correo,
      run: usuario.run,
      nombre: usuario.correo.split("@")[0],
      esAdmin: usuario.correo === ADMIN_CORREO,
    };
    localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));

    window.location.href = sesion.esAdmin ? "home-admin.html" : "index.html";
  });
});

function obtenerUsuarios() {
  const data = localStorage.getItem(CLAVE_USUARIOS);
  return data ? JSON.parse(data) : [];
}

function guardarUsuarios(usuarios) {
  localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
}

// Crea una cuenta admin de prueba la primera vez, ya que el registro aún no pide "tipo de usuario"
function sembrarAdminSiNoExiste() {
  const usuarios = obtenerUsuarios();
  const existeAdmin = usuarios.some((u) => u.correo === ADMIN_CORREO);
  if (!existeAdmin) {
    usuarios.push({ run: "00000000", correo: ADMIN_CORREO, password: "admin123", region: "", comuna: "" });
    guardarUsuarios(usuarios);
  }
}