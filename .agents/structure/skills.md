---
name: structure
description: >
  Documents the full project directory layout for both backend and
  frontend, explaining the purpose of each directory and file. Includes
  the frontend route/page hierarchy and component directory conventions.
  Referencing "structure" in a prompt signals the agent to consult or
  explain this document for project organization decisions.
---

# Project Structure

## Backend (`backend/src/`)

```
backend/src/
  index.ts                    # Express app entry point — mounts all routers
  config/
    env.ts                    # Environment variables, typed exports
  routes/
    index.ts                  # Barrel — re-exports each router as {Domain}Router
    auth.routes.ts            # Route definitions for each domain
    project.routes.ts
    secret.routes.ts
    environment.routes.ts
    version.routes.ts
    audit.routes.ts
    team.routes.ts
  middlewares/
    index.ts                  # Barrel — wildcard re-export
    auth.middleware.ts        # JWT authentication — attach userId to req
    validate.middleware.ts    # Zod schema validation middleware factory
  controller/
    index.ts                  # Barrel — wildcard re-export
    auth.controller.ts        # Request handlers, one per route
    project.controller.ts
    secret.controller.ts
    environment.controller.ts
    version.controller.ts
    audit.controller.ts
    team.controller.ts
  services/
    index.ts                  # Barrel — wildcard re-export
    auth.service.ts           # Business logic, DB calls via models
    project.service.ts
    secret.service.ts
    environment.service.ts
    version.service.ts
    audit.service.ts
    team.service.ts
    axios.ts                  # Shared Axios instance for external API calls
  models/
    index.ts                  # Barrel — wildcard re-export
    user.model.ts             # Mongoose schemas
    project.model.ts
    secrets.model.ts
    environment.model.ts
    version.model.ts
    audit.model.ts
    team.model.ts
    teamMember.model.ts
    teamInvite.model.ts
  types/
    index.ts                  # Barrel — wildcard re-export
    user.ts                   # TypeScript interfaces (I-prefixed)
    project.ts
    secret.ts
    environment.ts
    version.ts
    audit.ts
    team.ts
    teamMember.ts
    teamInvite.ts
  validators/
    index.ts                  # Barrel — wildcard re-export
    auth.validators.ts        # Zod schemas for request validation
    team.validators.ts
  integrations/
    index.ts                  # Barrel — wildcard re-export
    google.integration.ts     # OAuth clients
    github.integration.ts
  util/
    index.ts                  # Barrel — wildcard re-export
    apiResponse.ts            # sendResponse, setCookie, redirect helpers
    token.ts                  # JWT generation & verification
    hash.ts                   # bcrypt password hashing
    encrypt.ts                # AES-256-CBC symmetric encryption
```

### How it flows

```
Route (auth.routes.ts)
  → Middleware (auth.middleware.ts / validate.middleware.ts)
  → Controller (auth.controller.ts) — parses request, calls service
  → Service (auth.service.ts) — business logic, DB queries
  → Model (user.model.ts) — Mongoose document
  ← sends sendResponse(res, { success, status, data, msg })
```

### Adding a new domain

1. `types/newDomain.ts` — interface
2. `models/newDomain.model.ts` — Mongoose schema + model
3. `services/newDomain.service.ts` — business logic (named object export)
4. `controller/newDomain.controller.ts` — request handlers (named exports)
5. `routes/newDomain.routes.ts` — route definitions (default export Router)
6. `validators/newDomain.validators.ts` — Zod schemas (optional)
7. Update all 6 barrel `index.ts` files + `routes/index.ts` (named export)
8. Mount router in `index.ts`: `app.use(\`/api/${API_VER}/newdomain\`, NewDomainRouter)`

### Naming conventions

| Layer | File | Export |
|-------|------|--------|
| Route | `{domain}.routes.ts` | `export default router` |
| Controller | `{domain}.controller.ts` | `export const actionName` |
| Service | `{domain}.service.ts` | `export const domainService = { ... }` |
| Model | `{domain}.model.ts` | Schema prefixed `_`, Model suffixed `Model` |
| Type | `{domain}.ts` | Interface prefixed `I` |
| Validator | `{domain}.validators.ts` | `export const schemaName` |

---

## Frontend (`frontend/src/`)

```
frontend/src/
  main.tsx                    # React entry — wraps app in providers
  App.tsx                     # Root component, renders <AppRoutes />
  index.css                   # Tailwind imports, custom keyframes
  routes/
    index.tsx                 # All route definitions with React Router
  pages/
    HomePage.tsx              # Landing page
    PricingPage.tsx           # Pricing page
    auth/
      LoginPage.tsx           # Auth pages grouped by feature
      RegisterPage.tsx
      ForgotPasswordPage.tsx
    dashboard/
      DashboardLayout.tsx     # Sidebar + TopNav + <Outlet />
      Overview.tsx            # Dashboard pages
      Projects.tsx
      Secrets.tsx
      Environments.tsx
      Integrations.tsx
      AuditLogs.tsx
      Teams.tsx
      Settings.tsx
      Account.tsx
  components/
    ui/                       # Generic reusable UI components
      Button.tsx, Card.tsx, Icons.tsx, AuthField.tsx, ...
    landing/                  # Landing page components
      Navbar.tsx, Hero.tsx, Footer.tsx, Corner.tsx, ...
    dashboard/                # Dashboard-specific components
      Sidebar.tsx, TopNav.tsx, MobileNav.tsx, DashboardCard.tsx, ...
      Modal.tsx, FormField.tsx, FormInput.tsx, FormSelect.tsx, ...
      Toast.tsx, AlertModal.tsx, Badges.tsx, FilterTabs.tsx, ...
      CreateProjectModal.tsx, SettingsModal.tsx, StatCard.tsx, ...
    animations/               # Scroll/GSAP animation components
      AnimationSection.tsx, SmoothScroll.tsx, StaggerContainer.tsx
    audit/, members/, secrets/, layout/  # Feature-specific components
  contexts/
    ThemeContext.tsx           # React context providers
  hooks/                      # Custom React hooks
  lib/
    api.ts                    # API client / fetch helpers
    auth.ts                   # Auth API stubs
  types/
    auth.ts                   # Shared TypeScript types
    settings.ts
```

### How to organize

- **Pages** go in `pages/` grouped by feature/domain in subdirectories
- **Components** go in `components/{feature}/` — shared reusable ones in `components/ui/`
- **Routes** all live in `routes/index.tsx` — keep it as a single file unless it grows very large
- **Types** that are shared between pages/components go in `types/`

### Scaling guidelines

- When a page becomes complex, extract its sub-components into `components/{feature}/` (e.g. a Teams page's modals → `components/teams/`)
- When `routes/index.tsx` exceeds ~50 lines, split by area into `routes/auth.tsx`, `routes/dashboard.tsx` etc. and re-export
- When a domain grows large enough for its own API lib file, add `lib/{domain}.ts` (e.g. `lib/teams.ts`)
- Keep contexts focused — one context per concern in `contexts/`
- Avoid deeply nested component directories — max 2 levels deep from `components/`
