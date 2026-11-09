# Klyro

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white)

**A modern, production-grade personal finance and ledger tracking monorepo application.**

[Architecture](#architecture) •
[Features](#features) •
[Tech Stack](#tech-stack) •
[Getting Started](#getting-started) •
[API Reference](#api-reference) •
[Project Structure](#project-structure)

</div>

---

## Overview

**Klyro** is a full-stack personal finance and ledger tracking system designed for scale, reliability, and security. Built as a `pnpm` monorepo, it pairs a decoupled **Angular** single-page frontend with a layered **Express 5** REST API backed by **Prisma 7** and **PostgreSQL**.

---

## Features

- **Robust Authentication & Session Management**:
  - Dual-identifier login supporting either `username` or `email` with `password`.
  - **Short-Lived Access Tokens (JWT)**: 15-minute stateless tokens delivered via JSON response for API authorization.
  - **Secure Refresh Tokens**: Cryptographically random 40-byte tokens stored as SHA-256 digests in the database and delivered in HTTP-only, SameSite secure cookies.
  - **Cryptographic Password Security**: Passwords salted and hashed with `crypto.scrypt` and verified with timing-safe buffers against timing attacks.
- **Financial Ledger Management**:
  - User-scoped multi-currency ledgers with opening balances.
  - Double-entry compliant credit and debit transaction recording with running balance audits.
- **Clean Architecture & Strict Separation of Concerns**:
  - Explicit boundaries: Routes $\rightarrow$ Middlewares $\rightarrow$ Controllers $\rightarrow$ Services $\rightarrow$ Repositories.
  - Transactional persistence guarantees (`$transaction`) for multi-table operations.
  - Centralized, type-safe environment configuration with runtime Zod schema parsing.
  - Comprehensive, centralized error handling preventing sensitive credential or stack trace leaks.

---

## Tech Stack

| Domain | Technology | Description |
| :--- | :--- | :--- |
| **Monorepo** | [pnpm Workspaces](https://pnpm.io/workspaces) | Fast, disk-efficient multi-package workspace management |
| **Backend API** | [Node.js](https://nodejs.org/) & [Express 5](https://expressjs.com/) | Modern ES-module based REST API framework |
| **Database & ORM**| [Prisma 7](https://www.prisma.io/) & [PostgreSQL](https://www.postgresql.org/) | Type-safe query engine with `@prisma/adapter-pg` driver adapter |
| **Authentication** | [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) & `node:crypto` | RFC 7519 HS256 tokens and crypto random token rotation |
| **Validation** | [Zod](https://zod.dev/) | Strict runtime input and configuration parsing |
| **Frontend Web** | [Angular 22](https://angular.dev/) | Standalone components, RxJS, signals, and SCSS styling |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | Strict type checking throughout the stack |

---

## Project Structure

```text
klyro/
├── apps/
│   ├── api/                           # Backend Express REST API
│   │   ├── prisma/
│   │   │   └── schema.prisma          # Prisma schema (User, RefreshToken, Ledger, Transaction)
│   │   ├── src/
│   │   │   ├── config/                # Validated environment configuration (env.ts)
│   │   │   ├── errors/                # Domain error classes (AppError, ConflictError, etc.)
│   │   │   ├── lib/                   # Infrastructure clients (Prisma Client)
│   │   │   ├── middlewares/           # Cross-cutting middlewares (validation, errorHandler)
│   │   │   ├── modules/
│   │   │   │   └── auth/              # Auth module (routes, controllers, services, repositories)
│   │   │   ├── utils/                 # Pure utilities (jwt.ts, password.ts, token.ts)
│   │   │   ├── app.ts                 # Express application configuration & middleware stack
│   │   │   └── server.ts              # HTTP server entry point
│   │   └── package.json
│   │
│   └── web/                           # Frontend Angular 22 Single-Page Application
│       ├── src/
│       │   ├── app/                   # Root components, routing, and configurations
│       │   └── main.ts                # Angular application bootstrapping
│       └── package.json
│
├── packages/                          # Shared monorepo packages and libraries
├── pnpm-workspace.yaml                # Workspace definitions
├── package.json                       # Root monorepo scripts
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js**: `v20.x` or later (tested on `v24.x`)
- **pnpm**: `v9.x` or later
- **PostgreSQL**: A running PostgreSQL instance

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/klyro.git
cd klyro
```

### 2. Install Dependencies

Install all dependencies across the workspace:

```bash
pnpm install
```

### 3. Configure Environment Variables

Create an `.env` file in `apps/api/`:

```bash
cp apps/api/.env.example apps/api/.env # or create manually
```

Populate `apps/api/.env` with your values:

```env
# Application
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:4200

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/klyro?schema=public"

# Authentication
JWT_ACCESS_SECRET="your-super-secret-jwt-access-key-min-32-chars-long"
```

### 4. Database Setup

Generate the Prisma client and apply migrations:

```bash
# Generate Prisma Client
pnpm --filter @klyro/api exec prisma generate --config prisma7.config.ts

# Run migrations (or push schema in development)
pnpm --filter @klyro/api exec prisma db push --config prisma7.config.ts
```

### 5. Run the Application

Start both the backend API and frontend client concurrently:

```bash
# Run both API and Web concurrently
pnpm dev
```

Alternatively, run services individually:

```bash
# Run only Backend API (port 3000)
pnpm dev:api

# Run only Frontend Web (port 4200)
pnpm dev:web
```

- **Frontend**: [http://localhost:4200](http://localhost:4200)
- **API Health Check**: [http://localhost:3000/api/health](http://localhost:3000/api/health)

---

## API Reference

### Health Check

```http
GET /api/health
```

**Response (200 OK)**
```json
{
  "success": true,
  "message": "Klyro API is running"
}
```

---

### Authentication

#### 1. Register User

```http
POST /api/auth/register
Content-Type: application/json
```

**Request Body**
```json
{
  "username": "alex_doe",
  "email": "alex@example.com",
  "password": "Password123!"
}
```

**Response (201 Created)**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "c1f7a0b2-8f92-48a1-b3b2-65a88a09cf93",
      "username": "alex_doe",
      "email": "alex@example.com",
      "createdAt": "2026-11-09T08:00:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresIn": 900
  }
}
```
*Note: A secure, HTTP-only cookie named `refreshToken` is set with an expiration of 7 days.*

---

#### 2. User Login

```http
POST /api/auth/login
Content-Type: application/json
```

**Request Body (via Username or Email)**
```json
{
  "identifier": "alex_doe",
  "password": "Password123!"
}
```
*(Also accepts `{ "email": "alex@example.com", "password": "..." }` or `{ "username": "alex_doe", "password": "..." }`)*

**Response (200 OK)**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "c1f7a0b2-8f92-48a1-b3b2-65a88a09cf93",
      "username": "alex_doe",
      "email": "alex@example.com",
      "createdAt": "2026-11-09T08:00:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresIn": 900
  }
}
```

---

## Security Model

- **Defense-in-Depth Token Architecture**:
  - The access token is a 15-minute stateless JWT carrying minimal claims (`sub`, `username`, `email`) verified via HMAC-SHA256 (`HS256`).
  - The refresh token is an unguessable 40-byte random string stored as an irreversible SHA-256 digest in the database. Even in the event of a database compromise, active refresh tokens cannot be decoded or stolen.
- **Strict Cookie Flags**:
  - `httpOnly: true`: Completely mitigates JavaScript access and XSS token exfiltration.
  - `secure: true`: Enforced automatically in production over TLS/HTTPS.
  - `sameSite: strict`: Blocks cross-site request forgery (CSRF) vectors.
- **OWASP-Compliant Password Storage**:
  - Passwords are salted using 16 bytes of cryptographically random salt and derived with `crypto.scrypt` (64-byte key length).
  - Validations use `crypto.timingSafeEqual` to prevent side-channel timing analysis.
- **Network Protections**:
  - Headers hardened using [Helmet](https://helmetjs.github.io/).
  - CORS strictly bound to `FRONTEND_URL` with explicit credential passing.

---

## Monorepo Scripts Reference

All commands can be run directly from the workspace root:

| Command | Action |
| :--- | :--- |
| `pnpm dev` | Starts both the API and Web apps in parallel |
| `pnpm dev:api` | Starts the Express API in watch mode via `tsx` |
| `pnpm dev:web` | Starts the Angular development server |
| `pnpm --filter @klyro/api build` | Type-checks and compiles the backend API TypeScript project |
| `pnpm --filter web build` | Compiles the production build for the Angular web client |
| `pnpm --filter web test` | Runs the Angular client unit test suite via Vitest |

---

## License

This project is licensed under the [MIT License](LICENSE).
