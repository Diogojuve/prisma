# PRISM — Red Universitaria USMP Arequipa

PWA inspirada en los mockups (Inicio, Chat Global, Randomly, Market, Notificaciones, Perfil).

## Correr local
```bash
npx serve .
# o
python -m http.server 8080
```
Abrir http://localhost:8080

## PWA
- `manifest.webmanifest` + `sw.js` + iconos en `/icons`
- Instalable (standalone, theme #160609)

## Rutas (hash SPA)
- `#/inicio` feed + historias + tendencias
- `#/chat` chat global USMP
- `#/randomly` match aleatorio 2 min
- `#/market` compra/venta S/
- `#/notif` notificaciones
- `#/perfil` Carlos Ríos

Mock data en `app.js`, sin backend.
