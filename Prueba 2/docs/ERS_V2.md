# Especificación de requisitos NutriVida V2

Proyecto de Antonia Muñoz y Felipe Araya
DSY1104 Desarrollo Fullstack II
Actualización técnica del 4 de noviembre de 2026

## 1 Propósito y alcance

Esta especificación describe la versión React organizada en Prueba 2 y su correspondencia con los requisitos de la segunda evaluación. Actualiza el comportamiento observado durante la revisión. La evaluación de la adaptación del caso comercial a la clínica corresponde al docente.

Se conserva Prueba 1 como versión HTML, CSS y JavaScript. Prueba 2 contiene una aplicación de una sola página con React, React Router, Bootstrap y componentes React Bootstrap. Las reglas del negocio y la persistencia se implementan en módulos JavaScript.

La aplicación presenta información institucional, catálogo de servicios, categorías, ofertas, detalle, registro, login, perfil, carrito, checkout, resultados de compra y órdenes. El caso clínico añade agenda de citas, planes de alimentación y progreso personal.

## 2 Arquitectura e interfaces

Capa | Responsabilidad
Páginas y componentes | Presentación, formularios controlados, eventos de usuario y navegación. Navbar, Footer, TarjetaServicio y UserFields se reutilizan.
Estado y hooks | useState administra valores y mensajes; los hooks de sesión y datos actualizan la interfaz al cambiar el almacenamiento.
Módulos lib | rules valida datos; storage, registration, admin, commerce, booking, account y clinical encapsulan reglas y persistencia.
Persistencia | localStorage por navegador y origen. Se mantienen lecturas compatibles con datos de la versión HTML.
Pruebas | Vitest, Testing Library, jsdom y cobertura V8. La suite de entrega contiene exactamente 10 casos.

Las rutas de la SPA se gestionan con React Router. En un alojamiento de archivos estáticos, las rutas internas requieren redirección hacia index.html. Las imágenes y el video de presentación son recursos locales; el mapa y las tipografías externas requieren conexión.

## 3 Usuarios y autorización

El visitante consulta información y compra de forma simulada. El cliente o paciente administra su cuenta y sus propias citas, compras y datos personales. El registro público siempre asigna paciente.

El vendedor consulta el catálogo, el detalle de servicios y las órdenes mediante un panel de solo lectura. Su menú presenta productos, órdenes y cierre de sesión. Las rutas clínicas restantes y el panel administrativo no forman parte de sus accesos.

El administrador mantiene cuentas, servicios y categorías y consulta citas, mensajes, órdenes y reportes. Las cuentas principales se conservan protegidas. La creación de administradores se restringe a las cuentas principales. El médico es una extensión del caso y dispone de su agenda y asignación de planes.

## 4 Requisitos funcionales y aceptación

ID | Requisito y criterio de aceptación
V2-01 | Migrar las vistas a componentes React con props y estado; las rutas permiten navegar sin duplicar estructuras completas de HTML.
V2-02 | Presentar catálogo, búsqueda, categoría y ofertas; el detalle muestra información del servicio y permite agregarlo al carrito.
V2-03 | Registrar usuarios con nombre, apellidos, RUN, correo, contraseña, dirección y ubicación; validar y mostrar errores contextuales; impedir duplicados.
V2-04 | Permitir inicio y cierre de sesión y adaptar los accesos al rol; conservar las cuentas administrativas históricas.
V2-05 | Mantener un carrito por cuenta o invitado; modificar cantidades, quitar servicios, calcular importes y respetar stock.
V2-06 | Autocompletar checkout con el perfil; validar contacto y modalidad; simular pago aprobado o rechazado y generar el resumen correspondiente.
V2-07 | Un pago rechazado conserva carrito y stock. Un pago aprobado vacía el carrito y descuenta stock; el identificador de solicitud evita registrar dos veces la misma compra.
V2-08 | El administrador puede crear, consultar, editar y eliminar usuarios, servicios y categorías con controles de permisos y confirmaciones.
V2-09 | Los servicios incluyen código único, precio decimal, stock y umbral crítico opcional; se informa falta de disponibilidad o stock crítico.
V2-10 | La vista de contacto guarda mensajes validados y muestra fallo si el almacenamiento no permite guardar.
V2-11 | La reserva clínica valida fecha hábil futura y disponibilidad; Mis citas muestra las propias y permite cancelarlas con confirmación.
V2-12 | El diseño utiliza Bootstrap y reglas CSS adaptables. Se revisaron visualmente formularios y catálogos de ambas versiones en tamaños de móvil, tableta y escritorio.
V2-13 | Configurar y demostrar 10 pruebas que incluyan renderizado, props, estado, eventos, validaciones, permisos y mocks; conservar reportes de cobertura.

## 5 Reglas de datos

Se mantienen las reglas de usuarios y servicios de V1: RUN sin puntos ni guion y con dígito verificador; nombre de hasta 50 caracteres, apellidos hasta 100, correo hasta 100 y dominios permitidos, contraseña de 4 a 10, dirección hasta 300 y comuna perteneciente a la región elegida.

Código de servicio: texto único de al menos 3 caracteres. Nombre: obligatorio de hasta 100. Descripción: opcional de hasta 500. Precio: mayor o igual a cero y admite decimales. Stock: entero obligatorio no negativo. Umbral crítico: entero opcional no negativo. Categoría obligatoria e imagen opcional.

Los servicios heredados que no incluyen inventario reciben 20 unidades de demostración y un código NV seguido de su identificador. El administrador puede ajustar esos valores. El stock comercial representa cupos simulados y se descuenta al aprobar una compra; no sustituye la disponibilidad de agenda.

El registro dispone de las 16 regiones con comunas de ejemplo. Los médicos nuevos se asignan desde administración y no obtienen ese rol por registrarse con un dominio especial.

## 6 Proceso de pruebas

La rúbrica de la segunda evaluación usa 10 de 10 pruebas como referencia de mayor desempeño en la página 7 y pide demostrar 10 pruebas en la página 9. No se interpreta como una exigencia de decenas de pruebas. La suite entregable se concentra en 10 casos representativos.

Jasmine y Karma se retiraron por la indicación del profesor comunicada por el estudiante durante esta revisión. El ejecutor vigente es Vitest. El informe de testing registra alcance, resultados, métricas, mocks y límites de cobertura.

## 7 Restricciones y preparación de la tercera etapa

La persistencia y autorización son locales. No existe backend, base de datos central, envío de correo ni cobro bancario. Las pruebas no acreditan seguridad de producción. El anexo de la evaluación 2 menciona una demostración integrada con backend, mientras sus requisitos técnicos describen persistencia JavaScript simulada; ese alcance debe aclararse con el profesor antes de dar la integración por satisfecha.

Esta revisión no certifica la tercera entrega, ya que su pauta no fue proporcionada. Como evolución se debe definir la API, la persistencia central y la autenticación de servidor de acuerdo con las instrucciones que entregue el docente.

El README se conserva sin modificaciones por instrucción del equipo, incluso donde mantiene rutas o herramientas anteriores. Los comandos y rutas vigentes están en Guia_presentacion.md. Los cambios de esta revisión son locales; su publicación en GitHub corresponde al siguiente paso del equipo.

## 8 Referencias

Evaluación Parcial 2 EE EP Estudiante, páginas 3, 4, 6, 7 y 9. Anexo 1 Instrucciones de Evaluación Parcial 2, páginas 1, 2, 4 a 12. Reglas de formularios del Anexo 1 de Evaluación Parcial 1, páginas 13 a 16. Estado del código, scripts y evidencias conservados en este repositorio.
