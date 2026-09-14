// Carrusel de la vista Nosotros 

const track = document.getElementById("carrusel-track");
const imagenes = document.querySelectorAll(".carrusel__img");
const btnPrev = document.getElementById("btn-prev");
const btnNext = document.getElementById("btn-next");
const dotsContainer = document.getElementById("carrusel-dots");

let indiceActual = 0;
const totalImagenes = imagenes.length;

// --- Crear los puntos (dots) dinámicamente, uno por imagen ---
function crearDots() {
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

// --- Mover el track al índice indicado ---
function irAImagen(indice) {
  indiceActual = (indice + totalImagenes) % totalImagenes; // vuelve al inicio si se pasa del final
  track.style.transform = `translateX(-${indiceActual * 100}%)`;
  actualizarDots();
}

// --- Eventos de los botones ---
btnPrev.addEventListener("click", () => irAImagen(indiceActual - 1));
btnNext.addEventListener("click", () => irAImagen(indiceActual + 1));

// --- Inicialización ---
crearDots();
actualizarDots();