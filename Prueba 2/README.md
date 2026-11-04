# Clínica NutriVida V2

Proyecto académico de Antonia Muñoz y Felipe Araya para DSY1104 Desarrollo Fullstack II. La aplicación de la evaluación 2 está en esta carpeta. Los HTML de la raíz del repositorio se conservan como referencia de la entrega anterior.

## Ejecutar y verificar

Se recomienda Node.js 24 con npm. Para Jasmine/Karma se requiere Chrome o Edge instalado; `CHROME_BIN` permite indicar otra ubicación del navegador.

```sh
npm ci
npm run dev
npm run test:coverage
npm run test:jasmine
npm run lint
npm run build
npm run verify
```

Si usas pnpm: `pnpm install --frozen-lockfile`, `pnpm dev` y `pnpm verify`. No mezcles cambios de dependencias de los dos gestores sin regenerar sus lockfiles.

`npm run verify` ejecuta ambos motores, cobertura, ESLint y build y actualiza `docs/evidencias`. El resultado se conserva en `dist`. El alojamiento de la SPA debe redirigir sus rutas a `index.html`.

## Funcionalidades

- Inicio, Nosotros, clínica, profesionales, carrusel, Contacto, Blog y artículos.
- Catálogo con búsqueda y categorías, ofertas y detalle de servicios.
- Registro, login, perfil editable y navegación según sesión.
- Reservas con validación de horarios; Mis citas y cancelación propia.
- Carrito por cuenta/invitado, checkout con autocompletado, pago simulado, éxito/rechazo, comprobantes y Mis compras.
- Agenda médica de citas asignadas, planes alimenticios publicados por el profesional y progreso personal.
- Admin con resumen y mensajes, CRUD de servicios y categorías, usuarios y roles, historial por cliente, gestor de citas, órdenes, reportes y servicios por revisar.

Comprar un servicio no reserva una hora. La fecha y hora se eligen en **Agendar cita**. No se realizan cobros reales ni se piden datos bancarios. Los comprobantes no son boletas tributarias.

## Acceso y demostración

Administradores principales: `feli.arayah@duocuc.cl` y `anto.munozp@duocuc.cl`, clave `admin123`. Las cuentas de la clínica reciben rol médico. Las cuentas comunes son pacientes; solo las principales pueden conceder y revocar administrador.

Las nuevas cuentas se registran desde el login. Los perfiles no pueden modificar sus roles ni credenciales a través de la edición de datos personales. La guía de presentación explica cómo preparar pacientes y médicos ficticios para demostrar la agenda.

## Persistencia simulada

`src/lib` contiene las funciones de datos y validaciones. Se usa localStorage por navegador y origen: cambiar de puerto, perfil o dispositivo no transfiere los datos automáticamente. No hay backend ni base de datos remota en esta entrega.

Los servicios se guardan en `serviciosNutriVida` y se sincronizan con el formato antiguo `nutrivida_servicios`. Las citas se leen desde `nutrivida_citas` y `nutrivida_carrito`, sin duplicar sus copias. El carrito comercial usa claves `nutrivida_compra` por cuenta y las órdenes `nutrivida_ordenes`. Usuarios, categorías, mensajes, planes y progreso tienen almacenes propios. No cargar datos clínicos reales ni usarlo como sistema de producción.

## Testing y cobertura

Se mantienen los casos Vitest/Testing Library. Jasmine/Karma ejecutan esos escenarios compartidos mediante una pequeña adaptación de aserciones DOM, más veinte casos nativos J01 a J20. El script agrupa cada archivo en su propia suite y preserva el aislamiento de hooks. El ejecutor de `test:jasmine` es Jasmine en Chrome Headless.

- Vitest: 74 casos aprobados. Cobertura V8: 90.75 por ciento de líneas y 80.58 de ramas.
- Jasmine/Karma: 94 ejecuciones aprobadas. Cobertura Istanbul: 90.87 por ciento de líneas y 80.69 de ramas.
- ESLint y build: correctos.

No sumar las ejecuciones compartidas como casos diferentes. Estos valores corresponden a la evidencia del 18 de octubre de 2026; al modificar el código se deben regenerar.

Los reportes HTML se generan en `coverage/vitest` y `coverage/jasmine`. El ZIP incluye los reportes de la ejecución documentada. Los JSON y logs están en `docs/evidencias`; el informe explica mocks, análisis y brechas de cobertura.

## Documentos de entrega

- `docs/NutriVida_ERS_V2.docx` editable, `NutriVida_ERS_V2.pdf` y fuente `ERS_V2.md`.
- `docs/NutriVida_Informe_Testing.pdf` y fuente `Informe_Testing.md`.
- `docs/Guia_presentacion.md`.
- `docs/evidencias` y reportes de cobertura regenerables.

El docente determina la aceptación de la adaptación clínica y la evaluación individual. El ERS explicita la persistencia y los pagos simulados; no presume backend real ni aprobación de esas adaptaciones.

## Avisos del entorno de desarrollo

Karma y su cadena de instrumentación incluyen dependencias legadas con avisos de auditoría. Se conserva el runner requerido por la pauta y se limita a pruebas locales. La auditoría sin dependencias de desarrollo no reportó vulnerabilidades en esta instalación; esto no sustituye una auditoría de producción.

La revisión 2.2 del ERS mantiene la estructura y el índice completos del original, con R.1 a R.29 y sin capítulos añadidos. Las diferencias de implementación y validación se describen dentro de 3.2, 3.3 y 3.4. Las fuentes originales aportadas por los integrantes no se modificaron.
