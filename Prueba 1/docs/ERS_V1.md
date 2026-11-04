# Especificación de requisitos NutriVida V1

Proyecto de Antonia Muñoz y Felipe Araya
DSY1104 Desarrollo Fullstack II
Revisión técnica del 4 de noviembre de 2026

## 1 Introducción y alcance

Este documento consolida los requisitos de la primera versión HTML, CSS y JavaScript del proyecto Clínica Nutricional NutriVida. Describe la versión organizada en Prueba 1 después de la revisión de las pautas. No se presenta como el documento originalmente entregado en septiembre.

La propuesta adapta una tienda online al catálogo de servicios de una clínica ficticia. Permite consultar información, servicios, precios y especialistas, crear una cuenta, iniciar sesión, agregar servicios al carrito y solicitar una cita. Los datos se guardan en localStorage del navegador.

## 2 Usuarios y permisos

Visitante: consulta Inicio, Nosotros, Blog, Contacto, Catálogo y detalle, y utiliza el carrito por invitado.

Cliente o paciente: dispone de cuenta y de los flujos personales de la clínica. El registro público asigna este rol y no permite seleccionar privilegios.

Vendedor: consulta productos, detalles y órdenes desde vendedor.html. No dispone de acciones para mantener usuarios o servicios.

Administrador: mantiene usuarios y servicios y consulta citas y reportes. Las cuentas principales ya existentes se conservan. El rol médico es una extensión del caso clínico y se asigna desde administración.

## 3 Requisitos funcionales

ID | Requisito y criterio verificable
V1-01 | Las páginas utilizan HTML con encabezados, navegación, contenido principal, formularios y pie de página; el diseño usa hojas CSS externas.
V1-02 | Inicio muestra servicios con imagen, nombre y precio y enlaza al catálogo y al detalle. Nosotros incluye un video local de presentación con controles.
V1-03 | El catálogo se obtiene de un arreglo JavaScript, permite búsqueda y filtros y ofrece acceso al detalle y al carrito.
V1-04 | El carrito permite agregar, cambiar cantidades, quitar y calcular el total. Persiste por cuenta o invitado y limita cada servicio a 10 unidades y al stock disponible.
V1-05 | El registro solicita RUN, nombre, apellidos, correo, dirección, región y comuna. Teléfono y fecha de nacimiento son opcionales. La comuna depende de la región elegida.
V1-06 | El inicio de sesión valida correo y contraseña, muestra errores y adapta la navegación al rol. Cerrar sesión elimina la identidad activa.
V1-07 | Contacto exige nombre y comentario, acepta correo opcional validado y guarda el mensaje con confirmación local.
V1-08 | El administrador crea, edita y elimina usuarios y servicios. Las operaciones de eliminación requieren confirmación y las cuentas principales están protegidas.
V1-09 | Los servicios contienen código, nombre, categoría, precio y stock; descripción, imagen y umbral crítico son opcionales. El catálogo presenta alertas cuando quedan pocos cupos.
V1-10 | Se conserva la separación entre carrito comercial y solicitudes de cita; agregar una atención al carrito no reserva una hora.

## 4 Reglas de validación

RUN: de 7 a 9 caracteres, sin puntos ni guion, con dígito verificador válido mediante módulo 11. Ejemplo ficticio de formato válido: 123456785. Se comprueban duplicados normalizando los registros antiguos.

Nombre: obligatorio y máximo 50 caracteres. Apellidos: obligatorios y máximo 100. Correo de cuenta: obligatorio, máximo 100 caracteres y dominio duoc.cl, profesor.duoc.cl o gmail.com. Contraseña: entre 4 y 10 caracteres. Dirección: obligatoria y máximo 300. La fecha de nacimiento, si se informa, debe ser válida y no futura.

Las dos cuentas administrativas históricas con dominio duocuc.cl se conservan como excepción de acceso para no perder la administración existente. Ese dominio no se habilita para nuevas cuentas públicas.

Contacto: nombre obligatorio de hasta 100 caracteres y comentario obligatorio de hasta 500. Si se indica correo, debe pertenecer a un dominio permitido y tener máximo 100 caracteres.

Servicio: código de texto único de al menos 3 caracteres y sin máximo impuesto; nombre obligatorio de hasta 100; descripción opcional de hasta 500; precio numérico mayor o igual a cero, con decimales; stock obligatorio entero mayor o igual a cero; stock crítico opcional entero mayor o igual a cero; categoría obligatoria e imagen opcional.

## 5 Implementación y restricciones

reglas.js concentra validaciones; datos.js inicia el catálogo y ofrece acceso a datos; carrito.js gestiona la compra; los demás scripts implementan páginas específicas. La información permanece en el mismo navegador y origen. El archivo de ubicaciones incluye las 16 regiones con comunas de ejemplo; no representa el registro completo de comunas del país.

La autenticación y los permisos son una simulación de frontend. No hay servidor de identidad, base de datos remota, pagos bancarios ni correo saliente. Las cuentas y precios se utilizan para una demostración académica.

## 6 Comprobación y referencias

Se revisaron 25 archivos HTML y las referencias locales a páginas, imágenes, estilos, scripts y video. No se encontraron referencias locales inexistentes ni errores de sintaxis en los scripts. Las comprobaciones de integración del catálogo, carrito y registro HTML se ejecutaron durante la revisión y quedaron respaldadas fuera de la suite de entrega de 10 casos.

Referencias: Evaluación Parcial 1 EE EP Estudiante, páginas 2 a 6; Anexo 1 Instrucciones de Evaluación Parcial 1, páginas 1 a 17. El historial Git anterior contiene contribuciones de ambos integrantes; la organización local de esta revisión todavía debe publicarse por el equipo.
