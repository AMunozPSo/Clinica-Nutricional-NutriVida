DUOC UC  ESCUELA DE INFORMÁTICA Y TELECOMUNICACIONES

Especificación de Requisitos de Software

Proyecto Clínica Nutricional NutriVida

Autores Felipe Araya y Antonia Muñoz

DSY1104 Desarrollo Fullstack II

Evaluación Parcial 2  ERS V2

Revisión 2.2  18 de octubre de 2026

Actualización de la propuesta inicial y especificación del frontend React, con criterios de aceptación y trazabilidad de los requisitos.

Contenido

Ficha del documento	3

1. Introducción	4

1.1. Propósito	4

1.2. Ámbito del Sistema	4

1.3. Definiciones, Acrónimos y Abreviaturas	4

1.4. Referencias	5

1.5. Visión General del Documento	5

2. Descripción General	6

2.1. Perspectiva del Producto	6

2.2. Funciones del Producto	6

2.3. Características de los Usuarios	6

2.4. Restricciones	7

2.5. Suposiciones y Dependencias	7

2.6. Requisitos Futuros	7

3. Requisitos Específicos	8

3.1 Requisitos comunes de las interfaces	8

3.1.1 Interfaces de usuario	8

3.1.2 Interfaces de hardware	8

3.1.3 Interfaces de software	8

3.1.4 Interfaces de comunicación	8

3.2 Requisitos funcionales	9

3.3 Requisitos no funcionales	15

3.3.1 Requisitos de rendimiento	16

3.3.2 Seguridad	16

3.3.3 Fiabilidad	16

3.3.4 Disponibilidad	16

3.3.5 Mantenibilidad	16

3.3.6 Portabilidad	16

3.4 Otros Requisitos	17

# Ficha del documento

Fecha | Revisión | Autor | Modificación

12/09/2026 | 1.0 | Equipo | Puntos 1 a 2 de la propuesta inicial.

14/09/2026 | 2.0 | Equipo | Versión previa completada para la primera etapa.

18/10/2026 | 2.1 | Felipe Araya y Antonia Muñoz | ERS V2 para EP2. Migración React, ampliación del caso y contraste con los 29 requisitos originales.

18/10/2026 | 2.2 | Felipe Araya y Antonia Muñoz | Corrección del índice y estructura para conservar los apartados originales.



Estado de validación: documento actualizado para revisión académica. La aceptación del docente y cualquier firma de conformidad quedan pendientes; no se registra una aprobación que no haya ocurrido.

La numeración R.1 a R.29 conserva la planilla inicial. Cada requisito mantiene su descripción, criterio de aceptación y estado observado. “Implementado” describe lo existente en el código; “Parcial” identifica diferencias con la propuesta y no implica aceptación formal.

# 1.  Introducción

## 1.1.	Propósito

Esta ERS define los requisitos de NutriVida y los criterios que permiten verificar su implementación en la Evaluación Parcial 2. Está dirigida al equipo de desarrollo, al docente y a quienes revisen el prototipo. Actualiza la propuesta inicial de la clínica, conserva sus identificadores y separa la funcionalidad existente de los puntos pendientes.

## 1.2.	Ámbito del Sistema

NutriVida digitaliza la consulta de servicios, el agendamiento y el seguimiento nutricional de una clínica ficticia. Los pacientes pueden registrarse, editar su perfil, reservar y cancelar citas, consultar su progreso y leer el plan asignado. El nutricionista consulta su agenda y asigna planes; el administrador mantiene usuarios, servicios, categorías, citas y reportes.

La segunda etapa incorpora carrito, checkout y resultados de pago simulados para adaptar el caso de tienda de la evaluación. La compra guarda una orden y un comprobante académico; no reserva una hora automáticamente. La reserva de atención se realiza en un flujo separado.

El alcance implementado es un frontend React con persistencia local. No procesa cobros bancarios reales, no emite documentos tributarios, no realiza diagnósticos automáticos ni administra historiales médicos externos. El backend Java, la base de datos central y la autenticación de servidor son trabajo futuro. La mención de integración backend del anexo debe confirmarse con el docente.

## 1.3.	Definiciones, Acrónimos y Abreviaturas

Término | Definición

ERS | Especificación de Requisitos de Software.

SPA | Aplicación de una sola página con rutas internas.

CRUD | Crear, consultar, actualizar y eliminar registros.

Props y estado | Datos recibidos y valores que cambian durante la interacción.

DOM | Modelo de objetos que representa el documento en el navegador.

localStorage | Almacenamiento por origen que persiste entre recargas.

RUN | Rol Único Nacional, identificador utilizado en los formularios del prototipo.

Mock y spy | Sustitución o interceptación controlada de una dependencia.

Cobertura | Código recorrido por las pruebas; no equivale a casos aprobados.

Comprobante académico | Resumen de una compra simulada, sin validez tributaria.



## 1.4.	Referencias

ERS completado de la Evaluación Parcial 1, Anexo 4, archivo terminado en (2), revisión 2.0 del 14/09/2026.

Plantilla original de ERS, Anexo 4, archivo terminado en (3), estructura de referencia basada en IEEE 830.

Planilla de Requerimientos, Evaluación Parcial 1, Anexo 2, hoja Requerimiento Inicial, R.1 a R.29.

DSY1104 Evaluación Parcial 2, Anexo 1 Instrucciones, páginas 1 a 12, y pauta EE EP Estudiante, páginas 1 a 9.

Repositorio del proyecto: https://github.com/AMunozPSo/Clinica-Nutricional-NutriVida. Base de código revisada: commit 18ba6dc.

Informe de testing y evidencias locales de la verificación del 18/10/2026, 20:42, conservados en nutrivida-react/docs. Las últimas cargas de ejemplos son posteriores a esa medición.

## 1.5.	Visión General del Documento

Este documento conserva la estructura de la ERS original. La sección 1 presenta propósito, alcance, definiciones y referencias. La sección 2 describe el producto, usuarios, restricciones, dependencias y requisitos futuros. La sección 3 especifica interfaces, requisitos funcionales y no funcionales, y otros requisitos de la entrega.

# 2.	Descripción General

## 2.1.	Perspectiva del Producto

La solución evoluciona desde HTML, CSS y JavaScript a una SPA desarrollada con React, Vite, React Router y React Bootstrap. App define rutas; Navbar, Footer y TarjetaServicio reutilizan presentación; los formularios manejan su estado con hooks. Los módulos storage, admin, booking, account, commerce y clinical encapsulan datos y validaciones sobre localStorage.

La arquitectura cliente servidor descrita en la versión anterior sigue siendo una evolución futura. En esta etapa los datos no se comparten entre dispositivos ni entre orígenes distintos del navegador. Las rutas privadas y los roles se simulan en el cliente.

## 2.2.	Funciones del Producto

La interfaz pública presenta Inicio, Nosotros, Contacto, Blog, categorías, catálogo, ofertas y detalle de servicios. El usuario puede buscar y filtrar, iniciar sesión, gestionar su perfil, consultar y cancelar citas, comprar servicios mediante un pago de prueba y consultar sus compras. La atención incluye progreso personal y plan vigente.

El panel administrativo incorpora resumen, usuarios, servicios, categorías, citas, órdenes, reportes y servicios incompletos. La agenda del nutricionista muestra sus citas asignadas y permite publicar planes para pacientes autorizados. Los datos de ejemplo se cargan una sola vez por versión y después pueden editarse o eliminarse.

## 2.3.	Características de los Usuarios

Actor | Características y tareas

Visitante | Conocimientos básicos de navegador; consulta contenido, catálogo y ofertas, se registra y puede probar la compra como invitado.

Paciente | Completa formularios, consulta su información y gestiona sus propias citas, compras, progreso y plan.

Nutricionista | Manejo básico de herramientas digitales; consulta su agenda y asigna planes a sus pacientes. No registra mediciones clínicas de terceros en esta versión.

Administrador | Manejo de paneles y roles; mantiene el catálogo y cuentas, revisa citas, historial, órdenes y reportes. Las cuentas principales gestionan privilegios elevados.

Equipo de desarrollo | Mantiene código, pruebas y documentos; reproduce la aplicación y explica su diseño y validación en la defensa.



## 2.4.	Restricciones

Para EP2 se requiere React, gestión de props y estado, navegación y formularios, diseño adaptable con Bootstrap y pruebas con Jasmine y Karma. Se retira la prohibición de frameworks de la Evaluación Parcial 1, porque contradice la tecnología solicitada en esta etapa.

La persistencia simulada se implementa en archivos JavaScript que leen y escriben localStorage. Se deben mantener los formatos heredados utilizados por el HTML sin borrar datos del usuario. Las credenciales y permisos de demostración no deben emplearse con información clínica real.

No se presupone que el docente haya aceptado cambios respecto de la planilla: las diferencias de RUN, mapa, reprogramación, desactivación y cupos quedan identificadas en sus requisitos. No se sustituyen silenciosamente por funciones distintas.

## 2.5.	Suposiciones y Dependencias

Se requiere navegador moderno con JavaScript y Web Storage habilitados. Para instalar y verificar el proyecto se utiliza Node.js 24, dependencias del archivo de bloqueo y Chrome o Edge para Karma. La interfaz conserva sus datos mientras se use el mismo origen; limpiar el almacenamiento elimina los registros locales.

OpenStreetMap y las fuentes externas requieren conexión. El mapa está embebido por iframe y no utiliza actualmente Leaflet. La reserva aplica fecha y hora de America/Santiago; la prueba de aceptación debe usar un día hábil futuro y un horario libre.

## 2.6.	Requisitos Futuros

Integrar una API Java y Spring Boot con una base relacional, sustituir la identidad simulada por autenticación de servidor y definir permisos verificables. Incorporar respaldo central, trazabilidad de operaciones, registro profesional de mediciones, notificaciones y, si se autoriza, pasarela de pagos real.

Antes de declarar aceptación completa de la propuesta inicial deben resolverse los requisitos parciales descritos en la sección 3. La reprogramación, la alerta de cupos y la desactivación reversible no se declaran implementadas por aparecer como objetivos futuros.

# 3.	Requisitos Específicos

## 3.1	Requisitos comunes de las interfaces

### 3.1.1	Interfaces de usuario

Las páginas públicas utilizan navegación superior adaptable y footer compartido. Los formularios tienen etiquetas, mensajes contextuales y botones de acción. Admin utiliza menú lateral, tablas responsivas y confirmaciones para acciones sensibles. El saludo abre el perfil; el menú refleja el rol de la sesión.

Entradas: credenciales, datos de registro y perfil, búsqueda, categoría, servicio, fecha, hora, motivo, cantidades y datos del checkout. Salidas: tarjetas, listados, agenda, plan, progreso, alertas y comprobantes. Cuando no existen resultados se informa un estado vacío y se conserva la navegación.

### 3.1.2	Interfaces de hardware

La aplicación debe poder utilizarse con teclado, ratón y pantalla táctil en móvil, tableta y escritorio. No requiere periféricos clínicos ni conexión con equipos de medición. Las resoluciones de aceptación son 360, 768 y 1280 píxeles, sujetas a revisión visual pendiente.

### 3.1.3	Interfaces de software

React renderiza componentes; React Router resuelve navegación; Bootstrap y React Bootstrap aportan grillas, formularios, tablas y navegación. Web Storage guarda JSON. OpenStreetMap proporciona el mapa embebido. Vitest y Testing Library complementan la ejecución obligatoria de Jasmine y Karma.

### 3.1.4	Interfaces de comunicación

El servidor de desarrollo y el build sirven archivos mediante HTTP o HTTPS. Esta versión no intercambia operaciones de negocio con una API de servidor: los módulos JavaScript actualizan datos locales y notifican a React mediante eventos. La futura API REST intercambiará JSON y deberá definir autenticación y contratos de errores.

## 3.2	Requisitos funcionales

Los textos de alcance de R.1 a R.29 proceden de la planilla inicial. Cada requisito incorpora aceptación, estado observado y ubicación de implementación. Los criterios pendientes permanecen como exigencias de la propuesta, sin asumir que estén aprobados o cancelados.

R.1 Vista de catálogo de servicios

Actor: Paciente. Mostrar el catálogo completo de servicios (consultas, planes especializados, evaluaciones y talleres) en formato de tarjetas responsivas, indicando nombre, precio, duración, modalidad y una breve descripción.

Aceptación: Cada tarjeta debe mostrar nombre, precio, duración, modalidad y descripción, con enlace al detalle.

Estado: Parcial. Las tarjetas muestran nombre, precio y descripción; faltan duración y modalidad visibles. Evidencia: TarjetaServicio.jsx.

R.2 Filtro de catálogo por categoría

Actor: Paciente. Permitir filtrar el catálogo por tipo de servicio (Consulta, Plan especializado, Evaluación, Taller grupal) y por modalidad (Presencial/Online).

Aceptación: La categoría y la modalidad deben poder combinarse con la búsqueda, incluyendo un estado sin resultados.

Estado: Parcial. Existen filtros por categoría y texto; falta el selector Presencial/Online. Evidencia: Catalogo.jsx.

R.3 Buscador de catálogo

Actor: Paciente. Incluir un campo de búsqueda por texto que filtre en tiempo real los servicios del catálogo por nombre o palabra clave.

Aceptación: Al escribir un nombre o palabra de la descripción se actualizan las tarjetas sin recargar la página.

Estado: Implementado. Búsqueda mediante estado React y filtrado del catálogo. Evidencia: Catalogo.jsx; Shop.test.jsx.

R.4 Selección de servicio hacia agendamiento

Actor: Paciente. Al presionar 'Agendar' sobre un servicio del catálogo, precargar automáticamente su nombre, precio y duración en el formulario de solicitud de cita.

Aceptación: Agendar desde el detalle debe conservar el servicio y mostrar su nombre, precio y duración antes de confirmar.

Estado: Parcial. El servicio y profesional se precargan; el resumen previo no muestra precio ni duración. Evidencia: DetalleServicio.jsx; AgendarCita.jsx.

R.5 Formulario de solicitud de cita

Actor: Paciente. Formulario de solicitud de cita con nutricionista preferido, motivo de consulta, fecha/hora y servicio seleccionado, con validación de campos obligatorios antes del envío.

Aceptación: Validar servicio, profesional, motivo según obligatoriedad acordada, día hábil y horario disponible antes de guardar.

Estado: Parcial. El profesional depende del servicio y el motivo es opcional; falta un selector independiente de profesional si se exige como preferencia. Evidencia: AgendarCita.jsx; booking.js.

R.6 Vista 'Mis citas'

Actor: Paciente. Listado de las citas del paciente con su estado (pendiente, confirmada, cancelada) y acciones para cancelar o solicitar reprogramación.

Aceptación: Mostrar solo citas propias, permitir cancelar con confirmación y solicitar cambio de fecha u hora.

Estado: Parcial. Consulta, filtro y cancelación implementados; la reprogramación directa no está implementada. Evidencia: MisCitas.jsx; account.js.

R.7 Formulario de inicio de sesión y registro

Actor: Paciente. Vistas de login y registro con validaciones en tiempo real (formato de correo, largo mínimo de contraseña) y mensajes de error contextuales.

Aceptación: Validar correo, contraseña y campos del registro, informar errores contextuales y evitar cuentas duplicadas.

Estado: Parcial. Login y registro funcionan; las validaciones se ejecutan al enviar, no todas en tiempo real como indica la propuesta inicial. Evidencia: Login.jsx; Registro.jsx; registration.js.

R.8 Vista de historial de progreso

Actor: Paciente. Panel con un gráfico simple de peso/medidas en el tiempo para que el paciente visualice su evolución entre sesiones.

Aceptación: Guardar fecha y peso, mostrar evolución cronológica y permitir eliminar registros propios; rechazar datos inválidos.

Estado: Implementado. Gráfico de barras y tabla de peso; no se han incorporado otras mediciones clínicas. Evidencia: Progress.jsx; clinical.js.

R.9 Vista de plan alimenticio vigente

Actor: Paciente. Sección de solo lectura donde el paciente consulta el plan alimenticio activo asignado por su nutricionista.

Aceptación: El paciente autenticado debe consultar únicamente el plan vigente asociado a su correo.

Estado: Implementado. Consulta personal de solo lectura; el profesional asigna el plan desde su agenda. Evidencia: Plan.jsx; Doctor.jsx; clinical.js.

R.10 Menú de navegación responsivo

Actor: Paciente, Administrador. Barra de navegación que se colapsa en un menú tipo 'hamburguesa' en móvil (≥360px) y se expande en tablet/escritorio.

Aceptación: Comprobar menú y navegación a 360, 768 y 1280 píxeles, incluyendo apertura y cierre del menú móvil.

Estado: Pendiente de validación visual. Navbar de React Bootstrap implementada; falta registrar una revisión visual en los tres tamaños. Evidencia: Navbar.jsx; index.css.

R.11 Vista de ubicación con mapa

Actor: Paciente. Sección con un mapa interactivo embebido (Leaflet) que muestra la ubicación de la clínica.

Aceptación: Mostrar la ubicación de la clínica en un mapa navegable y verificar su carga con conexión a internet.

Estado: Parcial. Se utiliza un iframe interactivo de OpenStreetMap; no se integra Leaflet como pedía el requisito original. Evidencia: Contacto.jsx.

R.12 Panel de administración de usuarios

Actor: Administrador. Vista tipo CRUD (crear, editar, desactivar, asignar rol) visible únicamente para el rol Administrador, con confirmación antes de desactivar un usuario.

Aceptación: El administrador debe crear, editar, desactivar y gestionar roles con confirmación y protección de cuentas principales.

Estado: Parcial. Creación, edición, eliminación y roles implementados; falta desactivación reversible sin eliminar la cuenta. Evidencia: Users.jsx; admin.js.

R.16 Vista "Nosotros"

Actor: Paciente. Página institucional que presenta la historia de la clínica, su misión y al equipo de nutricionistas.

Aceptación: Presentar información institucional, misión y equipo profesional con fotografías y navegación accesible.

Estado: Implementado. Vista institucional y carrusel implementados. Evidencia: Nosotros.jsx.

R.17 Vista de blogs / noticias

Actor: Paciente. Listado de noticias o datos curiosos de la clínica, mostrados en tarjetas con imagen, título y descripción corta.

Aceptación: Listar al menos dos artículos con imagen, título, resumen y enlace al contenido completo.

Estado: Implementado. Dos artículos educativos con navegación desde el listado. Evidencia: Blog.jsx; Shop.test.jsx.

R.18 Detalle de blog

Actor: Paciente. Vista de detalle para cada noticia del blog (mínimo 2), con imagen, título y descripción larga.

Aceptación: Abrir cada artículo mediante su ruta y mostrar título, imagen y texto ampliado; gestionar rutas no existentes.

Estado: Implementado. Detalle de los dos artículos implementado en React. Evidencia: Blog.jsx; App.jsx.

R.19 Formulario de contacto

Actor: Paciente. Formulario para que el paciente envíe un mensaje interno (nombre, correo, comentario), con validación de campos obligatorios antes de enviar.

Aceptación: Validar nombre, correo y comentario, guardar el mensaje y mostrar confirmación solo después del guardado.

Estado: Implementado. Persistencia local del mensaje y retroalimentación; no hay envío de correo real. Evidencia: Contacto.jsx; Contacto.test.jsx.

R.20 Selector dependiente de Región y Comuna

Actor: Paciente. Al cambiar la región seleccionada en el formulario de registro, actualizar dinámicamente el listado de comunas disponibles usando un arreglo de datos en JavaScript.

Aceptación: Al cambiar región se actualizan comunas y se descarta cualquier comuna incompatible.

Estado: Implementado. Datos de cuatro regiones de ejemplo en JavaScript; no representa el catálogo completo de Chile. Evidencia: registration.js; Registro.jsx; Perfil.jsx.

R.21 Vista de detalle de servicio

Actor: Paciente. Página individual de cada servicio del catálogo con descripción extendida, profesional asignado y servicios relacionados, accesible al hacer clic desde la tarjeta del catálogo.

Aceptación: El detalle debe mostrar descripción ampliada, profesional y servicios relacionados de la misma categoría.

Estado: Parcial. Descripción, profesional, precio y acciones disponibles; falta el bloque de servicios relacionados. Evidencia: DetalleServicio.jsx.

R.22 Vista de agenda del nutricionista

Actor: Nutricionista. Listado de citas asignadas al nutricionista, mostrando paciente, fecha/hora y motivo de consulta.

Aceptación: El nutricionista debe ver solo las citas asignadas a su cuenta, con paciente, fecha, hora y motivo.

Estado: Implementado. Se corrige el actor de la planilla de Paciente a Nutricionista; el administrador tiene vista general. Evidencia: Doctor.jsx; clinical.js.

R.24 Almacenamiento local de citas/servicios

Actor: Paciente. Guardar temporalmente los datos del agendamiento o servicios seleccionados utilizando localStorage en el navegador para no perder el progreso si se recarga la página.

Aceptación: Después de guardar y recargar, el catálogo y las citas deben conservarse en el mismo origen del navegador.

Estado: Implementado. Se leen los almacenes actuales y los formatos heredados sin duplicar citas. Evidencia: storage.js; admin.js; booking.js.

R.25 Validación estricta de RUN

Actor: Paciente, Administrador. Validar mediante JavaScript que el RUN ingresado en los formularios de registro y creación de usuarios no contenga puntos ni guion (ej: 19011022K), validando que su longitud sea entre 7 y 9 caracteres.

Aceptación: Aceptar RUN de 7 a 9 caracteres sin puntos ni guion y rechazar los formatos contrarios, conforme a la planilla original.

Estado: Parcial. El registro actual exige guion y 7 u 8 dígitos más verificador; Admin no aplica la misma validación. Debe corregirse o acordarse el cambio. Evidencia: registration.js; admin.js.

R.26 Alerta de cupos limitados (Simulación de Stock)

Actor: Paciente. Mostrar un mensaje dinámico de alerta en los talleres grupales o consultas muy demandadas cuando la capacidad simulada sea baja, adaptando la lógica de "stock crítico" mediante JavaScript.

Aceptación: Definir capacidad y umbral, y mostrar alerta pública cuando los cupos simulados del taller o consulta sean bajos.

Estado: Pendiente de implementación. La agenda evita solapamientos y Admin detecta servicios incompletos, pero no existe una alerta pública de cupos simulados. Evidencia: TarjetaServicio.jsx; Business.jsx.

R.27 Persistencia de sesión simulada

Actor: Todos. Utilizar variables en localStorage para simular el inicio de sesión y renderizar condicionalmente el menú de navegación (ej. mostrar el panel de Administrador o la vista "Mis citas" del paciente).

Aceptación: Conservar la sesión al recargar, adaptar el menú al rol y eliminarla al cerrar sesión.

Estado: Implementado. Autorización simulada en cliente; no equivale a seguridad de un servidor. Evidencia: storage.js; useSession.js; Navbar.jsx.

R.28 Carrusel interactivo de la clínica

Actor: Paciente. Implementar un carrusel de imágenes estático en la página principal (HOME) o "Nosotros" utilizando únicamente HTML, CSS y eventos de JavaScript para navegar entre fotos de la clínica.

Aceptación: Navegar entre fotografías mediante controles del carrusel y mantener la adaptación a pantalla.

Estado: Implementado con actualización de etapa. El carrusel migra a React Bootstrap en la Evaluación 2; se sustituye la restricción de JavaScript puro de la primera etapa. Evidencia: Nosotros.jsx.

R.29 Retroalimentación dinámica (Toast/Alertas)

Actor: Todos. Desplegar sugerencias y mensajes de éxito o error personalizados mediante JavaScript al enviar formularios (contacto, registro, agendamiento), mejorando la usabilidad sin recargar la página.

Aceptación: Mostrar mensajes contextuales de éxito y error en contacto, registro y reserva sin recargar el sitio.

Estado: Implementado. Alert y validación de formularios; los errores de persistencia probados no anuncian éxito. Evidencia: Contacto.jsx; Registro.jsx; AgendarCita.jsx.

## 3.3	Requisitos no funcionales

R.13 Responsividad

Todas las vistas deben renderizar correctamente en 360px (móvil), 768px (tablet) y 1280px (escritorio), sin scroll horizontal ni elementos cortados.

Aceptación: Revisar todas las vistas a 360, 768 y 1280 píxeles, sin recortes ni desplazamiento horizontal del documento.

Estado: Pendiente de validación visual. Bootstrap, tablas responsivas y CSS adaptativo implementados; no existe acta de revisión visual completa. Evidencia: index.css; admin.css.

R.14 Consistencia visual

Uso de una paleta de colores y tipografía únicas en toda la app mediante componentes CSS reutilizables, evitando animaciones o transiciones complejas.

Aceptación: Mantener tipografía Poppins, componentes compartidos y la paleta institucional en páginas públicas y administrativas.

Estado: Implementado. Navbar, Footer, tarjetas y estilos compartidos; revisión estética final incluida en la aceptación manual. Evidencia: index.css; admin.css; components/.

R.15 Rendimiento de interfaz

Las vistas principales (catálogo, mis citas, historial) deben cargar en menos de 2 segundos en condiciones normales de red, evitando renders bloqueantes.

Aceptación: Medir catálogo, citas e historial en un entorno definido y comprobar cargas inferiores a 2 segundos.

Estado: Pendiente de medición. No se dispone de medición de carga reproducible; el build correcto no demuestra ese tiempo. Evidencia: Build Vite; medición pendiente.

R.23 Control de versiones y documentación de cambios

Todo el código debe versionarse en un repositorio Git remoto (GitHub) con commits descriptivos, permitiendo trazabilidad de los cambios de cada integrante.

Aceptación: Conservar el código y la documentación en un repositorio GitHub público con commits descriptivos.

Estado: Implementado. Repositorio público actualizado; Git identifica la cuenta configurada para cada commit, sin atribuir trabajo no demostrado. Evidencia: GitHub y registro Git.

### 3.3.1	Requisitos de rendimiento

R.15 conserva el objetivo de carga inferior a 2 segundos. Para verificarlo deben registrarse dispositivo, navegador, conexión, build y condiciones de caché en catálogo, citas e historial. Se propone realizar cinco cargas por vista y conservar tiempos y capturas; la medición todavía no se ha ejecutado. No se establece una capacidad multiusuario de servidor porque no hay backend compartido.

### 3.3.2	Seguridad

La aplicación debe impedir desde sus flujos habituales que un paciente abra Admin, consulte órdenes ajenas o asigne planes. Las cuentas principales se protegen frente a borrado y cambios de rol desde la interfaz. Deben confirmarse las eliminaciones y cambios sensibles. Las pruebas comprueban estos límites del prototipo.

localStorage puede ser modificado por quien controla el navegador y las contraseñas se conservan sin protección de servidor. No se declara cifrado, autenticación robusta ni autorización de producción. Para una versión real se requiere proteger credenciales y datos en backend y revisar el tratamiento de información clínica.

### 3.3.3	Fiabilidad

Una operación fallida no debe presentarse como exitosa. Las pruebas simulan errores de almacenamiento en reserva y progreso; comprueban que no se anuncie un guardado correcto. Las órdenes conservan precios históricos y usan un identificador para impedir duplicación de una misma solicitud. La actualización de almacenamiento no es una transacción de base de datos ni ofrece garantías entre dispositivos.

### 3.3.4	Disponibilidad

El prototipo debe poder abrirse mientras el servidor local o el alojamiento de archivos esté activo. No se fija un porcentaje de disponibilidad sin infraestructura ni monitorización. El mapa puede no cargar si OpenStreetMap o la conexión fallan; los demás flujos locales deben conservar su navegación. El equipo debe iniciar el servidor y comprobar acceso antes de la demostración.

### 3.3.5	Mantenibilidad

Los componentes de presentación, páginas, hooks y reglas del dominio deben mantenerse separados, con nombres comprensibles y formato uniforme. Cada modificación relevante debe pasar pruebas, ESLint y build. El equipo mantiene código y documentos; el administrador cambia servicios y categorías desde el panel. La documentación se actualiza cuando cambia el alcance o los criterios de aceptación.

### 3.3.6	Portabilidad

El código frontend se instala desde el repositorio y archivo de bloqueo con Node.js 24 y se compila a archivos estáticos. Debe verificarse en navegadores modernos de escritorio y móvil; Safari y Firefox no se declaran probados. Las rutas SPA requieren fallback hacia index.html al desplegar. La información local no se migra automáticamente entre navegadores, puertos o equipos.

## 3.4	Otros Requisitos

La entrega debe incluir el enlace público de GitHub, el proyecto React comprimido, el ERS V2 actualizado y el informe de testing y cobertura. El README explica instalación, ejecución y verificación. El código HTML de la primera etapa se conserva como referencia.

El proceso de pruebas utiliza Jasmine y Karma para componentes React y conserva Vitest como complemento. La ejecución documentada del 18/10/2026 registra 74 pruebas aprobadas en Vitest y 94 ejecuciones en Jasmine/Karma, con 74 casos compartidos y 20 adicionales. El informe de testing detalla cobertura, datos aislados, mocks, resultados y límites; estas cifras no significan que todos los requisitos originales estén satisfechos.

El proyecto utiliza persistencia local y pagos simulados. La compra de un servicio y la reserva de una hora son operaciones separadas. El backend, la base central y los cobros reales no están implementados. Debe confirmarse con el docente el alcance de la integración backend mencionada en el anexo.

Quedan diferencias con la planilla inicial: mostrar duración y modalidad en tarjetas y el resumen previo de reserva; filtro por modalidad; selección de profesional y validación en tiempo real; reprogramación; desactivación reversible; Leaflet frente al mapa embebido actual; servicios relacionados; formato del RUN y alerta de cupos. Los estados y observaciones de cada requisito se conservan en 3.2 y 3.3.

Antes de declarar aceptación completa deben cerrarse o aprobarse esas diferencias y registrarse la revisión visual a 360, 768 y 1280 píxeles y la medición del objetivo de carga de R.15. La defensa individual debe explicar React, props, estado, Bootstrap y el proceso de pruebas, conforme a la pauta de la segunda evaluación.
