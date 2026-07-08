# Módulo 1: Auth + Estructura Base — Diseño

**Fecha:** 2026-07-07
**Proyecto:** Vívelo.cr
**Sub-proyecto:** 1 de 5 (ver roadmap en sección "Contexto del roadmap")

## Contexto del roadmap

Vívelo.cr es una plataforma de invitaciones digitales para eventos (bodas, cumpleaños, etc.)
con RSVP, GPS, cuenta regresiva, álbum de fotos por QR, modo en vivo y panel admin.
Dado el tamaño del proyecto, se construye por módulos, en este orden:

1. **Auth + estructura base** ← este documento
2. Generador de invitación personalizada
3. Álbum de fotos con QR
4. Panel admin (RSVP, invitados)
5. Modo fiesta / proyección en vivo

Pagos se integra al final o en paralelo con el panel admin (módulo 4), sin fecha fija aún.

## Objetivo del módulo

Tener una base funcional donde el dueño de la plataforma (admin, un solo rol por ahora)
pueda autenticarse y gestionar eventos (crear/editar/eliminar) a través de un panel simple.
No incluye: registro público, roles de organizador/invitado, generador automático de
invitaciones, ni ningún feature de los módulos 2-5.

## Stack técnico

- **Frontend + backend:** Next.js 14+ (App Router, TypeScript), desplegado en Vercel
- **Base de datos + Auth:** Supabase (Postgres + Supabase Auth), vía `@supabase/ssr`
  para manejo de sesión en cookies server-side
- **Estilos:** Tailwind CSS
- **Testing:** Vitest + Testing Library
- Un solo repo: frontend y backend viven juntos en el mismo proyecto Next.js

## Estructura de carpetas

```
vivelo-cr/
├── app/
│   ├── (public)/                 # rutas públicas (landing, futuras invitaciones)
│   ├── admin/
│   │   ├── login/page.tsx        # pantalla de login
│   │   ├── layout.tsx            # layout protegido (redirige si no hay sesión)
│   │   ├── page.tsx              # dashboard: lista de eventos
│   │   ├── nuevo-evento/page.tsx # formulario de creación de evento
│   │   └── eventos/[id]/page.tsx # editar / eliminar evento
│   └── api/                      # route handlers (ej. logout)
├── lib/
│   └── supabase/
│       ├── client.ts             # cliente Supabase para browser
│       ├── server.ts             # cliente Supabase para server components
│       └── middleware.ts         # refresco de sesión
├── middleware.ts                 # protege /admin/* redirigiendo a /admin/login
├── components/                   # componentes UI compartidos
└── types/
    └── database.ts               # tipos generados de Supabase (tabla events)
```

## Modelo de datos

Tabla `events` en Supabase:

| Campo | Tipo | Notas |
|---|---|---|
| id | uuid | PK, default `gen_random_uuid()` |
| created_at | timestamptz | default `now()` |
| nombre | text | ej. "Boda de Ana y Luis" |
| tipo_evento | text | boda / cumpleaños / otro |
| fecha_evento | timestamptz | fecha y hora del evento |
| ubicacion | text | dirección o texto libre (GPS estructurado llega en módulo 2) |
| slug | text | único, para la URL pública futura (ej. `ana-luis-2026`) |
| paquete | text | esencial / clasico / premium |
| estado | text | borrador / activo / finalizado |

**RLS (Row Level Security):** activado desde el inicio. Solo el usuario autenticado
(el admin) puede leer/escribir en `events`. No hay políticas públicas todavía — se
abren en el módulo 2 cuando exista la página pública de invitación.

## Flujo de autenticación

1. Usuario visita `/admin/*` sin sesión → middleware redirige a `/admin/login`.
2. Login con email/password contra Supabase Auth (`signInWithPassword`).
3. Al autenticar, Supabase pone la sesión en cookies (vía `@supabase/ssr`); el
   middleware la refresca en cada request.
4. Dashboard (`/admin`) carga la lista de `events` vía server component, usando el
   cliente Supabase server-side (respeta RLS automáticamente).
5. Logout limpia la sesión y redirige a `/admin/login`.

**Creación de la cuenta admin:** manual, una sola vez, desde el dashboard de Supabase.
No hay registro público. Un único email (el del dueño de la plataforma).

## Gestión de eventos (CRUD completo)

- **Crear:** formulario en `/admin/nuevo-evento` (nombre, tipo, fecha, ubicación, paquete).
- **Editar:** formulario en `/admin/eventos/[id]` con los mismos campos.
- **Eliminar:** acción de borrado desde el dashboard o desde `/admin/eventos/[id]`,
  con confirmación antes de ejecutar (modal o `confirm()` simple).
- **Listar:** dashboard (`/admin`) muestra todos los eventos con nombre, fecha, estado y paquete.

## Manejo de errores

- Credenciales inválidas → mensaje genérico en el form ("Email o contraseña
  incorrectos"), sin distinguir cuál campo falló (evita enumeración de usuarios).
- Sesión expirada → redirect silencioso a login, sin mensajes confusos.
- Falla de conexión a Supabase → página de error genérica de Next.js; el error se
  loguea en consola de servidor (sin servicio de monitoreo externo por ahora — Sentry
  queda como posible mejora futura, no incluido en este módulo).
- Errores de validación de formulario (campos requeridos, fechas inválidas) →
  mensajes inline junto al campo correspondiente.

## Testing

- Tests de integración del flujo de login (credenciales válidas e inválidas) con
  Vitest + Testing Library.
- Tests del CRUD de eventos (crear, editar, eliminar, listar) contra una instancia
  de prueba de Supabase o mocks del cliente.
- Verificación manual de que RLS bloquea acceso a `events` sin sesión autenticada
  (probando la API de Supabase directamente, ej. con curl o el cliente anónimo).

## Fuera de alcance (explícitamente, para este módulo)

- Registro público de usuarios, roles de organizador/invitado.
- Página pública de invitación (módulo 2).
- GPS estructurado, cuenta regresiva, álbum de fotos, modo en vivo (módulos 2-5).
- Integración de pagos.
- Monitoreo/observabilidad externa (Sentry, etc.).
