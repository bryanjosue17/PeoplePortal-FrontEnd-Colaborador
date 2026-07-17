# Arquitectura — FrontEnd Colaborador

## Páginas implementadas

| Ruta | Componente | Descripción | Roles |
|---|---|---|---|
| `/dashboard` | `Dashboard.jsx` | Resumen de solicitudes, documentos y comunicados + DiceAvatar | employee |
| `/profile` | `Profile.jsx` | Información laboral + edición de contacto personal | employee |
| `/documents` | `Documents.jsx` | Repositorio de documentos del colaborador (con búsqueda) | employee |
| `/requests` | `Requests.jsx` | Solicitudes de vacaciones, constancias y vouchers (tabs inline) | employee |
| `/announcements` | `Announcements.jsx` | Comunicados internos activos | employee |
| `/benefits` | `Benefits.jsx` | Catálogo de beneficios (solo lectura) | employee |
| `/nomina` | `Nomina.jsx` | Comprobantes de nómina propios con filtro por tipo | employee |
| `/team-requests` | `TeamRequests.jsx` | Solicitudes del equipo para aprobar/rechazar | jefe_inmediato |

---

## Estructura del proyecto

```
PeoplePortal-FrontEnd-Colaborador/
├── public/
├── src/
│   ├── api/                    ← Clientes HTTP (Axios)
│   │   ├── client.js           ←   Instancia Axios + interceptor Bearer (lee keycloak.token)
│   │   ├── dashboard.js
│   │   ├── documents.js
│   │   ├── employees.js
│   │   ├── announcements.js
│   │   ├── benefits.js
│   │   ├── requests.js
│   │   ├── manager.js          ←   Endpoints jefe_inmediato
│   │   └── nomina.js           ←   GET /api/nomina/me
│   ├── components/
│   │   ├── Layout.jsx          ← Sidebar glassmorphism + DiceAvatar en header
│   │   └── DiceAvatar.jsx      ← Avatar Dicebear Lorelei (seed=email)
│   ├── context/
│   │   ├── AuthContext.jsx     ← Login ROPC, tokens sessionStorage, refresh auto
│   │   ├── ThemeContext.jsx     ← Tema claro/oscuro/sistema persistido en localStorage
│   │   └── NotificationsContext.jsx ← Polling 90s
│   ├── pages/
│   │   ├── Dashboard/
│   │   ├── Login/              ← Formulario login (ROPC)
│   │   ├── Profile/
│   │   ├── Documents/
│   │   ├── Requests/
│   │   ├── Announcements/
│   │   ├── Benefits/
│   │   ├── Nomina/             ← Comprobantes de nómina
│   │   └── TeamRequests/       ← Vista de jefe_inmediato
│   ├── test/                   ← Tests unitarios (Vitest)
│   ├── theme/
│   │   └── theme.js            ← Tema MUI v9 con dark mode Material 3
│   ├── keycloak.js             ← Proxy de token (NO llama init)
│   ├── App.jsx
│   └── main.jsx
├── k8s/
│   ├── base/                   ← Deployment + Service base
│   └── overlays/
│       ├── develop/            ← imagen :develop (Docker Desktop)
│       └── production/         ← imagen :main
├── Dockerfile
├── nginx.conf
├── vite.config.js
└── docs/
```

---

## Árbol de rutas (React Router v7)

```
/                    → redirect a /dashboard
/login               → LoginPage (formulario ROPC)
/dashboard           → Dashboard
/profile             → Profile
/documents           → Documents
/requests            → Requests
/announcements       → Announcements
/benefits            → Benefits
/nomina              → Nomina (comprobantes)
/team-requests       → TeamRequests (solo visible para rol jefe_inmediato)
```

Todas las rutas están protegidas: el `ReactKeycloakProvider` bloquea el render hasta que Keycloak inicializa. El ítem "Mi Equipo" solo aparece en el sidebar cuando el token JWT contiene el rol `jefe_inmediato`.

---

## Componente Layout

El componente `Layout.jsx` envuelve todas las páginas y provee:
- **Sidebar** de navegación con links a todas las secciones
- El ítem **Mi Equipo** aparece condicionalmente si el usuario tiene rol `jefe_inmediato`
- **Header** con nombre de usuario, selector de tema (claro/oscuro/sistema) y **campana de notificaciones** con badge
- **NotificationsContext**: polling cada 90 s a `/api/requests/me`; detecta cambios de estado (Submitted → Approved/Rejected) y emite toasts automáticos

---

## Tests

| Archivo | Qué cubre | Tests |
|---|---|---|
| `keycloak.test.js` | Configuración: URL, realm, clientId | 3 |
| `client.test.js` | Instancia Axios + interceptor Bearer | 5 |
| `Layout.test.jsx` | Navegación, nombre usuario, children | 6 |
| `Dashboard.test.jsx` | Estados loading / error / data | 5 |
| **Total** | | **19** |
