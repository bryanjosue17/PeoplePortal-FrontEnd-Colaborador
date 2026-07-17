# Despliegue — FrontEnd Colaborador

## Local (desarrollo)

```bash
cd PeoplePortal-FrontEnd-Colaborador
npm install
npm run dev        # http://localhost:5173
```

---

## Variables de entorno

| Variable | Descripción | Valor por defecto |
|---|---|---|
| `VITE_KEYCLOAK_URL` | URL del servidor Keycloak | `http://localhost:8080` |
| `VITE_API_URL` | Base URL de la API (vacío = misma origin) | `""` |

Crear `.env.local` para desarrollo:

```env
VITE_KEYCLOAK_URL=http://localhost:8080
VITE_API_URL=
```

---

## Docker (multi-stage build)

```bash
# Build imagen
docker build -t peopleportal-frontend-colaborador:latest .

# Correr localmente
docker run -p 30081:80 \
  -e VITE_KEYCLOAK_URL=http://localhost:8080 \
  peopleportal-frontend-colaborador:latest
```

El `Dockerfile` usa build multi-stage:
1. **Stage 1 (node):** `npm ci && npm run build` → genera `dist/`
2. **Stage 2 (nginx:alpine):** sirve `dist/` y aplica `nginx.conf`

---

## Configuración nginx

```nginx
server {
    listen 80;

    location / {
        root   /usr/share/nginx/html;
        index  index.html;
        try_files $uri $uri/ /index.html;  # SPA routing
    }

    location /api/ {
        proxy_pass http://peopleportal-api-service:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Las llamadas a `/api/` son redirigidas internamente al servicio del backend dentro del namespace `peopleportal`.

---

## Kubernetes

Manifiesto: `k8s/frontend-colaborador.yaml`

```bash
kubectl apply -f k8s/frontend-colaborador.yaml
kubectl rollout status deployment/frontend-colaborador -n peopleportal
```

| Parámetro | Valor |
|---|---|
| Imagen | `peopleportal-frontend-colaborador:latest` |
| ImagePullPolicy | `Never` (imagen local Docker Desktop) |
| Service type | `NodePort` |
| Puerto externo | `30081` |
| URL de acceso | `http://localhost:30081` |

---

## CI/CD (GitHub Actions)

Pipeline: `.github/workflows/ci.yml`

| Job | Acciones |
|---|---|
| `build-test` | `npm ci` → `oxlint` → `npm run test:coverage` (Codacy) → `npm run build` |
| `docker` | `docker build` → push a GHCR (`peopleportal-frontend-colaborador`) |

Tags: `{branch}-{short-sha}` y `latest` en `main`.
