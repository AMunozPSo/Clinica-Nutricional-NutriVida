# Especificación de requisitos NutriVida V2

Antonia Muñoz y Felipe Araya. DSY1104. 18 de octubre de 2026.

Prototipo frontend React con persistencia simulada. Pago y comprobantes académicos, sin backend ni transacciones reales.

## RF01 Contenido público

Inicio, Nosotros, Contacto, Blog y dos artículos tienen rutas React y navegación.

## RF02 Registro de cuentas

Valida datos obligatorios, RUN, teléfono, correo, región, comuna y confirmación de contraseña; rechaza duplicados.

## RF03 Inicio y cierre de sesión

Valida credenciales y distingue paciente, médico y administrador; cerrar elimina la sesión.

## RF04 Perfil personal

El saludo abre el perfil; permite editar nombre, teléfono, dirección y ubicación sin alterar credenciales ni rol.

## RF05 Catálogo y búsqueda

Lista servicios por props y permite buscar por nombre o descripción y filtrar por categoría.

## RF06 Categorías públicas

Muestra categorías administrables con acceso al catálogo filtrado.

## RF07 Ofertas

Publica servicios con descuento mayor que cero y calcula el precio reducido.

## RF08 Carrito de servicios

Permite añadir, cambiar cantidades entre 1 y 10 y quitar servicios; separa invitado y cuentas.

## RF09 Checkout

Solicita datos de contacto y modalidad; autocompleta desde el perfil cuando existe sesión.

## RF10 Pago simulado

Permite resultados aprobado y rechazado; no solicita tarjetas ni realiza cobros reales.

## RF11 Órdenes y comprobantes

Guarda precios y cantidades; presenta éxito o fallo, resumen y folio; rechazar conserva el carrito.

## RF12 Reserva de citas

Elige servicio, profesional, día hábil y hora disponible; guarda la identidad de la sesión y el precio.

## RF13 Mis citas

Muestra solo las citas propias, permite filtrar por estado y cancelar con confirmación.

## RF14 Agenda médica

El médico ve las citas asignadas a su correo o a su nombre profesional normalizado.

## RF15 Planes alimenticios

El médico asigna un plan a pacientes de su agenda; el administrador puede asignar a pacientes registrados.

## RF16 Progreso personal

Guarda fecha y peso, rechaza fechas futuras y pesos fuera de 20 a 300 kg y permite eliminar registros propios.

## RF17 Resumen administrativo

Presenta citas del día, pacientes, planes activos, próximas citas y mensajes recibidos en Contacto.

## RF18 CRUD de servicios

Crea, lee, edita y elimina servicios con categoría, profesional, precio, descuento, modalidad, duración e imagen.

## RF19 CRUD de categorías

Crea, edita y elimina categorías; impide eliminar una que tenga servicios asociados.

## RF20 Gestión de usuarios

Registra pacientes y médicos, edita datos, elimina con confirmación y protege cuentas principales.

## RF21 Roles e historial

Solo las cuentas principales conceden o revocan administrador; se consulta el historial de citas y compras.

## RF22 Gestor de citas

Busca por nombre o correo y filtra por estado; confirma los cambios de estado y los persiste.

## RF23 Órdenes administrativas

Lista compras simuladas de todos los clientes y abre sus comprobantes.

## RF24 Reportes y servicios críticos

Separa ingresos de citas completadas y compras simuladas; identifica servicios incompletos que requieren revisión.

## RF25 Persistencia y compatibilidad

Conserva datos en el mismo origen y lee formatos originales; sincroniza estados de copias de citas sin contarlas dos veces.

## RF26 Navegación compatible

Redirige los enlaces HTML migrados, protege rutas privadas y presenta una página para rutas inexistentes.

## Requisitos no funcionales

### RNF01 Diseño adaptable

Bootstrap, React Bootstrap, columnas por tamaño, tablas con desplazamiento y menú colapsable.

### RNF02 Mantenibilidad

Páginas, componentes, hooks y módulos de datos separados. Formato uniforme con Prettier.

### RNF03 Pruebas reproducibles

Jasmine y Karma en navegador dedicado, más Vitest y Testing Library; datos de prueba aislados por caso.

### RNF04 Calidad verificable

La verificación ejecuta pruebas, cobertura, ESLint y build y conserva evidencias de cada paso.

### RNF05 Identidad y acceso

Las operaciones consultan la sesión y los permisos antes de modificar información de otra cuenta.

### RNF06 Accesibilidad básica

Etiquetas de formularios, texto alternativo, roles, foco visible y mensajes de validación comprensibles.

### RNF07 Ejecución local

Node.js 24, dependencias instaladas y Chrome o Edge para Karma. Internet para mapas y fuentes externas.

### RNF08 Límites del prototipo

No usar datos clínicos reales ni credenciales sensibles: la autenticación y la persistencia son simuladas en cliente.

La especificación completa, actores, reglas y límites se encuentran en NutriVida_ERS_V2.pdf.
