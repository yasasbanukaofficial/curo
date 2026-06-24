---
name: flows
description: >
  Documents the complete backend request lifecycle for every domain (auth,
  projects, secrets, environments, versions, audits, teams). Traces a
  request from entry point through routes, middleware, controllers,
  services, and models, including error code mappings and cross-service
  call chains. Referencing "flows" in a prompt signals the agent to use
  this document to explain, plan, or implement backend request flows.
  Mainly implementation.
---

# Backend Request Flow

## Overview

Every request follows this path:

```
Client
  ↓ HTTP Request
Entry Point (src/index.ts)
  ↓ mounts router at /api/v1/{domain}
Route (src/routes/{domain}.routes.ts)
  ↓ middleware chain
Middleware (src/middlewares/)
  ├─ authenticate — JWT verification, attaches userId
  └─ validate — Zod schema validation, replaces req.body
Controller (src/controller/{domain}.controller.ts)
  ↓ parses params/body, calls service
Service (src/services/{domain}.service.ts)
  ↓ business logic, DB queries
Model (src/models/{domain}.model.ts)
  ↓ Mongoose document
MongoDB
  ↑ response bubbles back through sendResponse
Controller → sendResponse(res, { success, status, data, msg })
  ↓ JSON response
Client
```

---

## 1. Entry Point — `src/index.ts`

Express app mounts all routers on `/api/v1/{domain}`:

```
/api/v1/auth         → AuthRouter
/api/v1/projects     → ProjectRouter
/api/v1/secrets      → SecretRouter
/api/v1/environments → EnvironmentRouter
/api/v1/versions     → VersionRouter
/api/v1/audits       → AuditRouter
/api/v1/teams        → TeamRouter
```

Global middleware applied before routes:
- `cors()` — restricted to `FRONTEND_URL`
- `express.json()` — parses JSON bodies
- `cookieParser()` — parses cookies for auth tokens

---

## 2. Route Layer — `src/routes/{domain}.routes.ts`

Each file creates a `Router()` and defines endpoints with their middleware chain.

### Middleware chain order

```typescript
// Standard authenticated endpoint
router.get("/all", authenticate, handler);

// Authenticated + validated endpoint  
router.post("/create", authenticate, validate(schema), handler);
```

### Three middleware patterns exist:

| Pattern | Example routes |
|---------|---------------|
| `authenticate` only | projects, secrets, environments, versions, audits |
| `authenticate` + `validate` | teams (create/update, add/update member, invite) |
| No middleware | auth register/login (uses `validate` only), OAuth redirects |

### Auth routes are special

```
POST /register  → validate(registerSchema)   → registerUser
POST /login     → validate(loginSchema)      → loginUser
GET  /me        → authenticate               → getCurrentUser
GET  /google    → (no middleware)            → loginWithGoogle (redirects)
```

---

## 3. Middleware Layer — `src/middlewares/`

### `authenticate` (auth.middleware.ts)

1. Reads `access_token` from cookies
2. If valid → verifies JWT via `verifyToken()`, loads user from DB, attaches `req.userId` and `req.userEmail`, calls `next()`
3. If access token expired → falls through to refresh token logic
4. Reads `refreshtoken` from cookies
5. Calls `refreshTokenViaCookies()` (cross-layer import from auth controller)
6. On success → sets new cookies, attaches `req.userId`, calls `next()`
7. On failure → returns `401` JSON via `sendResponse`

**Result:** After this middleware, `req.userId` is guaranteed to exist (controllers use `req.userId!`).

### `validate(schema)` (validate.middleware.ts)

1. Factory function that takes a Zod schema
2. Calls `schema.safeParse(req.body)`
3. If invalid → returns `400` with `result.error.issues[0].message`
4. If valid → replaces `req.body` with parsed data, calls `next()`

**Note:** Validation is optional — only teams and auth routes use it. Other domains (projects, secrets, environments) validate manually in the service layer.

---

## 4. Controller Layer — `src/controller/{domain}.controller.ts`

Controllers are thin — they parse the request and delegate to services.

### Standard structure

```typescript
export const handler = async (req: AuthRequest, res: Response) => {
  // 1. Extract params
  const { id } = req.params as { id: string };
  const userId = req.userId!;
  const body = req.body;

  // 2. Guard: check required params/body
  if (!id) {
    return sendResponse(res, { success: false, status: 400, msg: "ID is required" });
  }

  // 3. Call service (wrapped in try/catch)
  try {
    const result = await domainService.method(userId, id, body);
    return sendResponse(res, { success: true, status: 200, data: result });
  } catch (error: any) {
    // 4. Map error codes to HTTP statuses
    if (error.message === "SOME_ERROR") {
      return sendResponse(res, { success: false, status: 4xx, msg: "..." });
    }
    return sendResponse(res, { success: false, status: 500, msg: "Internal server error" });
  }
};
```

### Controller responsibilities
- Extract and type-cast `req.params`
- Check for missing `req.body`
- Call the service method
- Map thrown string error codes to HTTP status codes
- Always respond via `sendResponse()`

---

## 5. Service Layer — `src/services/{domain}.service.ts`

Services contain all business logic and DB operations.

### Standard structure

```typescript
export const domainService = {
  method: async (userId: string, ...args): Promise<Type> => {
    // 1. Destructure and validate payload
    const { field } = data;
    if (!field) throw new Error("INVALID_PAYLOAD");

    try {
      // 2. Query DB
      const doc = await DomainModel.findOne({ _id: id, userId });
      if (!doc) throw new Error("DOMAIN_NOT_FOUND");

      // 3. Return result
      return doc;
    } catch (dbError: any) {
      // 4. Handle DB errors
      if (dbError.code === 11000) throw new Error("DUPLICATE_DOMAIN");
      console.error("DB Error:", dbError);
      throw new Error("DATABASE_ERROR");
    }
  },
};
```

### Service responsibilities
- `userId` is always the first parameter for ownership scoping
- All DB queries include `userId` in the filter
- Payload validation via `if (!field) throw new Error("INVALID_PAYLOAD")`
- DB operations wrapped in try/catch
- Duplicate key errors (`code === 11000`) mapped to `DUPLICATE_*`
- Generic DB errors logged and rethrown as `DATABASE_ERROR`

### Cross-service calls

Services can call other services for related operations:

```
secretService.saveSecretToDB()
  → encrypt.gen(secKey)               # encrypt the secret value
  → versionService.createVersion()     # auto-create a version
  → auditService.createAudit()         # log the action
```

---

## 6. Model Layer — `src/models/{domain}.model.ts`

Mongoose schema definitions. Conventions:
- Schema variable prefixed with `_`: `_teamSchema`
- Model exported with `Model` suffix: `TeamModel`
- Compound unique indexes defined on the schema
- `timestamps: true` for createdAt/updatedAt

---

## 7. Response — `src/util/apiResponse.ts`

Every response goes through `sendResponse()`:

```typescript
sendResponse(res, { success: true,  status: 200, data: result });
sendResponse(res, { success: false, status: 400, msg: "Error description" });
```

### Response shape

```typescript
// Success
{ success: true, status: 200, data: { ... } }
{ success: true, status: 201, msg: "Created successfully" }

// Error
{ success: false, status: 400, msg: "Description" }
```

---

## Domain-Specific Flows

### Auth Domain

```
POST /api/v1/auth/register
  → validate(registerSchema)    # Zod: name, email, password
  → registerUser (controller)
    → authService.createUser()
      → isExistingUser(email) check
      → hash.gen(password)
      → UserModel.create()
    ← { success: true, status: 201, data: { id, name, email } }

POST /api/v1/auth/login
  → validate(loginSchema)       # Zod: email, password
  → loginUser (controller)
    → authService.authenticateUser()
      → UserModel.findOne({ email })
      → hash.compare(password)
      → tokenGen.genAccessToken() + tokenGen.genRefreshToken()
      → user.updateOne({ $push: { refreshTokens } })
    ← set cookies (access_token, refreshtoken)
    ← { success: true, status: 200, data: { id, name, email, accessToken, refreshToken } }

GET /api/v1/auth/me
  → authenticate (middleware)
    → verifyToken(access_token from cookies)
    → refresh fallback if expired
  → getCurrentUser (controller)
    → authService.getCurrentUser(userId)
      → UserModel.findById(userId).select("-password -refreshTokens ...")
    ← { success: true, data: { id, name, email, provider, createdAt } }
```

### Projects Domain

```
GET /api/v1/projects/all
  → authenticate (middleware)
  → getAllProjects (controller)
    → projectService.getAllProjects(userId)
      → ProjectModel.find({ userId }).sort({ createdAt: -1 })
    ← { success: true, data: [ ... ] }

POST /api/v1/projects/create
  → authenticate (middleware)
  → createProject (controller)
    → projectService.createProject(userId, body)
      → Validate: projectName, description
      → ProjectModel.create({ projectName, description, userId })
      → Catch 11000 → DUPLICATE_PROJECT
    ← { success: true, status: 201, msg: "Project created successfully" }
```

### Teams Domain

```
GET /api/v1/teams/all
  → authenticate (middleware)
  → getAllTeams (controller)
    → teamService.getAllTeams(userId)
      → TeamMemberModel.find({ userId, status: "active" })
      → TeamModel.find({ _id: { $in: teamIds } })
    ← { success: true, data: [ ... ] }

POST /api/v1/teams/create
  → authenticate (middleware)
  → validate(createTeamSchema)   # Zod: name, slug, plan, etc.
  → createTeam (controller)
    → teamService.createTeam(userId, body)
      → Validate: name, slug
      → TeamModel.create({ ...data, ownerId: userId })
      → TeamMemberModel.create({ teamId, userId, role: "owner", status: "active" })
      → Catch 11000 → DUPLICATE_SLUG
    ← { success: true, status: 201, msg: "Team created successfully" }

POST /api/v1/teams/get/:teamId/members
  → authenticate (middleware)
  → validate(addMemberSchema)
  → addTeamMember (controller)
    → teamService.addTeamMember(userId, teamId, body)
      → Validate: targetUserId
      → Authorize: caller must be owner/admin of team
      → UserModel.findById(targetUserId)
      → TeamMemberModel.create({ teamId, userId, role, status: "invited" })
    ← { success: true, status: 201, msg: "Member added successfully" }

POST /api/v1/teams/invites/accept/:token
  → authenticate (middleware)
  → acceptInvite (controller)
    → teamService.acceptInvite(token, userId)
      → TeamInviteModel.findOne({ token })
      → Check: not expired
      → Check: not already a member
      → TeamMemberModel.create({ teamId, userId, role: invite.role, status: "active" })
      → TeamInviteModel.findByIdAndDelete(invite._id)
    ← { success: true, msg: "Invitation accepted successfully" }
```

### Secrets Domain

```
POST /api/v1/secrets/save
  → authenticate (middleware)
  → createSecret (controller)
    → secretService.saveSecretToDB(userId, body)
      → Validate: secName, secKey, projectId
      → encrypt.gen(secKey)        # AES-256-CBC encryption
      → SecretsModel.create({ ... })
      → versionService.createVersion(userId, secretId, secKey)
      → auditService.createAudit(userId, "CREATED", "SECRET", metadata)
    ← { success: true, status: 201, msg: "Secret created successfully" }

PUT /api/v1/secrets/update/:secretId
  → authenticate (middleware)
  → updateSecret (controller)
    → secretService.updateSecretInDB(userId, secretId, body)
      → SecretsModel.findOne({ _id: secretId, userId })
      → versionService.createVersion()   # auto-version before update
      → SecretsModel.findByIdAndUpdate()
      → auditService.createAudit()
    ← { success: true, msg: "Secret updated successfully" }
```

### Cross-service call chains

```
secretService.saveSecretToDB
  → versionService.createVersion    (audit trail: version history)
  → auditService.createAudit         (audit trail: action log)
```

---

## Summary Diagram

```
                     ┌─────────────────────────────────────┐
                     │        src/index.ts                 │
                     │  Express app, global middleware,    │
                     │  router mounts                      │
                     └──────────┬──────────────────────────┘
                                │
                     ┌──────────▼──────────────────────────┐
                     │  src/routes/{domain}.routes.ts      │
                     │  Route definitions + middleware     │
                     │  chain                              │
                     └──────────┬──────────────────────────┘
                                │
                ┌───────────────┼───────────────┐
                │               │               │
     ┌──────────▼──────────┐   │   ┌───────────▼───────────┐
     │ auth.middleware.ts  │   │   │ validate.middleware.ts│
     │ authenticate:      │   │   │ validate(schema):     │
     │ JWT → userId       │   │   │ Zod safeParse → body  │
     └──────────┬──────────┘   │   └───────────┬───────────┘
                │               │               │
                └───────────────┼───────────────┘
                                │
                     ┌──────────▼──────────────────────────┐
                     │  src/controller/{domain}.controller │
                     │  Parse params, guard, call service  │
                     │  Map error codes → HTTP status      │
                     └──────────┬──────────────────────────┘
                                │
                     ┌──────────▼──────────────────────────┐
                     │  src/services/{domain}.service.ts   │
                     │  Business logic, validation,        │
                     │  DB queries, cross-service calls    │
                     └──────────┬──────────────────────────┘
                                │
                     ┌──────────▼──────────────────────────┐
                     │  src/models/{domain}.model.ts       │
                     │  Mongoose schema + model            │
                     └──────────┬──────────────────────────┘
                                │
                     ┌──────────▼──────────────────────────┐
                     │           MongoDB                   │
                     └─────────────────────────────────────┘
```
