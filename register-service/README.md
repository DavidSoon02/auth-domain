# Register Service

Servicio de registro de usuarios con autenticación GitHub.

## 🚀 Quick Start

1. **Configurar GitHub OAuth:**
   - Ve a GitHub Settings > Developer settings > OAuth Apps
   - Crea una nueva OAuth App con:
     - Authorization callback URL: `http://localhost:3002/auth/github/callback`
   - Actualiza `.env` con `GITHUB_CLIENT_ID` y `GITHUB_CLIENT_SECRET`

2. **Actualizar base de datos:**
   ```sql
   -- Ejecutar en DBeaver:
   ALTER TABLE users ADD COLUMN IF NOT EXISTS github_id VARCHAR(255) UNIQUE;
   ```

3. **Iniciar servicio:**
   ```bash
   npm run dev
   ```

## 📡 Endpoints

- `POST /register` - Registro tradicional
- `GET /auth/github` - Iniciar auth con GitHub
- `GET /auth/github/callback` - Callback de GitHub
- `GET /health` - Health check

## 🧪 Probar

**Registro tradicional:**
```bash
curl -X POST http://localhost:3002/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "password": "password123",
    "firstName": "Nombre",
    "lastName": "Apellido"
  }'
```

**GitHub OAuth:**
```
http://localhost:3002/auth/github
```

## 🔧 Configuración

Actualiza `.env` con tus credenciales de GitHub OAuth.
