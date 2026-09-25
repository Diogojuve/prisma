# PRISM — Comunidad universitaria USMP Arequipa

PRISM es una web progresiva para la comunidad de la **USMP Filial Sur, Arequipa**. Esta primera versión ya tiene autenticación real, base de datos local, inicio comunitario, publicaciones, historias, actividades con límite de personas y perfil.

## Funcionalidades actuales

- Registro e inicio de sesión con correo y contraseña. No se puede entrar con un correo que no tenga cuenta.
- Contraseñas protegidas con `bcrypt` y sesión con cookie `HttpOnly`.
- Inicio limpio, sin panel lateral ni datos de relleno.
- Historias de 24 horas. Las fotos se seleccionan con la cámara del celular (`capture`).
- Publicaciones con imagen opcional tomada desde la cámara.
- Actividades de deporte, juego, estudio, transporte o ayuda. El autor indica cuántos lugares faltan y los estudiantes pueden conectarse o retirarse.
- Perfil con nombre, correo, carrera, foto opcional y cantidad real de publicaciones, historias y actividades.
- Campanita de notificaciones en la esquina superior. Solo aparecen avisos generados por acciones reales.
- Chat y Market aparecen en la navegación, pero todavía no permiten entrar: sus URLs y funciones se habilitarán cuando se definan.
- Diseño pensado primero para celular, con navegación inferior y controles táctiles.

La autenticación con dominio exclusivo `@usmp.edu.pe` queda preparada para una actualización posterior; la versión actual acepta cualquier correo válido. Para activarla antes de esa actualización, configura `USMP_EMAIL_ONLY=true`.

## Ejecutar localmente

Requiere Node.js 20 o superior.

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`.

Para una ejecución normal:

```bash
npm start
```

La base de datos se crea automáticamente en `data/prisma.sqlite`. Ese archivo no se sube a Git.

## Variables de entorno

| Variable | Valor por defecto | Uso |
| --- | --- | --- |
| `PORT` | `3000` | Puerto HTTP. Render lo define automáticamente. |
| `DATABASE_PATH` | `./data/prisma.sqlite` | Ruta del archivo SQLite. |
| `NODE_ENV` | desarrollo | En Render debe ser `production`. |
| `USMP_EMAIL_ONLY` | `false` | Cuando sea `true`, solo permite correos `@usmp.edu.pe`. |

## Deploy en Render

`render.yaml` ya configura un web service Node:

1. Crear un Blueprint desde el repositorio de GitHub o crear un **Web Service** manualmente. No debe ser un `Static Site`.
2. Render ejecutará `npm ci --omit=dev` y `npm start`.
3. El endpoint de salud está en `/api/health` y debe devolver JSON.

Si ya existe un servicio de tipo **Static Site**, Render no lo convierte automáticamente al cambiar `render.yaml`: hay que crear un Web Service nuevo o eliminar el Static Site y crear el servicio usando el repositorio.

SQLite es la opción adecuada para esta etapa de desarrollo, pero el disco de un servicio web gratuito de Render puede ser efímero. Si se necesita conservar datos entre despliegues, se debe montar un Render Disk de pago en `/opt/render/project/src/data` y configurar `DATABASE_PATH=/opt/render/project/src/data/prisma.sqlite`. Cuando el proyecto crezca, la capa de acceso a datos puede migrarse a PostgreSQL sin cambiar la interfaz de la API.

## Rutas principales

- `#/inicio`: publicaciones, historias y actividades.
- `#/perfil`: datos del usuario y estadísticas reales.

Las secciones de Chat y Market son visibles como próximos pasos, pero no tienen ruta funcional todavía. Los módulos antiguos y el panel lateral fueron retirados del inicio.

## Estructura

- `server.js`: servidor Express, API, sesiones y esquema SQLite.
- `index.html`: estructura de la aplicación y formularios.
- `app.js`: interacción del cliente y consumo de la API.
- `styles.css`: interfaz responsive mobile-first.
- `sw.js` / `manifest.webmanifest`: soporte PWA.
- `render.yaml`: configuración de despliegue.

## Nota de marca

El logo de la USMP sigue siendo una marca de la Universidad San Martín de Porres. PRISM es un proyecto académico no oficial para la Filial Sur Arequipa; si la universidad lo solicita, se puede retirar o reemplazar el logo.
