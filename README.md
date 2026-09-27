# 🔮 PRISM — Red Social Universitaria USMP 

> **Entrega Grupal — Aplicaciones Web & PWA**  
> **Universidad de San Martín de Porres (USMP)**

[![Render Deploy](https://img.shields.io/badge/Render-Live%20App-00ff88?style=for-the-badge&logo=render&logoColor=white)](https://prisma-1t3k.onrender.com/)
[![Figma Prototype](https://img.shields.io/badge/Figma-Prototipo%201%3A1-F24E1E?style=for-the-badge&logo=figma&logoColor=white)](https://www.figma.com/make/sbPXuaub3Iglrf9dkF5L84/Dise%C3%B1ar-interfaces-web-PWA?t=6xZtxAAAH5lR2F47-1)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Diogojuve%2Fprisma-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Diogojuve/prisma)

---

## 📌 Enlaces Oficiales de Entrega

- 🌐 **RENDER URL (App en vivo):** [https://prisma-1t3k.onrender.com/](https://prisma-1t3k.onrender.com/)
- 🎨 **FIGMA URL (Prototipo UI/UX):** [https://www.figma.com/make/sbPXuaub3Iglrf9dkF5L84/Dise%C3%B1ar-interfaces-web-PWA?t=6xZtxAAAH5lR2F47-1](https://www.figma.com/make/sbPXuaub3Iglrf9dkF5L84/Dise%C3%B1ar-interfaces-web-PWA?t=6xZtxAAAH5lR2F47-1)
- 💻 **CÓDIGO URL (GitHub):** [https://github.com/Diogojuve/prisma](https://github.com/Diogojuve/prisma)

---

## 🌿 Flujo de Ramas en GitHub (`Git Flow`)

Para cumplir con la exigencia docente de desarrollo modular por ramas de características, el repositorio cuenta con las siguientes ramas temáticas:

| Rama | Descripción del Módulo | Estado |
| :--- | :--- | :--- |
| **`main`** | Versión de producción unificada con despliegue continuo en Render. | ✅ En producción |
| **`feature/rediseño-ui-figma`** | Rediseño de UI fiel al prototipo Figma (Dark Wine `#0e0207` & Neón `#ff2e63`), PWA móvil, Service Worker v12 y avatares 1:1. | ✅ Fusionado |
| **`feature/redis-cache-upstash`** | Integración de Upstash Redis (Cache-Aside en `/api/feed`), invalidación atómica de versión, HTTP HEAD/OPTIONS/PUT/DELETE, Temp Data (Flash) y View Data. | ✅ Fusionado |
| **`feature/websockets-socketio`** | Servidor y cliente Socket.IO en tiempo real: Chat global del campus, presencia de alumnos conectados en vivo y notificaciones reactivas. | ✅ Fusionado |

---

## 🎓 Cobertura de los 10 Tópicos Evaluados

| # | Tópico Académico | Implementación en PRISM | Archivos Clave |
| :-: | :--- | :--- | :--- |
| **1** | **Base de Datos** | SQLite 3 en modo **WAL** (`data/prisma.sqlite`), transacciones ACID, claves foráneas activas, tablas relacionales (`users`, `posts`, `post_likes`, `chat_messages`, `stories`, `notifications`) y script de siembra automática. | `server.js`, `scripts/seed.js` |
| **2** | **HTTP Methods** | Implementación estricta de métodos RESTful: `GET` (con caché), `POST` (con invalidación de caché), `PUT` (reemplazo completo de perfil), `PATCH` (modificación parcial), `DELETE` (eliminación de posts/historias), `HEAD` (verificación rápida en `/api/health` sin cuerpo) y `OPTIONS` (`Allow: GET, POST, DELETE, OPTIONS, HEAD` en `/api/posts`). | `server.js` |
| **3** | **Aplicaciones Web / PWA** | Web App Progresiva instalable con soporte offline, Service Worker (`sw.js` v12) con estrategia Cache-First/Network-Fallback, `manifest.webmanifest` y diseño adaptativo mobile-first. | `sw.js`, `manifest.webmanifest`, `styles.css` |
| **4** | **Sesiones** | Generación de tokens criptográficos de 256 bits (`crypto.randomBytes(32)`), persistidos en BD y sincronizados en caché distribuida. Middleware de autenticación y renovación automática. | `server.js` (`createSession`, `requireAuth`) |
| **5** | **Cookies** | Cookie de sesión `prism_session` protegida contra XSS y CSRF mediante banderas `httpOnly: true`, `sameSite: 'lax'`, `secure: true` (en producción) y tiempo de vida configurable. | `server.js` |
| **6** | **Temp Data (Flash)** | Mensajes efímeros de consumo destructivo único (Flash notifications) almacenados en Redis / sesión temporal con TTL de 60s mediante endpoints `/api/temp-data`. | `server.js`, `redis-client.js` |
| **7** | **View Data** | Endpoint `/api/view-data` que provee datos y metadatos estructurados del campus universitario (periodo 2026-I, facultades, estado de infraestructura) para inicialización de vistas. | `server.js` (`/api/view-data`) |
| **8** | **Redis** | Integración con **Upstash Redis Cloud** mediante REST API: Caché de alto rendimiento para el feed con cabeceras `X-Cache: HIT` / `X-Cache: MISS`, invalidación atómica por versionado (`prism:feed:ver`) y métricas en `/api/redis/stats`. | `redis-client.js`, `server.js` |
| **9** | **APIs** | API RESTful estandarizada bajo `/api/*` con respuestas estructuradas en JSON, control de errores HTTP semánticos (200, 201, 204, 400, 401, 403, 404, 429), Rate Limiting por IP/usuario y sanitización contra inyecciones. | `server.js` |
| **10** | **WebSockets** | Conexión bidireccional en tiempo real con **Socket.IO**: Chat general del campus, historial persistente, presencia y contador de estudiantes conectados, y difusión de notificaciones al publicar. | `server.js`, `app.js`, `scripts/test-sockets.js` |

---

## 🚀 Ejecución y Pruebas Locales

### 1. Clonar e instalar dependencias
```bash
git clone https://github.com/Diogojuve/prisma.git
cd prisma
npm install
```

### 2. Configurar variables de entorno
Crea un archivo `.env` basado en `.env.example`:
```env
PORT=3000
NODE_ENV=development
DATABASE_PATH=./data/prisma.sqlite
UPSTASH_REDIS_REST_URL=https://tu-instancia.upstash.io
UPSTASH_REDIS_REST_TOKEN=tu_token_aqui
```

### 3. Sembrar datos iniciales (Usuarios, posts y chat del campus)
```bash
npm run seed
```

### 4. Probar WebSockets en tiempo real
```bash
npm run test:sockets
```

### 5. Iniciar servidor
```bash
npm start
# o en modo desarrollo:
npm run dev
```

Abre tu navegador en `http://localhost:3000`.

---

## 👥 Equipo de Desarrollo

- **Proyecto:** PRISM (Plataforma de Red e Interacción Social para la USMP Filial Sur)
- **Curso:** Desarrollo de Aplicaciones Web / PWA
- **Sede:** USMP Filial Sur, Arequipa - 2026
