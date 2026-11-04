# Guía de ejecución y presentación

La carpeta del proyecto sigue en C:\Users\ASMP\Clinica-Nutricional-NutriVida.

## Abrir las versiones

- Prueba 1: abrir index.html con Live Server desde esa carpeta. La versión HTML no requiere React ni npm.
- Prueba 2: abrir una terminal en esa carpeta, ejecutar npm ci y npm run dev.
- Verificar React: npm run verify. Ejecuta las 10 pruebas con cobertura, ESLint y build.
- Reporte HTML de cobertura: coverage/vitest/index.html después de la verificación.

El README original se conserva por solicitud del equipo. Las rutas antiguas nutrivida-react ahora corresponden a Prueba 2. Jasmine y Karma se retiraron siguiendo la indicación docente transmitida por el estudiante.

## Demostración de 15 minutos

1. Mostrar la separación de las dos versiones y el historial de contribuciones del repositorio.
2. Explicar componentes, props y estado con una tarjeta y el buscador del catálogo.
3. Demostrar registro con apellidos, RUN y comuna dependiente de región, y un error de validación.
4. Mostrar carrito, pago simulado rechazado, reintento y compra exitosa.
5. Demostrar creación de servicio con código, precio decimal, stock y umbral crítico.
6. Mostrar el panel de vendedor de solo lectura y la separación del administrador.
7. Ejecutar las 10 pruebas, explicar el mock de almacenamiento de T05 y leer las cuatro métricas de cobertura.
8. Explicar limitaciones de localStorage y los requisitos que falten definir para la tercera etapa.

Usar únicamente cuentas y datos ficticios de demostración. Las cuentas base existentes son feli.arayah@duocuc.cl y anto.munozp@duocuc.cl, con contraseña académica admin123. Nuevas cuentas públicas admiten duoc.cl, profesor.duoc.cl o gmail.com. Un médico se asigna desde administración.

## Antes de publicar la revisión

El cambio está aplicado localmente. El equipo debe revisar y subir los cambios a GitHub para que allí aparezcan Prueba 1 y Prueba 2, y comprobar el enlace público. No se creó ningún commit ni se hizo push durante esta revisión.

La tercera evaluación aún no está certificada: falta su pauta y definir si el profesor exige backend, API, base de datos u otros entregables. El anexo de evaluación 2 menciona una demostración integrada con backend pero sus requisitos de persistencia describen un archivo JavaScript simulado; se conserva esa diferencia como alcance por aclarar.
