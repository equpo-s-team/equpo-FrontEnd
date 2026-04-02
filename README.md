# equpo — Landing Page

React + Vite + Tailwind CSS
intento de cambio ahre
## Estructura del proyecto

```
equpo/
├── public/
│   └── fonts/
│       └── MAXWELL_BOLD.ttf       ← fuente custom (ya incluida)
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx
│   │   ├── WhatIsEqupo.jsx
│   │   ├── Nucleus.jsx
│   │   ├── Features.jsx
│   │   ├── CTAFinal.jsx
│   │   └── Footer.jsx
│   ├── hooks/
│   │   └── useReveal.js
│   ├── App.jsx
│   ├── app.css
│   ├── index.css
│   └── main.jsx
├── index.html
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── package.json
```

## Setup

```bash
npm install
npm run dev
```

## Tipografía

- **Maxwell Bold** — H1, H2, logos, botones, números decorativos → clase `font-maxwell`
- **DM Sans** — cuerpo, labels, microcopy → clase `font-body` (default)

Maxwell se carga desde `public/fonts/MAXWELL_BOLD.ttf` via `@font-face` en `index.css`.

## Arquitectura CSS

| Archivo | Propósito |
|---|---|
| `src/index.css` | `@tailwind` directives + `@font-face` + CSS custom properties |
| `src/app.css` | Animaciones, keyframes, pseudo-elementos, clases `.reveal` |
| `tailwind.config.js` | Tokens: colores, fuentes, sombras, animaciones extendidas |

Tailwind maneja layout, spacing y tipografía base.
`app.css` maneja animaciones complejas y efectos que no se expresan limpiamente con utilities.
