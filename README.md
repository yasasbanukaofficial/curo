
```
 ██████╗██╗   ██╗██████╗  ██████╗
██╔════╝██║   ██║██╔══██╗██╔═══██╗
██║     ██║   ██║██████╔╝██║   ██║
██║     ██║   ██║██╔══██╗██║   ██║
╚██████╗╚██████╔╝██║  ██║╚██████╔╝
 ╚═════╝ ╚═════╝ ╚═╝  ╚═╝ ╚═════╝
```

# Curo

**Centralized secrets management for teams.**

Curo is a full-stack platform for securely storing, managing, and synchronizing environment variables and secrets (API keys, database URLs, credentials, etc.) across projects, environments, and team members. It replaces insecure workflows like sharing secrets via email, Slack, or spreadsheets with a single source of truth backed by role-based access control and a full audit trail.

---

## Architecture

Curo is a monorepo with three packages:

### Backend — `backend/`

Express 5 REST API + MongoDB (Mongoose 9). Handles authentication (local + Google/GitHub OAuth), project and environment management, encrypted secret storage, team management with role-based access (owner, admin, developer, viewer), and an activity audit log.

- **Port:** 5000 (dev), 8000 (Docker)
- **Auth:** JWT access + refresh tokens, bcryptjs password hashing
- **Email:** Resend for transactional emails
- **Tests:** Vitest + Supertest

### Frontend — `frontend/`

React 19 SPA built with Vite 8, Tailwind CSS v4, Redux Toolkit / RTK Query, and React Router 7. Features a landing page with animations (GSAP, Framer Motion, Three.js), a full dashboard for managing projects/secrets/teams, and OAuth flow support.

- **Port:** 5173 (dev), 80 (Docker)
- **UI:** Tailwind CSS v4, Lucide icons, Driver.js onboarding tours

### CLI — `packages/`

A terminal-based CLI (Ink 7 / React) published to npm as `@yasasbanukaofficial/curo-cli`. Authenticates with the Curo API and lets developers pull project secrets directly into a local `.env` file without ever leaving the terminal.

- **Install:** `npm install -g @yasasbanukaofficial/curo-cli`
- **Run:** `curo`

---

## Tech Stack

| Layer       | Technology                                                              |
| ----------- | ----------------------------------------------------------------------- |
| Backend     | Node.js, Express 5, TypeScript, Mongoose 9, Zod 4                       |
| Frontend    | React 19, Vite 8, Tailwind CSS v4, Redux Toolkit, React Router 7       |
| CLI         | Ink 7, React 19, TypeScript, tsup                                       |
| Database    | MongoDB                                                                 |
| Auth        | JWT, bcryptjs, Google OAuth, GitHub OAuth                              |
| Infra       | Docker, Docker Compose, Azure Container Apps, GitHub Actions            |

---

## Getting Started

### Prerequisites

- Node.js >= 20
- pnpm (for backend & frontend)
- MongoDB instance (local or remote)
- A `.env` file in `backend/` with the required configuration (see `backend/src/config/env.ts`)

### Setup

```bash
# Clone the repository
git clone https://github.com/curo-dev/curo.git
cd curo

# Install backend dependencies
cd backend
pnpm install

# Install frontend dependencies
cd ../frontend
pnpm install

# Install CLI dependencies
cd ../packages
npm install
```

### Run in development

```bash
# Terminal 1 — Backend
cd backend
pnpm dev

# Terminal 2 — Frontend
cd frontend
pnpm dev
```

The frontend dev server proxies API requests to the backend. Open `http://localhost:5173` in your browser.

### Run with Docker

```bash
docker compose up
```

This starts the API (port 8000) and web (port 80) services with hot-reload enabled.

---

## Project Structure

```
curo/
├── backend/           Express REST API
│   ├── src/
│   │   ├── controller/   Route handlers
│   │   ├── models/       Mongoose schemas
│   │   ├── routes/       Express routers
│   │   ├── services/     Business logic
│   │   ├── middlewares/   Auth & validation
│   │   ├── validators/   Zod request schemas
│   │   └── types/        TypeScript interfaces
│   └── tests/            Vitest test suite
├── frontend/          React web dashboard
│   ├── src/
│   │   ├── components/   UI components
│   │   ├── pages/        Page components
│   │   ├── store/        Redux state & API endpoints
│   │   ├── hooks/        Custom React hooks
│   │   └── types/        TypeScript interfaces
│   └── public/           Static assets
├── packages/          CLI tool (Ink/React)
│   └── src/
│       ├── screens/      Full-screen views
│       ├── components/   Terminal UI components
│       ├── api/          API client
│       └── store/        React context state
└── compose.yaml       Docker Compose configuration
```

---

## Testing

```bash
cd backend
pnpm test
```

The backend test suite uses Vitest with Supertest for HTTP assertions. Tests mock authentication and database models.

---

## Deployment

### CI/CD

Two GitHub Actions workflows are configured:

- **Azure Pipeline** — Builds Docker images, pushes to Azure Container Registry (`curoacr.azurecr.io`), and deploys to Azure Container Apps.
- **Publish Package** — Publishes `@yasasbanukaofficial/curo-cli` to npm on pushes to `main` that touch `packages/`.

### Docker

- Backend Dockerfile: multi-stage build (node:22-alpine), exposed on port 8000
- Frontend Dockerfile: built with node:22, served with nginx:alpine on port 80

---

## License

MIT
