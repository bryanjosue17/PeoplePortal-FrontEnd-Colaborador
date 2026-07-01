# Endpoints Consumidos — FrontEnd Colaborador

Todos los endpoints se invocan vía `client.js` (Axios + interceptor Bearer).  
Base URL: configurada por `VITE_API_URL` (vacío = misma origin).

---

## Perfil del colaborador

| Método | Ruta | Página | Descripción |
|---|---|---|---|
| `GET` | `/api/employees/me` | Profile | Obtener datos laborales y personales propios |
| `PUT` | `/api/employees/me` | Profile | Actualizar teléfono y contacto de emergencia |

---

## Dashboard

| Método | Ruta | Página | Descripción |
|---|---|---|---|
| `GET` | `/api/dashboard` | Dashboard | Datos agregados: perfil + solicitudes + documentos + comunicados + beneficios |

---

## Solicitudes

| Método | Ruta | Página | Descripción |
|---|---|---|---|
| `GET` | `/api/requests/me` | Requests | Listar mis solicitudes con estado |
| `POST` | `/api/requests/vacation` | Requests | Crear solicitud de vacaciones |
| `POST` | `/api/requests/certificate` | Requests | Crear solicitud de constancia laboral |
| `POST` | `/api/requests/voucher` | Requests | Crear solicitud de voucher de pago |
| `POST` | `/api/requests/:id/cancel` | Requests | Cancelar solicitud propia (si está en estado Submitted) |

---

## Documentos

| Método | Ruta | Página | Descripción |
|---|---|---|---|
| `GET` | `/api/documents/me` | Documents | Listar documentos del expediente propio |

---

## Comunicados

| Método | Ruta | Página | Descripción |
|---|---|---|---|
| `GET` | `/api/announcements` | Announcements | Comunicados internos activos |

---

## Beneficios

| Método | Ruta | Página | Descripción |
|---|---|---|---|
| `GET` | `/api/benefits` | Benefits | Catálogo de beneficios activos |
