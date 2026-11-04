# Informe de testing NutriVida V2

Revisión del 4 de noviembre de 2026
DSY1104 Desarrollo Fullstack II

## 1 Resultado y alcance

La suite de entrega contiene exactamente 10 pruebas y las 10 aprobaron. ESLint y la compilación de producción también finalizaron con código cero. La medición corresponde a la ejecución registrada en docs/evidencias/resumen.json: miércoles, 4 de noviembre de 2026, 5:56 p. m..

Los 10 casos verifican comportamientos representativos del frontend React. La rúbrica utiliza 10 de 10 como referencia en su página 7 y pide demostrar 10 en la página 9. No se declara un máximo estricto inexistente en el texto. Las pruebas adicionales utilizadas durante la revisión se conservaron como respaldo fuera del proyecto entregable.

Jasmine y Karma fueron retirados según la indicación docente comunicada por el estudiante. Se usa Vitest con Testing Library y jsdom. Las herramientas de pruebas presentes en el README original no se actualizaron porque se solicitó conservarlo intacto.

## 2 Entorno y reproducción

Node.js: v24.22.0. React: 19.3.1. Bootstrap: 5.3.8. Vite: 8.3.4. Vitest: 5.0.5.

Desde la carpeta Prueba 2, ejecutar npm ci y luego npm run verify. El script ejecuta pruebas con cobertura, ESLint y build. También pueden usarse npm run test:unit, npm run test:coverage, npm run lint y npm run build por separado.

El archivo src/Entrega2.test.jsx contiene los 10 casos. Los datos se reinician antes de cada prueba mediante localStorage.clear y sessionStorage.clear. Testing Library desmonta las vistas y se restauran los spies después de cada caso para evitar dependencia entre pruebas.

## 3 Casos y trazabilidad

Caso | Comportamiento verificado
T01 | renderiza una tarjeta usando props y responde al evento de añadir
T02 | muestra el listado de servicios y filtra al cambiar el estado del buscador
T03 | valida el registro y guarda una cuenta cliente con RUN correcto y datos completos
T04 | rechaza credenciales incorrectas y permite entrar y salir del panel administrativo
T05 | valida contacto y usa un mock para mostrar un fallo de persistencia sin anunciar éxito
T06 | crea edita y elimina un servicio con código precio decimal y stock crítico
T07 | crea un vendedor y limita su panel a consultas de productos y órdenes
T08 | actualiza cantidades del carrito conserva los datos al remontar y permite quitar
T09 | conserva carrito y stock tras rechazo y los actualiza al aprobar la compra
T10 | agenda una cita y la cancela con confirmación desde el listado personal

T01 y T02 evidencian renderizado, recepción de props, listado y estado. T03 a T05 verifican formularios, retroalimentación condicional y eventos. T06 y T07 cubren mantenedores y permisos. T08 y T09 verifican carrito, persistencia y resultados de compra. T10 verifica el flujo de reserva y cancelación propio del caso clínico.

## 4 Mocks y análisis de resultados

T05 intercepta Storage.prototype.setItem con vi.spyOn y simula una excepción únicamente al guardar mensajes. La prueba exige que aparezca un mensaje de fallo y que no se registre un mensaje exitoso. Luego restaura la función y comprueba el guardado normal sin correo, ya que ese campo es opcional en el anexo.

Las demás pruebas utilizan los módulos de datos reales del frontend y almacenamiento de jsdom, sin API remota. fireEvent simula escritura, selección, clic y confirmaciones. Las pruebas comprueban tanto el DOM como los datos persistidos; por ejemplo, T09 comprueba que un pago rechazado conserva el carrito y el stock y que el aprobado descuenta una unidad.

El resultado 10 de 10 indica que los escenarios definidos aprobaron. No demuestra por sí solo que todas las entradas, roles, vistas o condiciones de fallo hayan sido probadas.

## 5 Cobertura medida

Métrica | Cubierto y total | Porcentaje
Líneas | 602 de 1082 | 55.63 %
Sentencias | 654 de 1186 | 55.14 %
Funciones | 214 de 404 | 52.97 %
Ramas | 572 de 1143 | 50.04 %

La cobertura incluye src con archivos JS y JSX, excluyendo los archivos de pruebas, main.jsx y setupTests.js. Corresponde al código React, no a la totalidad de los scripts HTML de Prueba 1. No se impuso un umbral artificial ni se excluyeron módulos funcionales para elevar los porcentajes.

Los archivos con menor cobertura de líneas en esta ejecución son:

Archivo | Líneas | Ramas
demoCatalog.js | 0 % | 0 %
DetalleServicio.jsx | 0 % | 0 %
Inicio.jsx | 0 % | 100 %
Nosotros.jsx | 0 % | 0 %
Perfil.jsx | 0 % | 0 %
Appointments.jsx | 0 % | 0 %

Las métricas inferiores al 100 por ciento permiten identificar recorridos pendientes. La suite de 10 casos no ejercita completamente progreso, planes alimenticios, reportes, edición de perfil, todas las rutas de error de almacenamiento ni toda combinación de filtros y roles. Las pruebas de componentes en jsdom tampoco miden diseño visual, tiempos reales de carga o compatibilidad completa entre navegadores.

## 6 Evidencias y comprobaciones complementarias

docs/evidencias contiene vitest.log, lint.log, build.log, resumen.json y cobertura-vitest.json. El informe HTML navegable se genera en coverage/vitest/index.html y se incluye en el comprimido preparado para revisión.

La versión HTML se comprobó durante la revisión con pruebas de integración de registro, catálogo y carrito, revisión de referencias locales y validación de sintaxis. Los formularios y catálogos se inspeccionaron en el navegador en anchos de 360, 768 y 1280 píxeles; esos controles visuales no equivalen a una revisión exhaustiva de todas las vistas.

## 7 Límites y siguientes comprobaciones

No hay backend, pago bancario ni datos clínicos reales. La cobertura actual es parcial y se informa con sus cifras reales. Para la tercera etapa deben definirse sus requisitos y verificar la integración y persistencia que pida el docente. La cantidad o tecnología de pruebas debe ajustarse solo si el profesor comunica una nueva condición.

Referencias: Evaluación Parcial 2 EE EP Estudiante, indicadores IE2.2.1 e IE2.3.1 de página 7 e IE2.2.2 e IE2.3.2 de página 9; Anexo 1 de la misma evaluación, página 11; material 2.3.4 MC Informes de cobertura proporcionado por el equipo.
