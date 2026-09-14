<<<<<<< HEAD
<<<<<<< HEAD
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('is-active');
        const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', !isExpanded);
    });
}
=======
// Lógica global para el Navbar responsivo
document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            // Alterna la clase para mostrar/ocultar el menú
            navMenu.classList.toggle('is-active');
            
            // Cambia el atributo de accesibilidad
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
        });
    }
});
>>>>>>> 17d0dbf56098ecc9c9d3508fbb2c8f327680c76f
=======
// Lógica global para el Navbar responsivo
document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            // Alterna la clase para mostrar/ocultar el menú
            navMenu.classList.toggle('is-active');
            
            // Cambia el atributo de accesibilidad
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
        });
    }
});

>>>>>>> 28f145ca0ead4e067b88b20f9dbc2a5a22fa8092
