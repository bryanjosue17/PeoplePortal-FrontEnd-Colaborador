# Arquitectura — FrontEnd Colaborador

## Páginas implementadas

| Ruta | Componente | Descripción |
|---|---|---|
| `/dashboard` | `Dashboard.jsx` | Resumen de solicitudes, documentos y comunicados |
| `/profile` | `Profile.jsx` | Información laboral + edición de contacto personal |
| `/documents` | `Documents.jsx` | Repositorio de documentos del colaborador |
| `/requests` | `Requests.jsx` | Solicitudes de vacaciones, constancias y vouchers |
| `/announcements` | `Announcements.jsx` | Comunicados internos activos |
| `/benefits` | `Benefits.jsx` | Catálogo de beneficios de la empresa |

---

## Estructura del proyecto

```
PeoplePortal-FrontEnd-Colaborador/
├── public/
├── src/
│   ├── api/                    ← Clientes HTTP (Axios)
│   │   └── client.js           ←   Instancia Axios + interceptor Bearer
│   ├── components/
│   │   └── Layout.jsx          ← Navegación lateral + header con usuario
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Profile.jsx
│   │   ├── Documents.jsx
│   │   ├── Requests.jsx
│   │   ├── Announcements.jsx
│   │   └── Benefits.jsx
│   ├── test/                   ← Tests unitarios (Vitest)
│   │   ├── keycloak.test.js
│   │   ├── client.test.js
│   │   ├── Layout.test.jsx
│   │   └── Dashboard.test.jsx
│   ├── theme/
│   │   └── index.js            ← Tema MUI personalizado
│   ├── keycloak.js             ← Config Keycloak (URL, realm, clientId)
│   ├── App.jsx                 ← Router + ReactKeycloakProvider
│   └── main.jsx                ← Entry point
├── k8s/
│   └── frontend-colaborador.yaml
├── Dockerfile
├── nginx.conf
├── vite.config.js
└── docs/                       ← esta carpeta
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
```

Todas las rutas están protegidas: el `ReactKeycloakProvider` bloquea el render hasta que Keycloak inicializa y el usuario está autenticado.

---

## Componente Layout

El componente `Layout.jsx` envuelve todas las páginas y provee:
- **Sidebar** de navegación con links a todas las secciones
- **Header** con nombre de usuario (de `keycloak.tokenParsed.name`)
- **Botón logout** que llama a `keycloak.logout()`

---

## Tests

| Archivo | Qué cubre | Tests |
|---|---|---|
| `keycloak.test.js` | Configuración: URL, realm, clientId | 3 |
| `client.test.js` | Instancia Axios + interceptor Bearer | 5 |
| `Layout.test.jsx` | Navegación, nombre usuario, children | 6 |
| `Dashboard.test.jsx` | Estados loading / error / data | 5 |
| **Total** | | **19** |
