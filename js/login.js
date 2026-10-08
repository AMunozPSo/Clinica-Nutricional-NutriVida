const CLAVE_USUARIOS = "nutrivida_usuarios";
// CAMBIO CLAVE: Le cambiamos el nombre para que no choque con session.js
const LOGIN_CLAVE_SESION = "nutrivida_sesion"; 

const ADMIN_CORREOS = [
  "anto.munozp@duocuc.cl",
  "feli.arayah@duocuc.cl"
];

document.addEventListener("DOMContentLoaded", () => {
  sembrarAdminsSiNoExisten();

  const form = document.getElementById("loginForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const errorCredenciales = document.getElementById("errorCredenciales");
  const errorEmail = document.getElementById("errorEmail");
  const errorPassword = document.getElementById("errorPassword");

  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault(); 
    
    // Escondemos mensajes viejos
    if (errorCredenciales) errorCredenciales.style.display = "none";
    if (errorEmail) errorEmail.style.display = "none";
    if (errorPassword) errorPassword.style.display = "none";
    emailInput.style.borderColor = "var(--color-3)";
    passwordInput.style.borderColor = "var(--color-3)";

    const correoIngresado = emailInput.value.trim().toLowerCase();
    const passIngresada = passwordInput.value.trim();

    let isValid = true;

    // Validaciones
    if (correoIngresado === "") {
        if (errorEmail) errorEmail.style.display = "block";
        emailInput.style.borderColor = "#b3402c";
        isValid = false;
    }

    if (passIngresada.length < 6) {
        if (errorPassword) errorPassword.style.display = "block";
        passwordInput.style.borderColor = "#b3402c";
        isValid = false;
    }

    if (!isValid) return;

    // Buscar en la base de datos local
    const usuarios = obtenerUsuarios();
    const usuarioEncontrado = usuarios.find((u) => u.correo === correoIngresado);

    if (!usuarioEncontrado) {
        if (errorCredenciales) {
            errorCredenciales.innerHTML = "Esta cuenta no existe. <a href='registro.html' style='text-decoration: underline; color: #b3402c;'>Regístrate aquí</a>.";
            errorCredenciales.style.display = "block";
        }
        return;
    }

    // Verificar contraseña
    if (usuarioEncontrado.password !== passIngresada) {
        if (errorCredenciales) {
            errorCredenciales.textContent = "La contraseña es incorrecta.";
            errorCredenciales.style.display = "block";
        }
        return;
    }

    // Inicio de sesión exitoso
    const esAdmin = ADMIN_CORREOS.includes(usuarioEncontrado.correo) || usuarioEncontrado.rol === "admin";

    const sesion = {
      correo: usuarioEncontrado.correo,
      nombre: esAdmin ? "Administrador" : (usuarioEncontrado.nombre || usuarioEncontrado.correo.split("@")[0]), 
      esAdmin: esAdmin,
    };
    
    // Usamos la variable con el nuevo nombre
    localStorage.setItem(LOGIN_CLAVE_SESION, JSON.stringify(sesion));

    window.location.href = esAdmin ? "home-admin.html" : "index.html";
  });
});

function obtenerUsuarios() {
  const data = localStorage.getItem(CLAVE_USUARIOS);
  return data ? JSON.parse(data) : [];
}

function guardarUsuarios(usuarios) {
  localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
}

function sembrarAdminsSiNoExisten() {
  const usuarios = obtenerUsuarios();
  let huboCambios = false;

  ADMIN_CORREOS.forEach(correoAdmin => {
    const index = usuarios.findIndex((u) => u.correo === correoAdmin);
    
    if (index === -1) {
      usuarios.push({ 
          nombre: "Administrador", 
          correo: correoAdmin, 
          password: "admin123"
      });
      huboCambios = true;
    } else if (usuarios[index].password !== "admin123" && !usuarios[index].password) {
      usuarios[index].password = "admin123";
      huboCambios = true;
    }
  });

  if (huboCambios) {
    guardarUsuarios(usuarios);
  }
}