# Clínica Nutricional NutriVida

Proyecto académico para la asignatura **DSY1104 - Desarrollo Fullstack II**, Evaluación Parcial 1 (30%), Duoc UC.

Sitio web frontend para una clínica nutricional ficticia ubicada en Temuco, Región de La Araucanía. Permite a los pacientes explorar el catálogo de servicios, agendar citas, revisar su historial de progreso y su plan alimenticio, y cuenta con un panel de administración para la gestión interna de la clínica.

## Integrantes

- Antonia Muñoz 
- Felipe Araya

## Stack tecnológico

- **HTML5** — estructura semántica, sitio multipágina (sin frameworks ni SPA).
- **CSS3** — variables CSS, Flexbox y Grid, diseño mobile-first, sistema de diseño compartido (`css/global.css`).
- **JavaScript (vanilla)** — validación de formularios, manipulación del DOM, persistencia con `localStorage`.
- **Leaflet.js** — única librería externa permitida, usada solo en la vista de Contacto para el mapa interactivo.
- **Google Fonts** — Fraunces (títulos) y Work Sans (texto).


## Cómo probarlo localmente

1. Clona el repositorio:
git clone https://github.com/AMunozPSo/Clinica-Nutricional-NutriVida.git

2. Ábrelo en VS Code.
3. Instala la extensión **Live Server** (si no la tienes).
4. Clic derecho sobre `index.html` → **Open with Live Server**.

> No abras los archivos con doble clic directamente (`file://`), ya que el mapa de Leaflet en Contacto no carga bien sin un servidor local.

## Documentación

- Especificación de Requisitos (ERS): `docs/ERS.docx`
- Planilla de requerimientos: `docs/Planilla_Requerimientos.xlsx`

## Estado del proyecto

Entrega 1 — capa frontend con datos simulados (`localStorage` y arreglos en JavaScript). La persistencia real y las reglas de negocio se implementarán en una futura arquitectura backend.

