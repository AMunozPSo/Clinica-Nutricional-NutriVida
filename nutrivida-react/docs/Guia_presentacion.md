# Guía de presentación NutriVida

Antonia Muñoz y Felipe Araya · DSY1104 · Evaluación Parcial 2

## Distribución de los 15 minutos

| Tiempo | Contenido | Evidencia para mostrar |
| --- | --- | --- |
| 0 a 2 min | Problema y arquitectura | Caso de la clínica ficticia, React, Router, componentes y módulos JS de datos. |
| 2 a 5 min | Sesión y experiencia del paciente | Registro, validaciones, perfil y una cita guardada. |
| 5 a 8 min | Compra y administración | Carrito, checkout, aprobación/rechazo, comprobante y edición de catálogo. |
| 8 a 10 min | Roles y atención | Panel Admin, agenda médica, planes y protección de rutas. |
| 10 a 13 min | Pruebas | Ejecutar Jasmine/Karma y mostrar J01, J03 y J07; abrir cobertura HTML. |
| 13 a 15 min | Resultados y límites | Comparar pruebas aprobadas con cobertura y explicar persistencia simulada y próximos pasos. |

Después hay 5 minutos de preguntas. Repartan la exposición, pero ambos deben saber explicar los componentes, estados, props, validaciones y pruebas.

## Preparación antes de exponer

1. Instalar dependencias con `npm ci` en `nutrivida-react` y ejecutar `npm run verify`.
2. Iniciar `npm run dev` y utilizar siempre el mismo origen y puerto.
3. Las cuentas principales son `feli.arayah@duocuc.cl` y `anto.munozp@duocuc.cl`, contraseña `admin123`.
4. Registrar un paciente de demostración con correo Gmail ficticio y datos ficticios. No usar datos de pacientes reales.
5. Si se muestra agenda médica, registrar una cuenta clínica llamada **Camila Rojas**, por ejemplo `c.rojas@clinnutrivida.cl`. Los servicios iniciales se asocian a ese nombre; también puede editarse el profesional en Admin.
6. Si el navegador ya tenía datos antiguos, no borrarlos sin respaldo. Se puede preparar la demostración en un perfil separado. Las ofertas aparecen al configurar un descuento en Admin; en un almacenamiento nuevo Control de Peso inicia con 10 por ciento de descuento.
7. Elegir un día hábil futuro y una hora libre para la reserva. Comprar un servicio no reserva una hora automáticamente.
8. Abrir el ERS, el informe y las evidencias antes de iniciar la exposición. Revisar manualmente menú y formularios en móvil, tableta y escritorio.

## Recorrido funcional

- Paciente: registrar, iniciar sesión, pulsar el saludo, editar teléfono/dirección, reservar y abrir Mis citas. La cancelación libera el horario.
- Comercio: añadir un servicio, modificar cantidad, completar checkout, elegir aprobar el pago simulado y mostrar comprobante. Repetir con rechazo y explicar que conserva el carrito.
- Admin: editar descripción/precio/descuento, crear una categoría y mostrar el filtro público; revisar un usuario, su historial, los estados de citas, las órdenes y los reportes.
- Médico: entrar con la cuenta clínica, mostrar solo sus citas y asignar un plan al paciente de su agenda.
- Testing: `npm run test:jasmine` ejecuta 94 casos con Jasmine/Karma; 74 son compartidos y 20 son nativos. `npm run test:coverage` ejecuta 74 con Vitest.

## Preguntas para practicar

**¿Qué diferencia hay entre props y state?** Las props reciben datos de otro componente; el estado conserva valores que pueden cambiar durante la interacción. TarjetaServicio recibe el servicio por props; los formularios usan estado para campos y errores.

**¿Cómo se actualiza el menú al iniciar sesión?** Se persiste la sesión y se emite un evento. Los hooks suscritos actualizan el estado React; también escuchan cambios entre pestañas.

**¿Qué se guarda al reservar?** Identidad de la sesión, servicio, profesional, fecha/hora, duración, precio y estado Pendiente. Se valida día hábil, horario, duración y solapamientos antes de escribir.

**¿Qué es un mock o spy?** Una sustitución controlada para observar o simular una dependencia. J07 intercepta una escritura de almacenamiento con spyOn para forzar un fallo y comprobar que no se anuncie un guardado exitoso.

**¿Por qué Jasmine y Karma si también está Vitest?** Jasmine/Karma satisfacen la herramienta exigida en la pauta y prueban el DOM en navegador. Vitest mantiene la suite rápida original. Los casos compartidos no se cuentan dos veces como escenarios distintos.

**¿Aprobar todas las pruebas es cobertura del 100 por ciento?** No. Es el porcentaje de casos aprobados. La cobertura de líneas y ramas mide qué partes del código recorren esas pruebas. El informe declara las métricas y sus límites.

**¿Cómo se adapta una tienda a la clínica?** Los productos son servicios, el checkout genera una compra simulada y el comprobante es académico. La agenda y la reserva son otro flujo. Los servicios críticos son registros incompletos que requieren revisión. La adaptación debe defenderse ante el docente.

**¿Es una clínica real lista para producción?** No. Es un frontend académico con fuente de datos JS y localStorage. Para producción se requiere un backend que proteja identidad y datos, además de servicios reales de pago y validación del dominio clínico.

## Lo que no deben afirmar

No decir que hay cobros bancarios reales, boletas tributarias, backend real, seguridad de producción o cobertura del 100 por ciento. No asegurar una nota. La revisión visual manual y la defensa individual son responsabilidades del equipo.
