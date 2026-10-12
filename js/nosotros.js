document.addEventListener('DOMContentLoaded', () => {
    
    cargarEquipoMedico();
    
    crearDots();
    actualizarDots();
});

function cargarEquipoMedico() {
    const equipoGrid = document.getElementById('equipo-grid');
    if (!equipoGrid) return;

    const lista1 = JSON.parse(localStorage.getItem('nutrivida_usuarios')) || [];
    const lista2 = JSON.parse(localStorage.getItem('usuarios')) || [];

    let todosLosUsuarios = [...lista1, ...lista2];
    const esMedico = (user) => {
        const correo = (user.correo || user.email || "").toLowerCase();
        return user.rol === 'medico' || correo.endsWith('@clinnutrivida.cl');
    };

    const hayMedicos = todosLosUsuarios.some(esMedico);

    if (!hayMedicos) {
        const medicosDefault = [
            { nombre: "Camila Rojas", correo: "c.rojas@clinnutrivida.cl", rol: "medico" },
            { nombre: "Ignacio Fuentes", correo: "i.fuentes@clinnutrivida.cl", rol: "medico" }
        ];
        todosLosUsuarios = [...todosLosUsuarios, ...medicosDefault];
        localStorage.setItem('nutrivida_usuarios', JSON.stringify([...lista1, ...medicosDefault]));
    }
    

    const medicos = todosLosUsuarios.filter(esMedico);

    equipoGrid.innerHTML = '';

    medicos.forEach(medico => {
        const nombreMostrar = medico.nombre || medico.nombres || "Doctor"; 
        const emailMostrar = medico.correo || medico.email;
        const avatarDinamico = `https://ui-avatars.com/api/?name=${encodeURIComponent(nombreMostrar)}&background=1e293b&color=ffffff&size=300`;

        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${avatarDinamico}" alt="Foto de ${nombreMostrar}">
            <h3>${nombreMostrar}</h3>
            <p class="text-muted">Nutricionista clínico</p>
            <p style="font-size: 0.9rem; margin-top: 10px;">Especialista de Clínica NutriVida.<br>Contacto: <strong>${emailMostrar}</strong></p>
        `;
        equipoGrid.appendChild(card);
    });
}

const track = document.getElementById("carrusel-track");
const imagenes = document.querySelectorAll(".carrusel__img");
const btnPrev = document.getElementById("btn-prev");
const btnNext = document.getElementById("btn-next");
const dotsContainer = document.getElementById("carrusel-dots");

let indiceActual = 0;
const totalImagenes = imagenes.length;


function crearDots() {
    if (!dotsContainer) return;
    for (let i = 0; i < totalImagenes; i++) {
        const dot = document.createElement("button");
        dot.classList.add("carrusel__dot");
        dot.setAttribute("aria-label", `Ir a la imagen ${i + 1}`);
        dot.addEventListener("click", () => irAImagen(i));
        dotsContainer.appendChild(dot);
    }
}

function actualizarDots() {
    const dots = document.querySelectorAll(".carrusel__dot");
    dots.forEach((dot, index) => {
        dot.classList.toggle("carrusel__dot--activo", index === indiceActual);
    });
}


function irAImagen(indice) {
    indiceActual = (indice + totalImagenes) % totalImagenes; 
    
  
    track.style.transform = `translateX(-${indiceActual * 100}%)`; 
    actualizarDots();
}

if (btnPrev && btnNext) {
    btnPrev.addEventListener("click", () => irAImagen(indiceActual - 1));
    btnNext.addEventListener("click", () => irAImagen(indiceActual + 1));
}