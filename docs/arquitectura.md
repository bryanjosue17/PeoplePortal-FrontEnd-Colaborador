# Arquitectura — FrontEnd Colaborador

## Páginas implementadas

| Ruta | Componente | Descripción | Roles |
|---|---|---|---|
| `/dashboard` | `Dashboard.jsx` | Resumen de solicitudes, documentos y comunicados | employee |
| `/profile` | `Profile.jsx` | Información laboral + edición de contacto personal | employee |
| `/documents` | `Documents.jsx` | Repositorio de documentos del colaborador (con búsqueda) | employee |
| `/requests` | `Requests.jsx` | Solicitudes de vacaciones, constancias y vouchers (con filtro y paginación) | employee |
| `/announcements` | `Announcements.jsx` | Comunicados internos activos | employee |
| `/benefits` | `Benefits.jsx` | Catálogo de beneficios de la empresa | employee |
| `/team-requests` | `TeamRequests.jsx` | Solicitudes del equipo para aprobar/rechazar | jefe_inmediato |

---

## Estructura del proyecto

```
PeoplePortal-FrontEnd-Colaborador/
├── public/
├── src/
│   ├── api/                    ← Clientes HTTP (Axios)
│   │   ├── client.js           ←   Instancia Axios + interceptor Bearer
│   │   ├── dashboard.js
│   │   ├── documents.js
│   │   ├── employees.js
│   │   ├── announcements.js
│   │   ├── benefits.js
│   │   ├── requests.js
│   │   ├── manager.js          ←   Endpoints jefe_inmediato (equipo)
│   │   └── vouchers.js         ←   Mis vouchers de pago
│   ├── components/
│   │   └── Layout.jsx          ← Sidebar + header + campana de notificaciones
│   ├── context/
│   │   ├── ThemeContext.jsx     ← Tema claro/oscuro/sistema persistido en localStorage
│   │   └── NotificationsContext.jsx ← Polling 90s + detección de cambios de estado
│   ├── pages/
│   │   ├── Dashboard/
│   │   ├── Profile/
│   │   ├── Documents/
│   │   ├── Requests/
│   │   ├── Announcements/
│   │   ├── Benefits/
│   │   └── TeamRequests/       ← Vista de jefe_inmediato (condicional por rol)
│   ├── test/                   ← Tests unitarios (Vitest)
│   ├── theme/
│   │   └── theme.js            ← Tema MUI v9 con dark mode Material 3
│   ├── keycloak.js
│   ├── App.jsx
│   └── main.jsx
├── k8s/
│   └── frontend-colaborador.yaml
├── Dockerfile
├── nginx.conf
├── vite.config.js
└── docs/
```

---

## Árbol de rutas (React Router v7)

```
/                    → redirect a /dashboard
/dashboard           → Dashboard (requiere auth Keycloak)
/profile             → Profile
/documents           → Documents
/requests            → Requests
/announcements       → Announcements
/benefits            → Benefits
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
