# FrontEnd Colaborador — Documentación

## Stack

| Componente | Tecnología |
|---|---|
| Framework | React 19 |
| Build tool | Vite |
| UI Library | MUI v9 (Material UI) |
| Autenticación | Keycloak-js + @react-keycloak/web (PKCE S256) |
| HTTP client | Axios con interceptor Bearer token |
| Router | React Router v7 |
| Tests | Vitest + @testing-library/react |
| Linter | oxlint |

## Páginas implementadas

| Ruta | Componente | Descripción |
|---|---|---|
| `/dashboard` | `Dashboard.jsx` | Resumen de solicitudes, documentos y comunicados del colaborador |
| `/profile` | `Profile.jsx` | Información laboral + edición de contacto personal |
| `/documents` | `Documents.jsx` | Repositorio de documentos del colaborador |
| `/requests` | `Requests.jsx` | Solicitudes de vacaciones, constancias y vouchers |
| `/announcements` | `Announcements.jsx` | Comunicados internos activos |
| `/benefits` | `Benefits.jsx` | Catálogo de beneficios de la empresa |

## API endpoints consumidos

```
GET  /api/employees/me          → Perfil del colaborador (Profile)
PUT  /api/employees/me          → Actualizar perfil (Profile)
GET  /api/dashboard             → Datos del dashboard (Dashboard)
GET  /api/requests/me           → Mis solicitudes (Requests)
POST /api/requests/vacation     → Crear solicitud vacaciones
POST /api/requests/certificate  → Crear solicitud constancia
POST /api/requests/voucher      → Crear solicitud voucher
POST /api/requests/:id/cancel   → Cancelar solicitud
GET  /api/documents/me          → Mis documentos (Documents)
GET  /api/announcements         → Comunicados activos (Announcements)
GET  /api/benefits              → Beneficios activos (Benefits)
```

## Autenticación

- SSO con Keycloak via PKCE Authorization Code Flow (S256)
- Token almacenado en `sessionStorage` bajo la clave `keycloak-token`
- Interceptor Axios inyecta `Authorization: Bearer <token>` en todos los requests
- Realm: `peopleportal` | Client: `peopleportal-frontend`

## Configuración de entorno

| Variable | Descripción | Valor por defecto |
|---|---|---|
| `VITE_API_URL` | Base URL de la API (vacío = misma origin) | `""` |
| `VITE_KEYCLOAK_URL` | URL del servidor Keycloak | `http://localhost:8080` |

## Proxy nginx (K8s)

Las llamadas a `/api/` son interceptadas por nginx y redirigidas al servicio interno de la API:
```nginx
location /api/ {
    proxy_pass http://peopleportal-api-service:80;
}
```

## Kubernetes

Manifiesto: `k8s/frontend-colaborador.yaml`
- Deployment: imagen `peopleportal-frontend-colaborador:latest` (`imagePullPolicy: Never`)
- Service: NodePort `:30081`
- URL local: `http://localhost:30081`

## CI/CD

Pipeline en `.github/workflows/ci.yml`:

1. `build-test`: npm ci → lint → `npm run test:coverage` (reporta a Codacy) → build
2. `docker`: build + push imagen a GHCR (`peopleportal-frontend-colaborador`)

## Comandos

```bash
# Desarrollo
npm run dev

# Tests
npm test

# Tests con cobertura (Codacy)
npm run test:coverage

# Build producción
npm run build

# Lint
npm run lint

# Build imagen Docker
docker build -t peopleportal-frontend-colaborador:latest .
```
