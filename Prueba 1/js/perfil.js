document.addEventListener('DOMContentLoaded', () => {
    
    const sesionGuardada = localStorage.getItem("nutrivida_sesion");
    if (!sesionGuardada) {
        window.location.href = "login.html";
        return;
    }

    const sesion = JSON.parse(sesionGuardada);
    let usuarios = JSON.parse(localStorage.getItem("nutrivida_usuarios") || "[]");

    const usuarioActual = usuarios.find(u => u.correo === sesion.correo);

    if (!usuarioActual) {
        alert("Error: No se encontraron los datos del perfil.");
        return;
    }

    document.getElementById("perfRun").value = usuarioActual.run || "Sin registrar";
    document.getElementById("perfCorreo").value = usuarioActual.correo;
    document.getElementById("perfNombre").value = usuarioActual.nombre || "";
    document.getElementById("perfTelefono").value = usuarioActual.telefono || "";
    document.getElementById("perfDireccion").value = usuarioActual.direccion || "";

    const form = document.getElementById("perfilForm");

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const inputNombre = document.getElementById("perfNombre").value.trim();
        const inputTelefono = document.getElementById("perfTelefono").value.trim();
        const inputDireccion = document.getElementById("perfDireccion").value.trim();
        const inputPass = document.getElementById("perfPass").value.trim();
        const inputPassConfirm = document.getElementById("perfPassConfirm").value.trim(); // NUEVO

        const errTelefono = document.getElementById("errPerfTelefono");
        const errPass = document.getElementById("errPerfPass");
        const errPassConfirm = document.getElementById("errPerfPassConfirm"); // NUEVO
        const mensajeExito = document.getElementById("perfMensaje");

        let valido = true;
        errTelefono.style.display = "none";
        errPass.style.display = "none";
        errPassConfirm.style.display = "none"; // NUEVO
        mensajeExito.style.display = "none";

        const telefonoRegex = /^\d{9}$/;
        if (!telefonoRegex.test(inputTelefono)) {
            errTelefono.style.display = "block";
            valido = false;
        }

        // Validación de contraseña solo si intentó cambiarla
        if (inputPass !== "") {
            if (inputPass.length < 6) {
                errPass.style.display = "block";
                valido = false;
            } else if (inputPass !== inputPassConfirm) { // Comparación
                errPassConfirm.style.display = "block";
                valido = false;
            }
        }

        if (!valido) return;

        const index = usuarios.findIndex(u => u.correo === sesion.correo);
        usuarios[index].nombre = inputNombre;
        usuarios[index].telefono = inputTelefono;
        usuarios[index].direccion = inputDireccion;
        
        if (inputPass !== "") {
            usuarios[index].password = inputPass;
        }

        localStorage.setItem("nutrivida_usuarios", JSON.stringify(usuarios));
        
        sesion.nombre = inputNombre;
        localStorage.setItem("nutrivida_sesion", JSON.stringify(sesion));

        mensajeExito.style.display = "block";
        document.getElementById("perfPass").value = "";
        document.getElementById("perfPassConfirm").value = ""; // Limpiar también la confirmación

        setTimeout(() => {
            if (sesion.esAdmin) {
                window.location.href = "home-admin.html";
            } else {
                window.location.href = "index.html";
            }
        }, 1500);
    });
});