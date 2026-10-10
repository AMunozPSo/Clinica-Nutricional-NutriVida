# Clínica Nutricional NutriVida

Proyecto académico para la asignatura **DSY1104 - Desarrollo Fullstack II, Evaluación Parcial 1 (30%), Duoc UC**.

Sitio web frontend para una clínica nutricional ficticia ubicada en Temuco, Región de La Araucanía. El sistema abarca el flujo completo de atención clínica, ofreciendo una vista pública para pacientes y paneles privados con control de acceso basado en roles (RBAC) para la administración y el personal médico.

## 👥 Integrantes
- Antonia Muñoz
- Felipe Araya

## ✨ Funcionalidades Principales

El proyecto cuenta con un sistema de roles automatizado y validación estricta de dominios de correo, dividiendo la plataforma en tres niveles de acceso:

*   **Administrador:** Acceso total al **Panel Admin**. Permite gestionar el catálogo de servicios, administrar usuarios, controlar los estados de las citas y visualizar un Dashboard de Reportes con KPIs financieros y operativos en tiempo real.
*   **Médico (Portal Médico):** Rol asignado automáticamente a los registros con dominio `@clinnutrivida.cl`. Otorga acceso a una agenda privada de solo lectura para visualizar las citas asignadas, estado y motivos de consulta.
*   **Paciente:** Rol estándar para correos validados (`@duoc.cl`, `@duocuc.cl`, `@gmail.com`, `@hotmail.com`). Permite explorar servicios, agendar citas médicas y gestionar el historial desde la vista "Mis Citas".

## 💻 Stack Tecnológico
- **HTML5:** Estructura semántica, sitio multipágina (sin frameworks ni SPA).
- **CSS3:** Variables CSS, Flexbox y Grid, diseño mobile-first, sistema de diseño unificado (`css/global.css`).
- **JavaScript (Vanilla):** Lógica de roles, validación de formularios mediante expresiones regulares, manipulación del DOM y renderizado dinámico de tablas/kpis.
- **LocalStorage:** Motor de base de datos local para la persistencia simulada de usuarios, catálogo, citas y sesiones multiplataforma.
- **Leaflet.js:** Única librería externa permitida, usada en la vista de Contacto para el mapa interactivo.
- **Google Fonts:** Fraunces (títulos) y Work Sans (texto).

## 🚀 Cómo probarlo localmente

1. Clona el repositorio: git clone https://github.com/AMunozPSo/Clinica-Nutricional-NutriVida.git
2. Ábrelo en Visual Studio Code.
3. Instala la extensión Live Server (si no la tienes).
4. Haz clic derecho sobre index.html → Open with Live Server.⚠️ Importante: No abras los archivos con doble clic directamente (file://), ya que el mapa de Leaflet en Contacto y las rutas de LocalStorage pueden presentar problemas sin un servidor local.

Credenciales de Prueba (Roles)
Para evaluar las distintas vistas protegidas, utiliza las siguientes reglas de acceso:
- Administrador: Se inicia sesión con anto.munozp@duocuc.cl o feli.arayah@duocuc.cl.
- Doctor: Regístrate utilizando cualquier correo terminado en @clinnutrivida.cl para acceder al Portal Médico.
- Paciente: Regístrate utilizando correos @gmail.com o institucionales Duoc para acceder al agendamiento tradicional.

📄 Documentación
- Especificación de Requisitos (ERS): docs/ERS.docx
- Planilla de requerimientos: docs/Planilla_Requerimientos.xlsx

📌 Estado del proyecto
Entrega 1 completada: Capa frontend finalizada con validaciones de seguridad, enrutamiento condicional y datos simulados reactivos (localStorage y arreglos en JavaScript). La persistencia real y las reglas de negocio definitivas se implementarán en una futura arquitectura backend.
