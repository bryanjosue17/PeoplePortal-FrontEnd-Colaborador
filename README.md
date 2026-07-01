# PeoplePortal — Portal del Colaborador

Portal de autoservicio para colaboradores. Permite consultar perfil, documentos, beneficios, comunicados y gestionar solicitudes a RRHH.

## Stack

| Capa | Tecnología |
|---|---|
| UI | React 19 + MUI v9 |
| Build | Vite 8 |
| Auth | Keycloak (PKCE S256) |
| HTTP | Axios + interceptor Bearer |
| Test | Vitest + Testing Library |
| Lint | oxlint |

## Scripts

```bash
npm run dev           # Dev server → http://localhost:5173
npm run build         # Build producción
npm run test          # Tests (Vitest)
npm run test:coverage # Tests con reporte de cobertura (Codacy)
npm run lint          # oxlint
```

## Módulos del portal

| Módulo | Ruta | Descripción |
|---|---|---|
| Dashboard | `/dashboard` | Resumen de solicitudes, documentos y comunicados |
| Perfil | `/profile` | Información laboral + edición de contacto |
| Documentos | `/documents` | Expediente digital del colaborador |
| Solicitudes | `/requests` | Vacaciones, constancias y vouchers |
| Comunicados | `/announcements` | Avisos internos de la empresa |
| Beneficios | `/benefits` | Catálogo de beneficios |

## Despliegue

- **Docker**: imagen `peopleportal-frontend-colaborador:latest` (multi-stage + nginx)
- **K8s**: NodePort `:30081` — `http://localhost:30081`
- **Nginx**: proxy `/api/` → `peopleportal-api-service:80`

## Documentación técnica

Ver [`docs/`](./docs/README.md) para documentación detallada de arquitectura, autenticación, endpoints y despliegue.
