# AGENTS

## Alcance rápido
- Proyecto frontend con `React + Vite + Tailwind` y router en cliente (`src/main.jsx`, `src/Router.jsx`).
- Dominio actual: landing pública + dashboard protegido + flujo de autenticación (`src/components/landing`, `src/components/board`, `src/components/auth`).
- Backend consumido desde frontend: Firebase Auth/App Check + Firebase Data Connect SDK generado (`src/firebase.js`, `src/dataconnect-generated`).

## Mapa de arquitectura (lo esencial)
- Entrada: `src/main.jsx` envuelve `App` con `AuthProvider`; el estado auth global vive en `src/context/AuthContext.jsx`.
- Navegación: `src/Router.jsx` define `/` (landing) y `/dashboard` (con `ProtectedRoute`).
- `ProtectedRoute` bloquea por `isAuth` y espera `isLoading`; además crea `SidebarProvider` solo dentro del dashboard.
- Layout de dashboard: `src/components/AppLayout.jsx` + `src/components/navbar/*` (sidebar desktop, bottom nav mobile).
- Módulo board usa datos mock en `src/components/board/kanbanData.js`; no hay persistencia de kanban aún.

## Flujo de datos/auth que debes respetar
- Fuente de verdad de sesión: `useAuth()` desde `src/context/AuthContext.jsx` (no el hook legado `src/hooks/useAuth.js`).
- Login/signup/reset se orquestan en `src/hooks/useFirebaseAuth.ts` y UI en `src/components/auth/components/AuthForm.tsx`.
- Tras signup/login social se intenta crear usuario de BD con `useDatabaseUser()` (`src/hooks/useDatabaseUser.ts`).
- Lectura de perfil extendido: `AuthContext` hace `getUser({ uid })` desde `@dataconnect/generated` y mezcla con datos de Firebase Auth.

## Convenciones concretas del repo
- Usa alias `@/` para código interno (configurado en `vite.config.js` y `tsconfig.json`).
- El repo mezcla `.jsx` y `.ts/.tsx`; mantén el estilo del módulo que tocas (no migres archivos “de paso”).
- Para clases condicionales Tailwind usa `cn(...)` de `src/lib/utils.ts`.
- Estilo: tokens y animaciones en `tailwind.config.js`; base global en `src/index.css`; efectos complejos en `src/app.css`.
- Barrel de auth en `src/components/auth/index.ts`; prefiere importar desde ahí cuando ya exporta el símbolo.

## Integraciones y límites
- Variables requeridas de Firebase en `src/firebase.js`: `VITE_FIREBASE_*` y `VITE_RECAPTCHA_KEY`.
- App Check se inicializa siempre; en `DEV` usa token debug automático (`src/firebase.js`).
- Data Connect: esquema en `dataconnect/schema/schema.gql`, operaciones en `dataconnect/example/mutations.gql`.
- Código generado en `src/dataconnect-generated/*` (conector `example`); `dataconnect/example/connector.yaml` define salida.
- **No edites** `src/dataconnect-generated/*` ni sus `README.md`: se sobrescriben al regenerar SDK.

## Workflows de desarrollo/entrega
- Comandos disponibles (únicos en `package.json`): `npm run dev`, `npm run build`, `npm run preview`.
- Deploy web en Amplify usa `npm ci` + `npm run build` y sirve `dist` (`amplify.yml`).
- Config Firebase local incluye emulator de Data Connect (`firebase.json`), pero no hay script npm dedicado.

## Riesgos actuales que afectan cambios
- `firestore.rules` permite read/write global hasta `2026-04-14`; cualquier feature de datos sensibles debe validar reglas antes de merge.
- `README.md` raíz describe principalmente la landing; para auth/dashboard confía más en código fuente actual.

