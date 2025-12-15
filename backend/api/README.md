# ShareWay API

ShareWay backend API built with NestJS, TypeORM, PostgreSQL, and Redis.

## Tech Stack

- **Framework:** NestJS (Monolith)
- **Database:** PostgreSQL
- **ORM:** TypeORM
- **Cache/Session:** Redis (ioredis)
- **Authentication:** Double-Token Architecture (JWT + Refresh Token)
- **Email:** @nestjs-modules/mailer with Handlebars templates

## Project Structure

```
src/
├── admin/                   # Admin module (RBAC protected)
│   └── dto/                 # Pagination DTOs
├── auth/                    # Authentication module
│   ├── constants/           # Auth constants (token expiry, cookie options)
│   ├── decorators/          # Custom decorators (@Public, @CurrentUser, @Roles)
│   ├── guards/              # Auth guards (JwtAuthGuard, RefreshTokenGuard, RolesGuard)
│   ├── interfaces/          # TypeScript interfaces
│   └── strategies/          # Passport strategies (JWT, Refresh Token)
├── mailer/                  # Email module
│   └── templates/           # Handlebars email templates
├── redis/                   # Redis module for session management
├── users/                   # Users module
│   ├── dto/                 # Data Transfer Objects
│   └── entities/            # TypeORM entities
└── validation/              # Environment validation
```

## Authentication Flow

This API implements a **Double-Token Architecture**:

1. **Access Token (JWT):** Short-lived (15 min), used for resource access
2. **Refresh Token:** Long-lived (7 days), stored hashed in Redis (allowlist approach)

### Security Features

- Tokens are transmitted via `HttpOnly`, `Secure` cookies
- Refresh tokens are hashed and stored in Redis
- Token rotation on refresh (old token invalidated, new pair issued)
- RBAC (Role-Based Access Control) with Admin role

## API Endpoints

### Auth Module

| Method | Endpoint         | Auth      | Description                  |
| ------ | ---------------- | --------- | ---------------------------- |
| POST   | `/auth/register` | Public    | Register new user            |
| POST   | `/auth/login`    | Public    | Login and receive tokens     |
| POST   | `/auth/logout`   | Protected | Logout and invalidate tokens |
| POST   | `/auth/refresh`  | Protected | Refresh token pair           |

### Users Module

| Method | Endpoint             | Auth      | Description              |
| ------ | -------------------- | --------- | ------------------------ |
| GET    | `/users/me`          | Protected | Get current user profile |
| PATCH  | `/users/me`          | Protected | Update profile (nickname)|
| PATCH  | `/users/me/password` | Protected | Change password          |

### Admin Module (Requires Admin Role)

| Method | Endpoint                       | Auth       | Description                    |
| ------ | ------------------------------ | ---------- | ------------------------------ |
| GET    | `/admin/users`                 | Admin Only | List all users (paginated)     |
| GET    | `/admin/users/:id`             | Admin Only | Get user by ID                 |
| PATCH  | `/admin/users/:id/ban`         | Admin Only | Ban user (deactivate + logout) |
| PATCH  | `/admin/users/:id/unban`       | Admin Only | Unban user (reactivate)        |
| POST   | `/admin/users/:id/reset-password` | Admin Only | Send password reset email   |

## Environment Variables

Copy `.env.example` to `.env.development` and configure:

```bash
# Server Configuration
API_PORT=3000
NODE_ENV=development

# PostgreSQL Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
POSTGRES_PASSWORD=your_password_here
DATABASE_NAME=shareway

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT Secrets
JWT_SECRET=your-access-token-secret-min-32-chars
JWT_REFRESH_SECRET=your-refresh-token-secret-min-32-chars

# Mailer Configuration (Development - uses MailHog)
MAIL_HOST=localhost
MAIL_PORT=1025
MAIL_SECURE=false
MAIL_USER=
MAIL_PASSWORD=
MAIL_FROM="ShareWay" <noreply@shareway.app>

# App Configuration
APP_URL=http://localhost:3000
```

## Setup

### Prerequisites

- Node.js 18+
- PostgreSQL 17
- Redis 8

### Installation

```bash
# Install dependencies
npm install

# Start PostgreSQL and Redis (using Docker)
docker-compose -f docker-compose.dev.yml up -d

# Run in development mode
npm run start:dev
```

### Build

```bash
npm run build
npm run start:prod
```

## DTOs

### RegisterDto

```typescript
{
  email: string; // Valid email format
  password: string; // Min 8 chars, uppercase, lowercase, number
  nickname: string; // 2-50 characters
}
```

### LoginDto

```typescript
{
  email: string;
  password: string;
}
```

## User Entity

```typescript
{
  id: UUID; // Primary key
  email: string; // Unique
  password: string; // bcrypt hashed
  nickname: string;
  role: 'user' | 'admin'; // Default: 'user'
  isActive: boolean; // Default: true
  passwordResetToken: string | null; // For password reset flow
  passwordResetExpires: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
```

## Email Templates

The following email templates are available:

- **welcome.hbs** - Sent after successful registration
- **reset-password.hbs** - Sent when admin initiates password reset
- **account-banned.hbs** - Sent when admin bans a user

### Development Email Testing

In development mode, emails are sent to MailHog (included in docker-compose.dev.yml).
View emails at: `http://localhost:8025`
