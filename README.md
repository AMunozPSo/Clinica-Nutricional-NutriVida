# Clínica Nutricional NutriVida

Proyecto académico de **Antonia Muñoz y Felipe Araya**, DSY1104 Desarrollo Fullstack II.

## Contenido del repositorio

| Carpeta o archivo | Contenido |
|---|---|
| `Prueba 1`, `Prueba 2` | Entregas anteriores (HTML/CSS/JS y primera versión React) |
| `Prueba 3/frontend` | Frontend React de la Evaluación 3, integrado con el backend por API REST |
| `compose.yaml`, `Caddyfile`, `mysql/` | Despliegue con Docker: MySQL, cuatro microservicios y Caddy con HTTPS |
| `desplegar-web.sh` | Script que compila y publica el frontend en la instancia EC2 |
| `mysql/datos-demo.sql` | Categorías y servicios de demostración (se puede ejecutar varias veces sin duplicar) |

El backend está en un repositorio separado, con un microservicio Spring Boot por rama (`microservicio/usuarios`, `catalogo`, `atencion` y `ventas`):
https://github.com/f-hnv/MicroserviciosNutriVida

## Demostración en AWS

https://50.17.200.0.sslip.io

Funciona mientras el Learner Lab y la instancia EC2 estén encendidos.

## Evaluación 3: ejecución local del frontend

```sh
cd "Prueba 3/frontend"
npm ci
npm run dev
```

El frontend llama a `/api/v1` con `fetch`. En desarrollo, Vite reenvía esas rutas a los microservicios según `vite.config.js`; en producción lo hace Caddy según `Caddyfile`.

## Autenticación y roles

El inicio de sesión entrega un JWT firmado con RSA que el frontend envía en cada petición. Los permisos se validan en el backend con Spring Security.

| Rol | Acceso |
|---|---|
| Administrador | Acceso total: usuarios, catálogo, citas, órdenes y reportes |
| Vendedor | Solo lectura de productos y órdenes, con su detalle (`/vendedor`) |
| Nutricionista | Agenda médica, planes y progreso de sus pacientes |
| Paciente (cliente) | Tienda, compras, citas y su propio perfil |

## Pruebas

Las pruebas de Vitest del frontend se escribieron para la versión anterior, que guardaba los datos en `localStorage`. Desde que el frontend consume el backend, la mayoría falla porque no simulan las llamadas `fetch`; quedan pendientes de reescribir. Los pagos son simulados: no hay cobros bancarios reales.
