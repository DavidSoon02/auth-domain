# Login Service

A secure authentication service built with Node.js, TypeScript, PostgreSQL, and JWT tokens following clean architecture principles.

## Features

- 🔐 User authentication with email and password
- 🎫 JWT token generation and validation
- 🛡️ Password hashing with bcrypt
- 🚦 Rate limiting for login attempts
- 📊 PostgreSQL database integration
- 🏗️ Clean architecture with dependency injection
- ✅ Input validation with Zod
- 🔒 Security headers with Helmet
- 📝 Comprehensive error handling
- 🌐 CORS support

## Architecture

This service follows clean architecture principles with clear separation of concerns:

```
src/
├── domain/                 # Business logic and entities
│   ├── entities/          # Domain models
│   ├── repositories/      # Repository interfaces
│   ├── services/          # Service interfaces
│   ├── usecases/          # Business use cases
│   └── errors/            # Domain-specific errors
├── infrastructure/        # External concerns
│   ├── database/          # Database connection
│   ├── repositories/      # Repository implementations
│   └── services/          # Service implementations
├── application/           # Application layer
│   ├── controllers/       # HTTP controllers
│   ├── routes/            # Route definitions
│   └── validators/        # Input validation
├── app.ts                 # Application setup
└── index.ts               # Entry point
```

## Prerequisites

- Node.js 18+ 
- PostgreSQL 12+
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd login-service
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:
```env
NODE_ENV=development
PORT=3001

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=auth_db
DB_USER=postgres
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h

# Security
BCRYPT_ROUNDS=12

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=5
```

## Database Setup

### Option 1: Using PowerShell (Windows)
```powershell
.\database\migrate.ps1
```

### Option 2: Using Bash
```bash
chmod +x database/migrate.sh
./database/migrate.sh
```

### Option 3: Manual Setup
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE auth_db;

# Run schema
\i database/schema.sql
```

## Running the Service

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

## API Endpoints

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": "24h",
    "tokenType": "Bearer"
  }
}
```

### Validate Token
```http
POST /api/auth/validate
Authorization: Bearer <your-jwt-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Token is valid",
  "data": {
    "userId": "uuid",
    "email": "test@example.com",
    "firstName": "Test",
    "lastName": "User"
  }
}
```

### Health Check
```http
GET /api/auth/health
```

**Response:**
```json
{
  "success": true,
  "message": "Login service is healthy",
  "timestamp": "2025-07-20T10:30:00.000Z"
}
```

## Testing

A test user is automatically created during database migration:
- **Email:** test@example.com
- **Password:** password123

## Error Handling

The service returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP status codes:
- `200` - Success
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid credentials/token)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

## Security Features

- **Password Hashing:** Uses bcrypt with configurable rounds
- **JWT Tokens:** Secure token generation with expiration
- **Rate Limiting:** Protects against brute force attacks
- **Input Validation:** Validates all incoming data
- **Security Headers:** Helmet.js for security headers
- **CORS:** Configurable cross-origin resource sharing

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `3001` |
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `5432` |
| `DB_NAME` | Database name | `auth_db` |
| `DB_USER` | Database user | `postgres` |
| `DB_PASSWORD` | Database password | `password` |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRES_IN` | Token expiration | `24h` |
| `BCRYPT_ROUNDS` | Password hashing rounds | `12` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | `900000` (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `5` |

## Development

### Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Adding New Features

1. **Domain Layer:** Add entities, use cases, and business rules
2. **Infrastructure Layer:** Implement repositories and services
3. **Application Layer:** Create controllers and routes
4. **Update:** Add tests and documentation

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a strong `JWT_SECRET`
3. Configure database connection pooling
4. Set up proper logging
5. Use a reverse proxy (nginx)
6. Enable SSL/TLS
7. Set up monitoring and health checks

## Contributing

1. Follow clean architecture principles
2. Write tests for new features
3. Use TypeScript strictly
4. Follow existing code style
5. Update documentation

## License

MIT License
