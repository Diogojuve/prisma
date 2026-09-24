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

## Marca USMP
- Logo en `assets/usmp-logo.png` — Fuente: Wikimedia Commons `File:USMP-2020.png`, autor: Universidad de San Martín de Porres, licencia PD-textlogo (dominio público por umbral de originalidad, ver página del archivo). Marca registrada de la USMP.
- Proyecto académico no oficial para la Filial Sur Arequipa. Si la universidad lo solicita se retira o reemplaza el logo.
