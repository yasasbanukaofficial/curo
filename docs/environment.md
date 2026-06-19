# Environment Model — Full Documentation

## Overview

The `Environment` model represents deployment environments (e.g., `development`, `staging`, `production`) within a project. Each environment belongs to a single project and user. Environments cascade-delete their associated secrets when removed.

---

## Data Model

### `IEnvironment` (TypeScript interface)

```ts
interface IEnvironment {
  name: string;         // "development", "staging", "production" — or custom
  projectId: ObjectId;  // ref → Project
  userId: ObjectId;     // ref → User
}
```

### Mongoose Schema

```ts
const environmentSchema = new Schema({
  name:      { type: String, required: true },
  projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
  userId:    { type: Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

// A user cannot have two environments with the same name in the same project
environmentSchema.index({ name: 1, projectId: 1 }, { unique: true });
```

### Timestamps (auto-managed)

| Field       | Type   | Source       |
|-------------|--------|--------------|
| `createdAt` | `Date` | `timestamps` |
| `updatedAt` | `Date` | `timestamps` |

---

## API Endpoints

All endpoints require authentication via cookie-based JWT (`authenticate` middleware). Base path: `/api/v1/environments`

### `GET /all`

Fetch all environments for the authenticated user.

```
GET /api/v1/environments/all
Cookie: access_token=...
```

**Response** `200 OK`
```json
{
  "success": true,
  "status": 200,
  "data": [
    {
      "_id": "66a...",
      "name": "development",
      "projectId": "66b...",
      "userId": "66c...",
      "createdAt": "..."
    }
  ]
}
```

**Flow:** `Controller.getAllEnvironments` → `Service.getAllEnvironments(userId)` → `EnvironmentModel.find({ userId }).sort({ createdAt: -1 })`

---

### `GET /get/:environmentId`

Fetch a single environment by its ID.

```
GET /api/v1/environments/get/66a123...
Cookie: access_token=...
```

**Response** `200 OK`
```json
{
  "success": true,
  "status": 200,
  "data": {
    "_id": "66a...",
    "name": "staging",
    "projectId": "66b...",
    "userId": "66c..."
  }
}
```

**Error** `404` — `"Environment not found"`

**Flow:** `Controller.getEnvironmentById` → `Service.getEnvironmentById(userId, environmentId)` → `EnvironmentModel.findOne({ _id, userId })`

---

### `POST /create`

Create a new environment.

```
POST /api/v1/environments/create
Cookie: access_token=...
Content-Type: application/json

{
  "name": "production",
  "projectId": "66b..."
}
```

**Response** `201 Created`
```json
{
  "success": true,
  "status": 201,
  "msg": "Environment created successfully"
}
```

**Errors**

| Status | Message |
|--------|---------|
| `400`  | `"name and projectId are required"` |
| `400`  | `"An environment with this name already exists in this project"` |
| `500`  | `"Internal server error while creating environment"` |

**Flow:**
```
Controller.createEnvironment
  → validates body exists
  → Service.createEnvironment(userId, { name, projectId })
    → validates name && projectId present
    → EnvironmentModel.create({ name, projectId, userId })
    → catches 11000 → "DUPLICATE_ENVIRONMENT"
```

---

### `PUT /update/:environmentId`

Update an existing environment's name or project.

```
PUT /api/v1/environments/update/66a123...
Cookie: access_token=...
Content-Type: application/json

{
  "name": "prod"
}
```

**Response** `200 OK`
```json
{
  "success": true,
  "status": 200,
  "msg": "Environment updated successfully"
}
```

**Errors**

| Status | Message |
|--------|---------|
| `400`  | `"Environment ID is required"` / `"Request body is required"` |
| `404`  | `"ENVIRONMENT_NOT_FOUND"` |
| `500`  | error message |

**Flow:**
```
Controller.updateEnvironment
  → validates environmentId && body
  → Service.updateEnvironment(userId, environmentId, data)
    → validates environmentId present
    → validates at least one field to update
    → EnvironmentModel.findOneAndUpdate({ _id, userId }, { $set: data })
    → if !result → "ENVIRONMENT_NOT_FOUND"
```

---

### `DELETE /delete/:environmentId`

Delete an environment and **all its secrets** (cascade delete).

```
DELETE /api/v1/environments/delete/66a123...
Cookie: access_token=...
```

**Response** `200 OK`
```json
{
  "success": true,
  "status": 200,
  "msg": "Environment deleted successfully"
}
```

**Errors**

| Status | Message |
|--------|---------|
| `400`  | `"Environment ID is required"` |
| `404`  | `"ENVIRONMENT_NOT_FOUND"` |
| `500`  | error message |

**Cascade delete flow:**
```
Controller.deleteEnvironment
  → validates environmentId
  → Service.deleteEnvironment(userId, environmentId)
    1. SecretsModel.deleteMany({ environmentId, userId })
    2. EnvironmentModel.findOneAndDelete({ _id: environmentId, userId })
    → if !deleted → "ENVIRONMENT_NOT_FOUND"
```

---

## Secret Model Changes

An optional `environmentId` field was added to the existing `ISecret` interface and `Secrets` model:

```ts
// types/secret.ts
export interface ISecret {
  secName: string;
  secKey: string;
  projectId: Types.ObjectId;
  userId: Types.ObjectId;
  environmentId?: Types.ObjectId;  // ← new
}
```

When creating or updating a secret, you can optionally provide `environmentId` to associate it with an environment. The secret service passes it through to the database on create/update and returns it on reads.

---

## Frontend

A new page at `/environments` provides the UI for managing environments:

**`frontend/src/pages/EnvironmentsPage.tsx`**
- Create form (name + projectId via dropdown)
- Environment list table
- Fetch-by-ID input
- Follows the same pattern as `ProjectsPage.tsx`

**Route registration** in `App.tsx`:
```tsx
<Route path="/environments" element={<EnvironmentsPage />} />
```

The secrets form (`FormPage.tsx`) now includes an environment dropdown that filters environments based on the selected project.

---

## File Reference

| Layer | File | Purpose |
|-------|------|---------|
| Types | `backend/src/types/environment.ts` | `IEnvironment` interface |
| Model | `backend/src/models/environment.model.ts` | Mongoose schema, model, compound index |
| Service | `backend/src/services/environment.service.ts` | CRUD business logic + cascade delete |
| Controller | `backend/src/controller/environment.controller.ts` | HTTP request/response handlers |
| Routes | `backend/src/routes/environment.routes.ts` | Express router (5 endpoints) |
| Barrel | `backend/src/routes/index.ts` | `EnvironmentRouter` export |
| Entry | `backend/src/index.ts` | Route mounted at `/api/v1/environments` |
| Frontend | `frontend/src/pages/EnvironmentsPage.tsx` | Environment management UI |
| Frontend | `frontend/src/App.tsx` | `/environments` route |
| Frontend | `frontend/src/pages/FormPage.tsx` | Environment selector in secrets form |
