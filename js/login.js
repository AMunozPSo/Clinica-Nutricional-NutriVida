const CLAVE_USUARIOS = "nutrivida_usuarios";

const ADMIN_CORREO = "admin@nutrivida.cl";

document.addEventListener("DOMContentLoaded", () => {
  sembrarAdminSiNoExiste();

  const form = document.getElementById("loginForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const errorEmail = document.getElementById("errorEmail");
  const errorPassword = document.getElementById("errorPassword");
  const errorCredenciales = document.getElementById("errorCredenciales");

  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault(); // Esto frena la recarga de la página
    let isValid = true;

    if (errorCredenciales) errorCredenciales.style.display = "none";

    // Validación de formato + dominios permitidos
    const emailRegex = /^[^\s@]+@(duoc\.cl|duocuc\.cl|profesor\.duoc\.cl|gmail\.com|nutrivida\.cl)$/i;
    if (!emailRegex.test(emailInput.value.trim())) {
      if (errorEmail) {
        errorEmail.textContent = "Usa un correo válido (@duoc.cl o @gmail.com).";
        errorEmail.style.display = "block";
      }
      if (emailInput) emailInput.style.borderColor = "#b3402c";
      isValid = false;
    } else {
      if (errorEmail) errorEmail.style.display = "none";
      if (emailInput) emailInput.style.borderColor = "var(--color-3)";
    }

    // Validación de contraseña
    if (passwordInput.value.trim().length < 6) {
      if (errorPassword) errorPassword.style.display = "block";
      if (passwordInput) passwordInput.style.borderColor = "#b3402c";
      isValid = false;
    } else {
      if (errorPassword) errorPassword.style.display = "none";
      if (passwordInput) passwordInput.style.borderColor = "var(--color-3)";
    }

    if (!isValid) return;

    // Lógica de búsqueda de cuenta
    const usuarios = obtenerUsuarios();
    const correoNormalizado = emailInput.value.trim().toLowerCase();
    
    // 1. Verificamos si el correo existe
    const usuarioEncontrado = usuarios.find((u) => u.correo === correoNormalizado);

    if (!usuarioEncontrado) {
      if (errorCredenciales) {
        errorCredenciales.innerHTML = "Esta cuenta no existe. <a href='registro.html' style='text-decoration: underline; color: #b3402c;'>Regístrate aquí</a>.";
        errorCredenciales.style.display = "block";
      } else {
        alert("Esta cuenta no existe. Por favor, regístrate.");
      }
      return;
    }

    // 2. Si existe, verificamos contraseña
    if (usuarioEncontrado.password !== passwordInput.value) {
      if (errorCredenciales) {
        errorCredenciales.textContent = "La contraseña es incorrecta.";
        errorCredenciales.style.display = "block";
      } else {
        alert("La contraseña es incorrecta.");
      }
      return;
    }

    // 3. Éxito: Guardamos la sesión
    const sesion = {
      correo: usuarioEncontrado.correo,
      run: usuarioEncontrado.run,
      // Usamos el nombre real, y si no existe (como el admin), cortamos el correo
      nombre: usuarioEncontrado.nombre || usuarioEncontrado.correo.split("@")[0], 
      esAdmin: usuarioEncontrado.correo === ADMIN_CORREO,
    };
    localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));

    // 4. Redirigimos a inicio
    window.location.href = sesion.esAdmin ? "home-admin.html" : "index.html";
  });
});

function obtenerUsuarios() {
  try {
    const data = localStorage.getItem(CLAVE_USUARIOS);
    const parsed = data ? JSON.parse(data) : [];
    
    // Aquí está la solución: si lo que está guardado no es un arreglo válido por culpa de pruebas viejas, lo borra y empieza limpio.
    if (!Array.isArray(parsed)) {
      localStorage.removeItem(CLAVE_USUARIOS); 
      return [];
    }
    return parsed;
  } catch (error) {
    localStorage.removeItem(CLAVE_USUARIOS);
    return [];
  }
}

function guardarUsuarios(usuarios) {
  localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
}

function sembrarAdminSiNoExiste() {
  const usuarios = obtenerUsuarios();
  const existeAdmin = usuarios.some((u) => u.correo === ADMIN_CORREO);
  if (!existeAdmin) {
    usuarios.push({ run: "00000000", correo: ADMIN_CORREO, password: "admin123", region: "", comuna: "" });
    guardarUsuarios(usuarios);
  }
}