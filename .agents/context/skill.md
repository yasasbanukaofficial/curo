# Curo Frontend — Project Context

## Project Overview
Full-stack secrets management app (like Doppler). Frontend is React + TypeScript + Vite, backend is Express + MongoDB. This skill covers the frontend data layer, auth, invite flows, role-based access, and backend integration patterns.

## Tech Stack
- **Runtime**: Node.js (pnpm, never npm)
- **Framework**: React 19 + Vite + TypeScript (strict mode)
- **State**: Redux Toolkit + RTK Query
- **HTTP**: Axios with httpOnly cookie-based auth
- **UI**: Tailwind CSS v4 (Vite plugin, @import "tailwindcss" in CSS) with custom theme variables (--color-accent: #FF3333)
- **Forms**: Formik + Zod validation
- **Routing**: React Router v6

## Build & Lint
```bash
pnpm build    # tsc -b && vite build
pnpm lint     # eslint + prettier
```

## Theme System (Dark/Light)
- **localStorage key**: `"curo-theme"` — stores `"light"` or `"dark"` (no value = use system preference)
- **System preference fallback**: `window.matchMedia("(prefers-color-scheme: dark)")` — used when no localStorage value exists
- **Applied via**: `document.documentElement.classList.toggle("dark", theme === "dark")` — the `dark` class on `<html>` enables Tailwind `dark:` variants everywhere
- **Three independent initializers** (all read/write same localStorage key + apply `dark` class):
  - `Navbar.tsx` — landing page (`/`)
  - `AuthFormLayout.tsx` — auth pages (`/login`, `/register`, etc.)
  - `DashboardLayout.tsx` — dashboard pages (`/dashboard/*`)
- **Toggle buttons**: Landing page Navbar (desktop + mobile menu), auth pages (floating top-right button), dashboard Settings modal
- **Theme-aware class pattern**: `text-black dark:text-white`, `bg-black/[0.04] dark:bg-white/[0.04]`, `text-black/50 dark:text-white/50`, `border-black/[0.04] dark:border-white/[0.08]`

## Environment

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
    endpoints/           — one file per domain (auth, team, member, project, secret, environment, overview)
    index.ts             — barrel export
  hooks/
    useActiveTeam.ts     — sessionStorage-backed active team
    useTeamRole.ts       — role-based permission checks
  contexts/
    ActiveTeamContext.ts — provides activeTeamId to child routes
  pages/
    auth/                — Login, Register, OAuthCallback, etc.
    dashboard/           — Teams, Projects, Overview, Account, Settings, Integrations
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
- Cache is NOT automatically cleared on login/logout by RTK Query alone. Must manually call `dispatch(baseApi.util.resetApiState())` (see "Cache Leak Prevention" section below).

## Auth Flow
- **Tokens stored exclusively in httpOnly cookies** set by backend. Frontend never touches localStorage/sessionStorage for tokens.
- **Axios**: `withCredentials: true` — browser handles cookies automatically.
- **Register**: `POST /auth/register` — returns user or triggers OTP flow (verificationToken).
- **Login**: `POST /auth/login` — sets httpOnly cookies.
- **OAuth**: Google/GitHub redirect to `{BACKEND_URL}/auth/{provider}`, callback redirects to `{FRONTEND_URL}/auth/callback`.
- **Session check**: `GET /auth/me` (via `useVerifySessionQuery`) — called by `ProtectedRoute` in App.tsx on mount; dispatches `setCredentials` on success, redirects to `/login` on failure.
- **Logout**: `POST /auth/logout` — clears cookies + `clearCredentials`.
- **401 interceptor** (`src/api/axiosClient.ts`): On 401, attempts `POST /auth/refresh` (browser sends `refreshtoken` cookie automatically). If refresh succeeds, retries original request. If refresh fails, dispatches `clearCredentials` and redirects to `/login`. Concurrent 401s are queued and replayed after refresh.
- **Delete Account**: `DELETE /auth/account` — cascades deletion respecting **ownership** (not membership). Determines owned teams via `TeamModel.ownerId` (not `TeamMemberModel.role === "owner"`). Deletes owned teams + all their resources (projects, secrets, environments, members, invites). Deletes personal projects (userId match, no teamId). For non-owner memberships, only removes the TeamMember record. Never touches resources the user doesn't own. Frontend shows Danger Zone in SettingsModal.tsx Account tab with AlertModal confirmation, then calls `useDeleteAccountMutation`, dispatches `clearCredentials` + `baseApi.util.resetApiState()`, and navigates to `/login`.

### Cache Leak Prevention
RTK Query caches ALL previous users' data in the Redux store. When user B logs in on the same browser session, they briefly see user A's cached data before their own fetches complete. To prevent this:

- **On login success** (`LoginPage.tsx`): `dispatch(baseApi.util.resetApiState())` + `sessionStorage.removeItem("activeTeamId")`
- **On logout** (`Sidebar.tsx`): `dispatch(clearCredentials())` + `sessionStorage.removeItem("activeTeamId")` + `dispatch(baseApi.util.resetApiState())`
- **On delete account** (`SettingsModal.tsx`): Same pattern after `useDeleteAccountMutation().unwrap()` — `resetApiState()` + `clearCredentials()` + `navigate("/login", { replace: true })`. On error, shows toast without navigating.
- `baseApi` is re-exported from `src/store/index.ts` so components can import it from `"../../store"`.

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
5. **`DashboardLayout`** on mount checks `sessionStorage.getItem("inviteToken")`:
   - If found, calls `getInviteDetails(token)` (lazy query to `GET /teams/invite/{token}`)
   - On success → shows `InviteJoinModal` with team name, member count, role
   - On error (invalid/expired) → clears token, shows error toast
6. **User clicks "Join team"** → calls `acceptInviteExplicit({ token })` (`POST /teams/invite/accept`), clears token, shows success toast.
7. **User clicks "Not now"** → clears token, closes modal.

### Key Files
- `src/pages/InviteAcceptPage.tsx` — stores token, redirects
- `src/pages/dashboard/DashboardLayout.tsx` — checks token, shows modal, handles accept/decline
- `src/components/dashboard/InviteJoinModal.tsx` — the join modal UI
- `src/store/endpoints/memberEndpoints.ts` — getInviteDetails, acceptInviteExplicit endpoints

### Team creation with members
When creating a team with member emails (`POST /teams/check-emails` first), the frontend calls `checkEmails` API to separate registered from unregistered users. Only unregistered users trigger the confirmation modal. All users (registered or unregistered) receive an invitation email with a link.

## Password Reset Flow

There are two paths to trigger a password reset:

### 1. Settings (authenticated) — `sendPasswordResetLink`
Located in `SettingsModal.tsx` and `Account.tsx` under "Change Password" section. Uses `useSendPasswordResetLinkMutation`:
1. User clicks "Change Password" → sees confirmation panel with their email
2. Clicks "Send Reset Link" → calls `POST /auth/send-reset-link`
3. Backend generates `crypto.randomBytes(32).toString("hex")`, SHA-256 hashes it via `tokenHash.gen()`, stores `{ resetPasswordToken: hashedToken, resetPasswordExpires: Date.now() + 15min }` on the user document, sends email with raw token in the link
4. Shows success toast — "Check your email for the password reset link."

### 2. Forgot Password (unauthenticated) — `forgotPassword`
Implemented in `ForgotPasswordPage.tsx`:
1. User enters email on `/forgot-password`, submits form
2. Calls `POST /auth/forgot-password` with `{ email }`
3. Same token generation as above (hashed + stored + emailed)
4. Shows success state with "Check your email" message — user navigates to email client

### Email link → Reset Password page
The email contains a link to `{FRONTEND_URL}/reset-password?token={rawToken}`:
1. `ResetPasswordPage.tsx` reads `token` from URL search params
2. On load, calls `useVerifyResetTokenQuery(token)` → `GET /auth/reset-password/:token`
   - Backend hashes the incoming token and looks up a user with matching `resetPasswordToken` and `resetPasswordExpires > now()`
   - If valid (200) → shows password form; if invalid/expired (400) → shows error UI with "Request new link" button
3. User enters new password + confirm → calls `useResetPasswordMutation` → `POST /auth/reset-password`
4. On success → navigates to `/login`

### Token hashing
- Utility: `backend/src/util/hash.ts` — `tokenHash.gen()` uses `crypto.createHash("sha256").update(token).digest("hex")`
- The raw token is sent in the email link, never stored. The DB only contains the SHA-256 hash.
- This applies to both `sendPasswordResetLink`, `forgotPassword`, and `verifyResetToken`/`resetPassword` operations.

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
- **`validateProjectAccess`** (`validate.middleware.ts`): If `req.userId === project.userId`, sets `member = { role: "owner" }` and passes through. Otherwise finds team member by `project.teamId` (single field, not array).
- **`validateRole`**: If `member.role === "owner"`, allows all operations immediately. Otherwise checks against allowed roles list.
- **Route middleware** (`project.routes.ts`): `validateRole("owner", "admin", "developer")` for secret/environment CRUD.
- **Service level**: `deleteProjectSecret` and `deleteProjectEnvironment` accept `userId` + `role`. If `role === "developer"` and `resource.userId !== userId`, throws `FORBIDDEN` (403).
- **Backend returns role**: `getProjectById` includes `role` in response; `getAllProjects` computes role per project from ownership or team membership.

### Default role (no team context)
If `activeTeamId` is null (no team selected), defaults to `"owner"` so users have full control over their own projects.

## URL Structure & Routing

### Route Design (Frontend)
```
/login                                        → Login page
/register                                     → Register page
/forgot-password                              → Forgot password (email form)
/reset-password                               → Reset password (token in ?token= param, outside PublicRoute so authenticated users can access)
/invite/accept/:token                         → Invite acceptance
/auth/callback                                → OAuth callback hub
```
```
/dashboard                                    → redirect to /dashboard/overview
/dashboard/overview                           → Overview page (global stats)
/dashboard/projects                           → project list (all modes)
/dashboard/project/:projectId                 → project detail (overview tab)
/dashboard/project/:projectId/secrets         → project secrets tab
/dashboard/project/:projectId/environments    → project environments tab
/dashboard/teams                              → team list
/dashboard/teams/:teamId                      → team detail
/dashboard/teams/:teamId/settings             → team settings
/dashboard/integrations                       → integrations
/dashboard/account                            → account settings
/dashboard/settings                           → global settings
```

Project routes no longer include `:teamId` prefix. Changed from `/dashboard/teams/:teamId/projects/:projectId` to `/dashboard/project/:projectId`. This decouples project detail view from team context — the project's teamId is stored in the data model, not the URL.

### URL-based Navigation
- `projectId` is read from `useParams` — `useParams<{ projectId: string }>()` (no longer reads `teamId`)
- `teamId` is no longer part of project URLs. It's only in `/dashboard/teams/:teamId` routes.
- `/secrets` and `/environments` path suffixes set the active project tab
- Tab changes in project detail navigate to the corresponding sub-URL
- `DashboardLayout` syncs URL `teamId` to sessionStorage via `setTeam()`

### Invalid URL Guard
- If a URL contains a `projectId` not found in the user's projects → "Project not found" error page with "Back to Projects" button
- Guard condition: `!urlProjectId || (!projectByIdError && !!projectById)` — only shows not-found when data has loaded and project is confirmed missing

### Sidebar Navigation
- **Top section** — `ProjectSwitcher` is a single "Create new project" button (always visible). Clicking navigates to `/dashboard/projects` with `state: { openNewProject: true }` which opens the create modal. No project-switching dropdown.
- **Three nav items** always shown regardless of route:
  - **Overview** → `/dashboard`
  - **Teams** → `/dashboard/teams/{teamId}` (auto-selects first team or sessionStorage)
  - **Projects** → `/dashboard/projects`
- No conditional rendering based on team context
- No Secrets, Environments, Audit Logs, or Settings sidebar items

## Project Data Model — Personal vs Team Modes

Projects exist in two modes determined by the `teamId` field:

```
1. Personal project   → teamId is null, belongs to the user alone
2. Team project       → teamId is set, belongs to a specific team
```

### Backend Query Logic (`project.service.ts`)

`getAllProjects(userId, teamIds, teamId?)`:

**When `teamId` is provided (team filter):**
1. Validates the user is an active member of that team via `TeamMemberModel.findOne({ userId, teamId, status: "active" })`
2. If not a member, returns `[]`
3. If validated, returns `ProjectModel.find({ teamId })`

**When no `teamId` (fetch all):**
1. Finds all user's active team memberships → `teamIds`
2. Returns projects matching: `{ $or: [{ userId, teamId: null }, { userId, teamId: { $exists: false } }, { teamId: { $in: teamIds } }] }`
   - Personal projects: the user's own projects with no team assigned
   - Team projects: projects from any team the user is a member of

### Frontend Display (`Projects.tsx`)

When no team filter is active, projects are grouped into sections:

```
Personal Projects
  ┌─────────────────────┐
  │ Project A (solo)     │
  │ 3 secrets / 2 envs   │
  └─────────────────────┘

Team Projects — Acme Corp
  ┌─────────────────────┐
  │ curo-api             │
  │ 12 secrets / 4 envs  │
  └─────────────────────┘
  ┌─────────────────────┐
  │ mobile-backend       │
  │ 8 secrets / 2 envs   │
  └─────────────────────┘
```

- Personal projects: `teamId` is null/undefined
- Team projects: grouped by team name using `allTeams` lookup map

### Create Project (`createProject`)

The create dialog has a team selector dropdown:
```
Project Name    [              ]
Description     [              ]
Assign to team  [None (Personal) ▾]
                 ├── None (Personal)
                 ├── Acme Corp
                 └── Side Project
```

- Default is "None (Personal)" — never auto-assigns a team
- `handleCreateProject` sends `teamId: values.team || undefined` to the API
- Backend stores `{ teamId: teamId || null }` — never puts teamId in an array

### Team Assignment (single teamId)

A project has at most one team. Assigning a new team replaces the old one:

- **Set team**: `POST /projects/:projectId/teams` with `{ teamId }` → calls `setProjectTeam()` which:
  1. Sets `project.teamId = newTeamId`
  2. Pushes project to new team's `projects` array
  3. Pulls project from old team's `projects` array (if any)
- **Unset team**: `DELETE /projects/:projectId/teams` → calls `unsetProjectTeam()` which:
  1. Sets `project.teamId = null`
  2. Pulls project from team's `projects` array

### Delete Project

When deleting:
- If `project.teamId` exists, pulls project ID from that team's `projects` array
- Then deletes the project document itself

## Overview Page (`Overview.tsx`)
- Shows "Overview" header with aggregate stats from `GET /users/overview/stats`
- 4 stat cards: Total Projects, Managed Secrets, Environments, Teams (with member counts)
- Recent Projects section (up to 3, clickable)
- All counts computed from single backend endpoint call, not from multiple `/all` queries
- Loading skeleton while data fetches

## Secret Display (Projects.tsx)
- Secret values are permanently masked as `••••••••••••••••` — no reveal toggle or copy button
- Each secret card shows: name, monospaced masked key, environment dropdown, edit/delete actions
- Environment dropdown only shows real environments (no "No env" / "None" options)
- Secret create/edit uses separate Zod schemas: `createSecretSchema` (both required) vs `editSecretSchema` (both optional)
- Edit form sets `secKey = ""` to avoid exposing the current value

## Delete Button Placement
- **Projects**: Delete button only in Settings tab (Danger Zone card), not in overview tab
- **Teams**: Delete button only in team detail settings and sidebar, not in team cards

## Project "Created" Date
- Shows `toLocaleDateString` with `{ month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }`
- Falls back to extracting timestamp from MongoDB ObjectId (`parseInt(_id.substring(0, 8), 16) * 1000`) when `createdAt` is `undefined`

## Duplicate Project Names
- **Allowed**. Projects are identified by `_id`, not name. Backend `DUPLICATE_PROJECT` error handling has been removed.

## Backend Route Reference

### Auth (`/api/v1/auth`)
| Method | Path | Auth | Body/Params |
|---|---|---|---|---|
| POST | `/register` | No | `{ name, email, password }` |
| POST | `/login` | No | `{ email, password }` |
| POST | `/refresh` | No (cookie) | (empty, reads `refreshtoken` cookie) |
| POST | `/logout` | Yes | — |
| GET | `/me` | Yes | — |
| PUT | `/change-password` | Yes | `{ currentPassword, newPassword }` |
| PUT | `/profile` | Yes | `{ name }` — updates user's display name |
| POST | `/send-reset-link` | Yes | (empty) — sends email with SHA-256 hashed token, 15-min expiry |
| GET | `/reset-password/:token` | No | Verifies hashed token is valid and not expired |
| POST | `/disconnect-oauth` | Yes | `{ provider }` |
| DELETE | `/account` | Yes | — |
| POST | `/verify-email/otp` | No | `{ otp }` |
| POST | `/verify-email/token/:token` | No | — |
| POST | `/resend-verification` | No | — |
| GET | `/google` | No | (redirect) |
| GET | `/github` | No | (redirect) |

### Teams (`/api/v1/teams`)
| Method | Path | Auth | Notes |
|---|---|---|---|---|
| GET | `/all` | Yes | List user's teams (includes `projects` array, `memberCount`) |
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
|---|---|---|---|---|
| GET | `/all` | Yes | Optional `?teamId=` query param. Returns personal projects + team projects where user is member. Scoped to user's teams, never unfiltered. |
| GET | `/all?teamId=xxx` | Yes | Validates membership first, returns only that team's projects |
| GET | `/get/:projectId` | Yes | — |
| POST | `/create` | Yes | `{ projectName, description, projectLink?, teamId? }` — teamId is optional (personal project if omitted). Never auto-assigns. |
| PUT | `/update/:projectId` | Yes | owner/admin/developer |
| DELETE | `/delete/:projectId` | Yes | owner/admin only. Also pulls from team's `projects` array. |
| GET | `/:projectId/secrets` | Yes | All team members can read |
| POST | `/:projectId/secrets` | Yes | owner/admin/developer |
| PUT | `/:projectId/secrets/:secretId` | Yes | owner/admin/developer |
| DELETE | `/:projectId/secrets/:secretId` | Yes | owner/admin/developer (developer only if they created it) |
| GET | `/:projectId/environments` | Yes | All team members can read |
| POST | `/:projectId/environments` | Yes | owner/admin/developer |
| PUT | `/:projectId/environments/:envId` | Yes | owner/admin/developer |
| DELETE | `/:projectId/environments/:envId` | Yes | owner/admin/developer (developer only if they created it) |
| POST | `/:projectId/teams` | Yes | owner/admin — `{ teamId }`. Sets project's single teamId (replaces previous). |
| DELETE | `/:projectId/teams` | Yes | owner/admin — unsets project's teamId (makes it personal). No teamId param needed. |

### Users (`/api/v1/users`)
| Method | Path | Auth | Notes |
|---|---|---|---|---|
| GET | `/overview/stats` | Yes | Returns `{ totalProjects, totalSecrets, totalEnvironments, totalTeams, recentProjects, recentSecrets }` scoped to the authenticated user. |

### Project Routes (old vs new)
Old route (removed): `DELETE /:projectId/teams/:teamId` — needed teamId in URL
New route: `DELETE /:projectId/teams` — no teamId param, reads teamId from the project itself

### Backend Scoping
All "all" endpoints are scoped to the authenticated user:
- **Teams**: `getAllTeams` finds memberships by `{ userId, status: "active" }`, then queries `Team.find({ _id: { $in: teamIds } })`
- **Projects**: `getAllProjects` finds memberships, passes `teamIds` to service, never uses `.find({})` with no filter
- **Secrets/Environments**: All project-scoped routes protected by `validateProjectAccess` middleware
- **Standalone secret/environment routes** (`secret.routes.ts`, `environment.routes.ts`) — these are **orphaned** (never mounted in `routes/index.ts`), so they are dead code

## Coding Conventions

### General
- **No code comments**. Code should be self-documenting.
- **No emojis** in code or UI (unless user explicitly requests).
- **No `refetch()`** — use cache invalidation via tags.
- **No `navigate(0)`** — use proper React state/effect patterns.
- **No hardcoded URLs** — always read `import.meta.env.VITE_API_URL` or use relative paths.
- **No icon-only action buttons without tooltips** — use text labels or well-known patterns.
- **No greeting components** — no "Good morning/afternoon" or "Welcome back" anywhere. Titles are plain (e.g. "Overview", "Projects", "Teams").

### TypeScript (strict mode)
- `verbatimModuleSyntax` — use `import type` for type-only imports.
- `noUnusedLocals`, `noUnusedParameters` — no unused variables allowed.
- `erasableSyntaxOnly` — no enums, no namespaces.

### State Management
- **RTK Query** for all server state. No manual fetch/axios calls in components (except OAuth callback).
- **Auth state** in Redux (`authSlice`) for `user` and `isAuthenticated`.
- **Active team** in `sessionStorage` via `useActiveTeam` hook, synced from URL params.
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
- **Profile editing exception** (`SettingsModal.tsx`, `Account.tsx`): Uses simple `useState` + plain `<button>`/`<input>` instead of Formik. Three state vars: `isEditingProfile`, `profileName`, `isSavingProfile`. The name field toggles between a read-only `<span>` and an editable `<input>`. Email/Member Since/Providers are always read-only display fields. All non-submit buttons explicitly have `type="button"` to prevent accidental form submission. Save/Cancel buttons are plain `<button>` elements with `font-button` class — no `DashboardButton` wrapper.
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
- **Secrets/Environments scoped to projects**: Path format is `/:projectId/secrets` and `/:projectId/environments`.
- **Version endpoints**: Not implemented because no version routes exist in backend.
- **Email invite tokens**: Plain 32-byte hex string stored in DB with teamId, email, expiresAt.
- **Invite token in sessionStorage**: Survives page navigations during auth flow. Cleared after accept or decline.
- **Role defaults to viewer**: If user not found in team members, all permissions default to false (view-only).
- **New Project button always visible**: Not gated by role — all authenticated users can see it.
- **Project routes decoupled from team**: Project detail URL is `/dashboard/project/:projectId` — no `:teamId` in it. Team context is determined by the data model (project.teamId field), not the URL.
- **Personal + Team project modes**: Projects can exist without a team (personal) or assigned to one team. The create dialog defaults to "None (Personal)". Never auto-assigns.
- **Single teamId per project**: A project has at most one team. Assigning a new team replaces the old one (removes from old team's projects array, adds to new team's).
- **Cache clearing on auth change**: `resetApiState()` is called on login, logout, and delete account to prevent stale data from a previous user leaking to the current user.
- **sessionStorage cleared on auth change**: `activeTeamId` and `inviteToken` are removed on login/logout/delete-account to prevent cross-session contamination.
- **Account deletion**: Uses cascade deletion in `auth.service.ts` that respects ownership. Owned teams are identified via `TeamModel.ownerId` (not `TeamMemberModel.role`). For each owned team: deletes all projects + nested secrets/environments, team members, invites, then the team itself. Deletes personal projects (userId match, no teamId). Non-owner memberships only remove the TeamMember record. Never deletes resources belonging to other users. Safe deletion order prevents orphaned documents. All cookies cleared on frontend via `clearCredentials()`.
- **Overview stats from single endpoint**: `GET /users/overview/stats` returns all counts + recent items in one call, avoiding multiple `/all` requests.
- **Secret key privacy**: When editing a secret, `openEditSecret` sets `secKey` to `""` so the current value is never exposed in the form. The edit schema makes `secKey` optional, and the backend only re-encrypts if a new value is provided.
- **Secret values never shown**: No reveal toggle or copy button exists. Values are permanently masked.
- **URL-based routing**: projectId comes from URL params. Invalid IDs show a dedicated error page.
- **Duplicate project names allowed**: Projects are identified by `_id`. Removed the `DUPLICATE_PROJECT` check from backend.
- **Delete buttons only in settings**: Danger Zone section moved from overview tab to settings tab for both projects and teams.
- **Separate Logo component** (`components/ui/Logo.tsx`): Colored-letter logo — C/R use `text-black dark:text-white`, U/O always use `text-accent` (#FF3333). Replaces old `CuroLogo.tsx` (unused).
- **PixelBlast interactive background** (`components/animations/PixelBlast.tsx`): Canvas-based WebGL/Three.js animation with configurable shapes, ripples on pointer events, and density falloff. Used as `absolute inset-0` background in Hero section and auth pages. Content overlays use `pointer-events-none` + `pointer-events-auto` on interactive elements so pointer events pass through to the canvas.
- **OAuth/social login buttons**: Use `border-accent`, `bg-transparent`, `text-accent` with no hover effects. "or continue with" divider text is transparent bg + `text-accent`.
- **Auth submit buttons**: Match Hero's "Get Started" button style — `rounded-full border-accent !bg-[#FF3333] !text-white hover:!bg-white hover:!text-[#FF3333]`.
- **Font stack**: `--font-sans: "DM Sans"`, `--font-button: "Space Grotesk"`, `--font-display: "Null Normal"` (custom font from `src/assets/fonts/NullNormal400.otf`).
- **Tailwind accent color**: `accent` is a custom Tailwind color set to `#FF3333`, used via `text-accent`, `border-accent`, `bg-accent/*`.

## Computed Counts in Backend Responses
The backend computes aggregate counts using `countDocuments` in parallel with `Promise.all`:
- **Team cards** (`team.service.ts`): `memberCount = TeamMemberModel.countDocuments({ teamId })`
- **Project cards** (`project.service.ts`): `secretCount = SecretsModel.countDocuments({ projectId })`, `environmentCount = EnvironmentModel.countDocuments({ projectId })`
- **Overview stats** (`user.service.ts`): Returns `totalProjects, totalSecrets, totalEnvironments, totalTeams` plus `recentProjects` (last 3) and `recentSecrets` (last 3) — all scoped to the user's memberships.
- These are computed in `getAllTeams` / `getAllProjects` / `getOverviewStats` and returned as part of the response. The frontend displays them directly from the API data.
- Projects no longer return `teamCount` — team assignment is singular (`teamId`), not an array.

## Active Team & Project Context
`DashboardLayout` provides `ActiveTeamContext` and syncs URL `teamId` to sessionStorage. The sidebar "Teams" nav item links to the active team's URL. When no team is in the URL, the first team is auto-selected. Teams page reads IDs from URL params via `useParams` and auto-selects the matching entity. Project detail page reads `projectId` from URL (no `teamId`).

## Pagination / Filtering
No server-side pagination implemented yet. All filtering is client-side via search input state + filter + `useMemo`.

## Mongoose Schemas
- **Team model**: `{ timestamps: true }` — `createdAt` and `updatedAt` are auto-generated. Has `projects: ObjectId[]` array for quick project lookup.
- **Project model**: `{ timestamps: true }` — `createdAt` and `updatedAt` are auto-generated. `teamId: ObjectId | null` (single, not array). No unique constraint on name.

## Pre-existing Backend Build Errors (Not From These Changes)
The following TypeScript errors exist in unchanged files and are NOT related to any project work:
- `auth.controller.ts:212` — `string | string[]` not assignable to `string`
- `project.controller.ts:20` and `:58` — type mismatches
- `environment.service.ts:148` — `ObjectId` vs `string` comparison
- `project.service.ts:25` — `_id` not in type `IProject`
- `project.service.ts:51,52` — `createdAt`/`updatedAt` not in type
- `secret.service.ts:194` — `ObjectId` vs `string` comparison

These are strict type issues in code that was written before the type definitions were tightened. They do not affect runtime behavior.

---

# Curo CLI — Terminal Application (`packages/`)

## Overview
An interactive terminal UI for pulling Curo secrets to `.env` — built with Ink (React for terminals). Single-screen command-palette style (like Claude Code / OpenCode).

## Tech Stack
- **Runtime**: Node.js (npm)
- **Framework**: Ink v7 (React for CLI) + TypeScript (strict)
- **Bundler**: tsup (ESM)
- **HTTP**: Axios with cookie-based auth
- **Config**: `conf` npm package (persistent token storage)
- **Input**: `ink-text-input` for text fields

## Build & Run
```bash
cd packages
npm run build          # tsup → dist/cli.js
npm run start          # node dist/cli.js
```

## Project Structure
```
packages/src/
  cli.tsx                          — Entry point: clear terminal → render(<App/>)
  app/
    App.tsx                        — Root: providers + global Ctrl+C handler
    Router.tsx                     — Route switch (splash, login, dashboard, projects, project, settings, logout)
    Shell.tsx                      — Responsive layout: Logo (header) → content → StatusBar (footer)
    Navigation.tsx                 — Context-based route stack (useNavigation → goTo, currentRoute)
  components/
    Logo.tsx                       — 6-line FIGlet CURO, two-tone (white + dim gray)
    CommandInput.tsx               — Rounded border box, responsive width (useStdout)
    KeyHints.tsx                   — Centered keyboard shortcut row
    TipLine.tsx                    — Accent-bullet tip with bold keywords
    StatusBar.tsx                  — 1-line footer: project:user (left) · version (right)
    ScrollbackLog.tsx              — Append-only action history (success/error/info entries)
    StepIndicator.tsx              — Spinner → ✓/✗ transition row (pending/loading/done/error)
  screens/
    Splash.tsx                     — Animated spinner + session check → dashboard or login
    Login.tsx                      — Email/password form, inline validation, custom 401/404 messages
    Dashboard.tsx                  — Command palette: TextInput + VS Code-style suggestion dropdown
    Projects.tsx                   — Project list from API, search filter, select → project detail
    Project.tsx                    — Secret list + actions (pull .env / refresh / back)
    Pull.tsx                       — (Legacy, unused) Step-based pull screen
    Settings.tsx                   — User name/email, version, auth status, clear local data
    Logout.tsx                     — Spinner → scrollback push → redirect to login
  hooks/
    useKeyboard.ts                 — Ink useInput wrapper (arrow keys, enter, escape, etc.)
    useSpinnerFrame.ts             — Braille spinner animation (80ms interval)
    useTerminalSize.ts             — useStdout + resize listener (columns, rows)
  store/
    auth.tsx                       — AuthProvider: user, token, login/logout/checkAuth
    project.tsx                    — ProjectProvider: projects, secrets, fetch/select, error states
    scrollback.tsx                 — ScrollbackProvider: persistent action log entries
    ui.tsx                         — UIProvider: notifications, global loading
  api/
    client.ts                      — Axios instance, 401 interceptor (clears token)
    auth.ts                        — login(), getMe(), logout()
    project.ts                     — getProjects(), getProject()
    secret.ts                      — getSecrets()
  services/
    token.ts                       — conf-based persistent storage (auth_token, user_email, workspace)
    env.ts                         — APP_VERSION, API_URL constants
  theme/
    colors.ts                      — accent (#5B8DEF), logoFront, logoBack, textSecondary, textDim, error, success, border, etc.
    icons.ts                       — caret, check, cross, spinnerFrames, bullet, etc.
    spacing.ts                     — gutter, sectionGap
  types/
    index.ts                       — Route, User, Project, Secret, Environment, Notification, ApiResponse
```

## Route Flow
```
splash → checkAuth
  ├── has session → dashboard
  └── no session → login → dashboard
                     ↓
               dashboard → /projects → project → select action
                   │         │                    ├── pull .env (writes to .env)
                   │         │                    ├── refresh (reload secrets)
                   │         │                    └── back
                   │         └── esc → dashboard
                   ├── /settings → clear data → login
                   ├── /logout → spinner → login
                   └── /login → login form
```

## Navigation is entirely through `/` commands in the Dashboard. No fixed menu.

## UI Layout
```
┌──────────────────────────────────────┐
│           Logo (fixed header)         │
│                                       │
│         Scrollable Content            │
│         (vertically centered)         │
│                                       │
├──────────────────────────────────────┤
│ StatusBar (fixed footer)              │
└──────────────────────────────────────┘
```

## Key UI Patterns
- **Vertical centering**: Flexible spacers (`flexGrow`) push content to center, StatusBar pinned to bottom
- **Responsive width**: `Math.min(72, Math.max(40, columns - 8))` for all bordered boxes
- **VS Code-style dropdown**: Inside CommandInput border — separator lines, `>` prefix on selected, "N commands" footer
- **No hardcoded widths**: All dimensions derived from `useTerminalSize()` (stdout.columns/rows + resize listener)
- **Safe padding**: 4 spaces left/right via `paddingX={4}`, 2+ lines top/bottom via flex spacers
- **Clear on startup**: `process.stdout.write('\x1Bc')` before render
- **Ctrl+C**: Global `useInput` handler exits process from any screen
- **Global error handler**: `process.on('unhandledRejection', () => {})` prevents crashes

## Auth / Credential Storage
- **Token persistence**: `conf` package (`projectName: 'curo'`) → JSON file
  - Windows: `%APPDATA%\curo\config.json`
  - macOS/Linux: `~/.config/curo/config.json`
- **Token sent as cookie**: `Cookie: access_token=<token>`
- **401 interceptor**: Clears token on any 401 response; components detect and show "session expired" message
- **Login**: `POST /auth/login` → receives token, stores via `setToken()`
- **Logout**: Clears local token + state (no server-side logout call needed)

## Error Handling
- `project.tsx` store: `projectsError` / `secretsError` state, caught in `catch` blocks (was `try/finally` only — caused unhandled 401 crash)
- `Login.tsx`: Custom messages per status code (404 → "user is not registered" + curo.dev link, 401 → "credentials not valid")
- Screens show error text inline inside bordered boxes with "press esc to go back"
- `cli.tsx`: `process.on('unhandledRejection', () => {})` as safety net

## Secrets Pull
When user selects "pull .env" from project actions:
1. Maps `secrets` array to `secName=secKey` lines
2. Strips trailing `;e` from values: `s.secKey.replace(/;e$/, '')`
3. Writes to `process.cwd() + '/.env'`
4. Shows success message with file path inside the bordered box
5. Pushes success entry to scrollback log
