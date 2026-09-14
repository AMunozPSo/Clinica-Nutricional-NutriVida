const datosUbicacion = {
    "Valparaíso": ["Villa Alemana", "Quilpué", "Viña del Mar", "Valparaíso"],
    "Metropolitana": ["Santiago", "Providencia", "Ñuñoa", "Maipú"],
    "Biobío": ["Concepción", "Talcahuano", "Los Ángeles"]
};

const form = document.getElementById('registroForm');
const inputRun = document.getElementById('runInput');
const inputCorreo = document.getElementById('correoInput');
const inputPass = document.getElementById('passInput');
const selectRegion = document.getElementById('regionSelect');
const selectComuna = document.getElementById('comunaSelect');

const errRun = document.getElementById('errorRun');
const errCorreo = document.getElementById('errorCorreo');
const errPass = document.getElementById('errorPass');
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

form.addEventListener('submit', function(evento) {
    evento.preventDefault();
    let formularioValido = true;

    errRun.style.display = 'none';
    errCorreo.style.display = 'none';
    errPass.style.display = 'none';
    errUbi.style.display = 'none';
    msjExito.style.display = 'none';

    const runRegex = /^[0-9kK]{7,9}$/;
    if (!runRegex.test(inputRun.value)) {
        errRun.style.display = 'block';
        formularioValido = false;
    }

    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!correoRegex.test(inputCorreo.value)) {
        errCorreo.style.display = 'block';
        formularioValido = false;
    }

    if (inputPass.value.trim().length < 6) {
        errPass.style.display = 'block';
        formularioValido = false;
    }

    if (selectRegion.value === "" || selectComuna.value === "") {
        errUbi.style.display = 'block';
        formularioValido = false;
    }

    if (formularioValido) {
        msjExito.style.display = 'block';
        form.reset();
        selectComuna.disabled = true;
        selectComuna.innerHTML = '<option value="">Seleccione primero una región...</option>';
    }
});