# Curo Frontend — Project Context

## Project Overview
Full-stack secrets management app (like Doppler). Frontend is React + TypeScript + Vite, backend is Express + MongoDB. This skill covers the frontend data layer, auth, invite flows, role-based access, and backend integration patterns.

## Tech Stack
- **Runtime**: Node.js (pnpm, never npm)
- **Framework**: React 19 + Vite + TypeScript (strict mode)
- **State**: Redux Toolkit + RTK Query
- **HTTP**: Axios with httpOnly cookie-based auth
- **UI**: Custom Tailwind-like design system (no Tailwind package — all inline classes with CSS variables)
- **Forms**: Formik + Zod validation
- **Routing**: React Router v6

## Build & Lint
```bash
pnpm build    # tsc -b && vite build
pnpm lint     # eslint + prettier
```

## Environment
```
VITE_API_URL=http://localhost:5000/api/v1   (never hardcode)
```

## Backend API Pattern
All responses follow: `{ success: boolean, data: T, msg: string }`
The axios base query (`src/api/axiosBaseQuery.ts`) unwraps `result.data.data` so RTK Query receives `T` directly.
Error handling: `err?.data?.msg` for user-facing messages.

## Architecture

### File Layout
```
src/
  api/
    axiosClient.ts       — axios instance + 401 refresh interceptor
    axiosBaseQuery.ts    — RTK Query baseQuery wrapper
  app/
    store.ts             — configureStore + typed hooks (useAppSelector, useAppDispatch)
  store/
    baseApi.ts           — single createApi with tagTypes
    slices/authSlice.ts  — setCredentials / clearCredentials
    endpoints/           — one file per domain (auth, team, member, project, secret, environment)
    index.ts             — barrel export
  hooks/
    useActiveTeam.ts     — sessionStorage-backed active team
    useTeamRole.ts       — role-based permission checks
  contexts/
    ActiveTeamContext.ts — provides activeTeamId to child routes
  pages/
    auth/                — Login, Register, OAuthCallback, etc.
    dashboard/           — Teams, Projects, Overview, Account, Settings, AuditLogs, Integrations
  components/
    dashboard/           — reusable UI components
```

### Redux Store (`src/app/store.ts`)
- `api` (RTK Query middleware, auto-generated)
- `auth` (authSlice — `{ user: User | null, isAuthenticated: boolean }`)

### RTK Query (`src/store/baseApi.ts`)
- Single `createApi` with `tagTypes`: User, Team, TeamMember, TeamInvite, Project, Secret, Environment, Version
- Endpoints injected via `.injectEndpoints()` in domain files
- Cache invalidation via `providesTags` / `invalidatesTags` — IDs must match byte-for-byte for tags to work
- Global refetch: `refetchOnMountOrArgChange: true`, `refetchOnFocus: true`, `refetchOnReconnect: true` — ensures fresh data on page visits

## Auth Flow
- **Tokens stored exclusively in httpOnly cookies** set by backend. Frontend never touches localStorage/sessionStorage for tokens.
- **Axios**: `withCredentials: true` — browser handles cookies automatically.
- **Register**: `POST /auth/register` — returns user or triggers OTP flow (verificationToken).
- **Login**: `POST /auth/login` — sets httpOnly cookies.
- **OAuth**: Google/GitHub redirect to `{BACKEND_URL}/auth/{provider}`, callback redirects to `{FRONTEND_URL}/auth/callback`.
- **Session check**: `GET /auth/me` (via `useVerifySessionQuery`) — called by `ProtectedRoute` in App.tsx on mount; dispatches `setCredentials` on success, redirects to `/login` on failure.
- **Logout**: `POST /auth/logout` — clears cookies + `clearCredentials`.
- **401 interceptor** (`src/api/axiosClient.ts`): On 401, attempts `POST /auth/refresh` (browser sends `refreshtoken` cookie automatically). If refresh succeeds, retries original request. If refresh fails, dispatches `clearCredentials` and redirects to `/login`. Concurrent 401s are queued and replayed after refresh.

### Route Guards
- **`ProtectedRoute`**: wraps `/dashboard/*` — calls `useVerifySessionQuery`, shows spinner while loading, dispatches credentials, redirects to login on error.
- **`PublicRoute`**: wraps `/login`, `/register`, etc. — redirects to `/dashboard` if already authenticated.

## Invite / Join Team Flow
The full invite-to-join flow is:

1. **Admin invites** via the team detail view → `POST /teams/get/{teamId}/invites` with `{ email, role }`.
   - Or during **team creation** (`POST /teams/create`) with `{ emails: [{ email, role }] }` — all emails get a `TeamInvite` record + email sent (registered or not).
2. **Backend** creates a `TeamInvite` document with a random 32-byte hex token, stores `{ teamId, email, role, token, expiresAt }`, sends email with link to `{FRONTEND_URL}/invite/accept/{token}`.
3. **User clicks link** → `InviteAcceptPage.tsx` stores `token` in `sessionStorage.setItem("inviteToken", token)`, then redirects:
   - Unauthenticated → `/register`
   - Authenticated → `/dashboard`
4. **User completes auth** (register, login, or OAuth) → always navigates to `/dashboard`. The `inviteToken` stays in sessionStorage throughout.
5. **`DashboardLayout`** (`DashboardLayout.tsx:74-102`) on mount checks `sessionStorage.getItem("inviteToken")`:
   - If found, calls `getInviteDetails(token)` (lazy query to `GET /teams/invite/{token}`)
   - On success → shows `InviteJoinModal` with team name, member count, role
   - On error (invalid/expired) → clears token, shows error toast
6. **User clicks "Join team"** → calls `acceptInviteExplicit({ token })` (`POST /teams/invite/accept`), clears token, shows success toast "You have successfully joined the team."
7. **User clicks "Not now"** → clears token, closes modal.

### Key Files
- `src/pages/InviteAcceptPage.tsx` — stores token, redirects
- `src/pages/dashboard/DashboardLayout.tsx` — checks token, shows modal, handles accept/decline
- `src/components/dashboard/InviteJoinModal.tsx` — the join modal UI
- `src/store/endpoints/memberEndpoints.ts` — getInviteDetails, acceptInviteExplicit endpoints

### Team creation with members
When creating a team with member emails (`POST /teams/check-emails` first), the frontend calls `checkEmails` API to separate registered from unregistered users. Only unregistered users trigger the confirmation modal. All users (registered or unregistered) receive an invitation email with a link.

## Role-Based Access Control

### `useTeamRole(teamId)` hook (`src/hooks/useTeamRole.ts`)
Returns permissions for the current user within a specific team. Used by `Teams.tsx` for team-level actions.

| Permission | Roles | What it controls |
|---|---|---|
| `canCreate` | owner, admin, developer | Create/Edit buttons |
| `canEdit` | owner, admin | Edit team settings |
| `canDelete` | owner, admin | Delete team |
| `canManageMembers` | owner, admin | Invite/remove members, revoke invites |
| `canViewSecretValues` | owner, admin, developer | Reveal secret values |
| `canDeleteResource(resourceUserId)` | per-resource | owner/admin can delete any; developer only own |

### Per-resource delete check
`canDeleteResource(resourceUserId)`:
- **owner/admin**: delete any resource regardless of creator
- **developer**: can only delete resources they created
- **viewer**: cannot delete anything

### Where applied
- **Teams page** (`Teams.tsx`): Uses `canEdit`, `canDelete`, `canManageMembers` from `useTeamRole(teamId)`.
- **Projects page** (`Projects.tsx`): Permissions are computed from `selectedProject.role` returned by the backend API, NOT from `useTeamRole`. The project detail views use local variables:
  ```ts
  const projectRole = selectedProject?.role ?? (activeTeamId ? "viewer" : "owner");
  const canCreate = ["owner", "admin", "developer"].includes(projectRole);
  const canDeleteResource = (resourceUserId) => { ... };
  ```
  This ensures the role is authoritative from the backend and cannot be tampered with client-side.

### Backend enforcement
- **`validateProjectAccess`** (`validate.middleware.ts`): If `req.userId === project.userId`, sets `member = { role: "owner" }` and passes through. Otherwise finds team member by `teamId` in project's teams array.
- **`validateRole`**: If `member.role === "owner"`, allows all operations immediately. Otherwise checks against allowed roles list.
- **Route middleware** (`project.routes.ts`): `validateRole("owner", "admin", "developer")` for secret/environment CRUD.
- **Service level**: `deleteProjectSecret` and `deleteProjectEnvironment` accept `userId` + `role`. If `role === "developer"` and `resource.userId !== userId`, throws `FORBIDDEN` (403).
- **Backend returns role**: `getProjectById` includes `role` in response; `getAllProjects` computes role per project from ownership or team membership.

### Default role (no team context)
If `activeTeamId` is null (no team selected), defaults to `"owner"` so users have full control over their own projects.

## Backend Route Reference

### Auth (`/api/v1/auth`)
| Method | Path | Auth | Body/Params |
|---|---|---|---|
| POST | `/register` | No | `{ name, email, password }` |
| POST | `/login` | No | `{ email, password }` |
| POST | `/refresh` | No (cookie) | (empty, reads `refreshtoken` cookie) |
| POST | `/logout` | Yes | — |
| GET | `/me` | Yes | — |
| PUT | `/change-password` | Yes | `{ currentPassword, newPassword }` |
| POST | `/disconnect-oauth` | Yes | `{ provider }` |
| POST | `/verify-email/otp` | No | `{ otp }` |
| POST | `/verify-email/token/:token` | No | — |
| POST | `/resend-verification` | No | — |
| GET | `/google` | No | (redirect) |
| GET | `/github` | No | (redirect) |

### Teams (`/api/v1/teams`)
| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/all` | Yes | List user's teams (includes `projects` array) |
| GET | `/get/:teamId` | Yes | — |
| POST | `/check-emails` | Yes | `{ emails: string[] }` → returns `{ registered, unregistered }` |
| POST | `/create` | Yes | `{ name, slug, emails? }` — sends invite email to ALL emails |
| PUT | `/update/:teamId` | Yes | owner/admin only |
| DELETE | `/delete/:teamId` | Yes | owner only |
| GET | `/get/:teamId/members` | Yes | — |
| POST | `/get/:teamId/invites` | Yes | owner/admin only, `{ email, role? }` |
| DELETE | `/get/:teamId/invites/:inviteId` | Yes | Revoke invite |
| GET | `/invite/:token` | No | Get invite details |
| POST | `/invite/accept` | Yes | `{ token }` — accept invite explicitly |
| DELETE | `/get/:teamId/members/:memberId` | Yes | Remove member |

### Projects (`/api/v1/projects`)
| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/all` | Yes | Filters by user's team memberships |
| GET | `/get/:projectId` | Yes | — |
| POST | `/create` | Yes | `{ projectName, description, projectLink?, teamId? }` — sets `teams` array + pushes to team's `projects` |
| PUT | `/update/:projectId` | Yes | owner/admin/developer |
| DELETE | `/delete/:projectId` | Yes | owner/admin only |
| GET | `/:projectId/secrets` | Yes | All team members can read |
| POST | `/:projectId/secrets` | Yes | owner/admin/developer |
| PUT | `/:projectId/secrets/:secretId` | Yes | owner/admin/developer |
| DELETE | `/:projectId/secrets/:secretId` | Yes | owner/admin/developer (developer only if they created it) |
| GET | `/:projectId/environments` | Yes | All team members can read |
| POST | `/:projectId/environments` | Yes | owner/admin/developer |
| PUT | `/:projectId/environments/:envId` | Yes | owner/admin/developer |
| DELETE | `/:projectId/environments/:envId` | Yes | owner/admin/developer (developer only if they created it) |
| POST | `/:projectId/teams` | Yes | owner/admin — `{ teamId }`, adds team to project's teams array |
| DELETE | `/:projectId/teams/:teamId` | Yes | owner/admin — removes team from project |

### Team assign/remove pattern (frontend)
In `projectEndpoints.ts`, two mutations handle team assignment:
- `addTeamToProject: builder.mutation({ query: ({ projectId, ...body }) => ({ url: `/${projectId}/teams`, method: "POST", body }) })`
- `removeTeamFromProject: builder.mutation({ query: ({ projectId, teamId }) => ({ url: `/${projectId}/teams/${teamId}`, method: "DELETE" }) })`
Both invalidate `{ type: "Project", id: "LIST" }` and `{ type: "Project", id: arg.projectId }`.

In `Projects.tsx`, the Teams detail tab maps over all teams and calls the appropriate mutation on button click, with success/error toasts.

## Coding Conventions

### General
- **No code comments**. Code should be self-documenting.
- **No emojis** in code or UI (unless user explicitly requests).
- **No `refetch()`** — use cache invalidation via tags.
- **No `navigate(0)`** — use proper React state/effect patterns.
- **No hardcoded URLs** — always read `import.meta.env.VITE_API_URL` or use relative paths.

### TypeScript (strict mode)
- `verbatimModuleSyntax` — use `import type` for type-only imports.
- `noUnusedLocals`, `noUnusedParameters` — no unused variables allowed.
- `erasableSyntaxOnly` — no enums, no namespaces.

### State Management
- **RTK Query** for all server state. No manual fetch/axios calls in components (except OAuth callback).
- **Auth state** in Redux (`authSlice`) for `user` and `isAuthenticated`.
- **Active team** in `sessionStorage` via `useActiveTeam` hook.
- **Toast notifications**: `useToast()` returns `{ toast, success, error, warning, info, dismiss }`. Each mutation/query error should show a toast.

### API Client (`src/api/axiosClient.ts`)
- `withCredentials: true` for cookie-based auth.
- 401 interceptor: attempt refresh → retry → fail (clear + redirect).
- Dynamic `import()` of store to avoid circular dependency.

### Form Patterns
- Formik forms with `useFormik()`.
- Zod schemas for validation, wrapped with `validateZod()` helper.
- Submit calls mutation → `.unwrap()` → show toast → close modal/reset form.
- Catch block: `showError(err?.data?.msg || "Fallback message")`.
- **Settings forms**: Use `enableReinitialize: true` with `initialValues` pulled directly from the selected entity (`selectedTeam`, `selectedProject`). This auto-fills fields when navigating to the settings tab, without needing manual `setValues()` calls.
- **Create vs Edit schemas**: When a form has different validation rules for create vs edit (e.g., secret name/key required on create but optional on edit), use separate Zod schemas. Switch dynamically in `useFormik`:
  ```ts
  validate: (values) => validateZod(editingSecret ? editSecretSchema : createSecretSchema)(values),
  ```
- **Conditional `required` prop**: For fields that are required only on create but optional on edit, set `required={!editingSecret}` on the FormField/FormInput.

### Modals
- Use `Modal` component for forms.
- Use `AlertModal` for confirmations (delete, revoke, etc.).
- Pattern: `showModal` state → modal JSX → onClose resets form → submit handler calls mutation.

### Response Format
Always access error messages via `err?.data?.msg`. The axios base query already unwraps the success path.

### Toast API
```tsx
const { success, error } = useToast();
success("Title", "Optional description");
error("Title", "Error details");
```

## Key Decisions
- **Circular dependency**: Avoided by using dynamic `import()` inside axiosClient 401 interceptor for store + clearCredentials.
- **Secrets/Environments scoped to projects**: Path format is `/:projectId/secrets` and `/:projectId/environments`. No standalone `/secrets` or `/env` routes are used by the frontend.
- **Version endpoints**: Not implemented because no version routes exist in backend.
- **Email invite tokens**: Plain 32-byte hex string stored in DB with teamId, email, expiresAt.
- **Invite token in sessionStorage**: Survives page navigations during auth flow. Cleared after accept or decline.
- **Role defaults to viewer**: If user not found in team members, all permissions default to false (view-only).
- **New Project button always visible**: Not gated by role — all authenticated users can see it.
- **Team projects tab**: Filters `useGetProjectsQuery()` by `teamId` to show only projects assigned to the selected team.
- **Create project links to team**: `createProject` passes `activeTeamId` to `teamId` field. Backend stores it in project's `teams` array AND pushes project ID to team's `projects` array.
- **Account page**: Wired via `useVerifySessionQuery()` for user data, `useChangePasswordMutation()` for password changes, `useDisconnectOAuthMutation()` for OAuth unlinking.
- **OAuthCallback**: Handles `?error=email_conflict&email=...` with a modal showing the conflicting email.
- **Secret key privacy**: When editing a secret, `openEditSecret` sets `secKey` to `""` so the current value is never exposed in the form. The edit schema makes `secKey` optional, and the backend only re-encrypts if a new value is provided.

## Computed Counts in Backend Responses
The backend computes aggregate counts using `countDocuments` in parallel with `Promise.all`:
- **Team cards** (`team.service.ts`): `memberCount = TeamMemberModel.countDocuments({ teamId })`
- **Project cards** (`project.service.ts`): `secretCount = SecretsModel.countDocuments({ projectId })`, `environmentCount = EnvironmentModel.countDocuments({ projectId })`, `teamCount = project.teams.length`
- These are computed in `getAllTeams` / `getAllProjects` and returned as part of the response. The frontend displays them directly from the API data.

## Active Team Context
`DashboardLayout` sets the active team via `ActiveTeamContext.Provider`. On mount, if the user has teams but no active team is set, the first team becomes active. Child routes access it via `useActiveTeamContext()`.

## Pagination / Filtering
No server-side pagination implemented yet. All filtering is client-side via search input state + filter + `useMemo`.
