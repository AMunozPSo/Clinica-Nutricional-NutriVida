const datosUbicacion = {
    "Valparaíso": ["Villa Alemana", "Quilpué", "Viña del Mar", "Valparaíso"],
    "Metropolitana": ["Santiago", "Providencia", "Ñuñoa", "Maipú"],
    "Biobío": ["Concepción", "Talcahuano", "Los Ángeles"]
};

const CLAVE_USUARIOS = "nutrivida_usuarios";

const form = document.getElementById('registroForm');
const inputNombre = document.getElementById('nombreInput'); 
const inputRun = document.getElementById('runInput');
const inputTelefono = document.getElementById('telefonoInput'); 
const inputCorreo = document.getElementById('correoInput');
const inputPass = document.getElementById('passInput');
const inputPassConfirm = document.getElementById('passConfirmInput'); // NUEVO
const inputDireccion = document.getElementById('direccionInput'); 
const selectRegion = document.getElementById('regionSelect');
const selectComuna = document.getElementById('comunaSelect');

const errNombre = document.getElementById('errorNombre'); 
const errRun = document.getElementById('errorRun');
const errTelefono = document.getElementById('errorTelefono'); 
const errCorreo = document.getElementById('errorCorreo');
const errPass = document.getElementById('errorPass');
const errPassConfirm = document.getElementById('errorPassConfirm'); // NUEVO
const errDireccion = document.getElementById('errorDireccion'); 
const errUbi = document.getElementById('errorUbicacion');
const msjExito = document.getElementById('mensajeExito');

document.addEventListener('DOMContentLoaded', () => {
    for (let region in datosUbicacion) {
        let opcion = document.createElement('option');
        opcion.value = region;
        opcion.textContent = region;
        selectRegion.appendChild(opcion);
    }
});

selectRegion.addEventListener('change', function() {
    const regionSeleccionada = this.value;
    selectComuna.innerHTML = '<option value="">Seleccione una comuna...</option>';

    if (regionSeleccionada !== "") {
        selectComuna.disabled = false;
        datosUbicacion[regionSeleccionada].forEach(comuna => {
            let opcion = document.createElement('option');
            opcion.value = comuna;
            opcion.textContent = comuna;
            selectComuna.appendChild(opcion);
        });
    } else {
        selectComuna.disabled = true;
    }
});

function obtenerUsuarios() {
    const data = localStorage.getItem(CLAVE_USUARIOS);
    return data ? JSON.parse(data) : [];
}

function guardarUsuarios(usuarios) {
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
}

form.addEventListener('submit', function(evento) {
    evento.preventDefault();
    let formularioValido = true;

    errNombre.style.display = 'none';
    errRun.style.display = 'none';
    errTelefono.style.display = 'none';
    errCorreo.style.display = 'none';
    errPass.style.display = 'none';
    errPassConfirm.style.display = 'none'; // NUEVO
    errDireccion.style.display = 'none';
    errUbi.style.display = 'none';
    msjExito.style.display = 'none';

    if (inputNombre.value.trim() === "") {
        errNombre.style.display = 'block';
        formularioValido = false;
    }

    const runRegex = /^\d{7,8}-[\dkK]$/i;
    if (!runRegex.test(inputRun.value.trim())) {
        errRun.style.display = 'block';
        formularioValido = false;
    }

    const telefonoRegex = /^\d{9}$/;
    if (!telefonoRegex.test(inputTelefono.value.trim())) {
        errTelefono.style.display = 'block';
        formularioValido = false;
    }

    // ACTUALIZACIÓN: Expresión regular con todos los dominios permitidos
    const correoRegex = /^[^\s@]+@(duocuc\.cl|duoc\.cl|profesor\.duoc\.cl|gmail\.com|hotmail\.com|clinnutrivida\.cl)$/i;
    if (!correoRegex.test(inputCorreo.value)) {
        errCorreo.textContent = "Solo se aceptan correos institucionales (Duoc), Gmail, Hotmail o Clínicos.";
        errCorreo.style.display = 'block';
        formularioValido = false;
    }

    // Validación Contraseña
    if (inputPass.value.trim().length < 6) {
        errPass.style.display = 'block';
        formularioValido = false;
    } else if (inputPass.value !== inputPassConfirm.value) { // NUEVO: Comparación
        errPassConfirm.style.display = 'block';
        formularioValido = false;
    }

    if (inputDireccion.value.trim() === "") {
        errDireccion.style.display = 'block';
        formularioValido = false;
    }

    if (selectRegion.value === "" || selectComuna.value === "") {
        errUbi.style.display = 'block';
        formularioValido = false;
    }

    const usuarios = obtenerUsuarios();
    const correoNormalizado = inputCorreo.value.trim().toLowerCase();
    const yaExiste = usuarios.some(u => u.correo.toLowerCase() === correoNormalizado);

    if (formularioValido && yaExiste) {
        errCorreo.textContent = "Ya existe una cuenta registrada con este correo.";
        errCorreo.style.display = 'block';
        formularioValido = false;
    }

    if (formularioValido) {
        usuarios.push({
            nombre: inputNombre.value.trim(),
            run: inputRun.value.trim(),
            telefono: inputTelefono.value.trim(),
            correo: correoNormalizado,
            password: inputPass.value,
            direccion: inputDireccion.value.trim(),
            region: selectRegion.value,
            comuna: selectComuna.value,
            // Si el correo es de la clínica, le asignamos rol de doctor automáticamente; sino, paciente.
            rol: correoNormalizado.endsWith('@clinnutrivida.cl') ? 'doctor' : 'paciente' 
        });
        guardarUsuarios(usuarios);

        msjExito.textContent = "¡Registro exitoso! Redirigiendo a inicio de sesión...";
        msjExito.style.display = 'block';
        form.reset();
        selectComuna.disabled = true;
        selectComuna.innerHTML = '<option value="">Seleccione primero una región...</option>';

        setTimeout(() => {
            window.location.href = "login.html";
        }, 1500);
    }
});