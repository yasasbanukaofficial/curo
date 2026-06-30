---
name: style
description: >
  Documents the backend coding conventions for this project — file and
  export patterns, controller/service patterns, error code definitions,
  robustness rules, and the domain creation checklist. Referencing
  "style" in a prompt signals the agent to apply these conventions when
  writing or reviewing backend code.
---

# Backend Coding Style

## File & Export Conventions

| Layer | File name | Export style |
|-------|-----------|-------------|
| Route | `{domain}.routes.ts` | `export default router` (Router instance) |
| Controller | `{domain}.controller.ts` | `export const methodName` (named async functions) |
| Service | `{domain}.service.ts` | `export const domainService = { method: async () => {} }` (named object) |
| Model | `{domain}.model.ts` | Schema prefixed `_`, Model suffixed `Model` |
| Type | `{domain}.ts` | Interface prefixed `I` |
| Validator | `{domain}.validators.ts` | `export const schemaName` (Zod) |

## Controller Pattern

```typescript
import { Response } from "express";
import { sendResponse } from "../util";
import { AuthRequest } from "../middlewares";
import { domainService } from "../services";

export const actionName = async (req: AuthRequest, res: Response) => {
  const { id } = req.params as { id: string };
  const userId = req.userId!;
  const body = req.body;

  if (!id || !body) {
    return sendResponse(res, {
      success: false,
      status: 400,
      msg: !body ? "Request body is required" : "ID is required",
    });
  }

  try {
    const result = await domainService.method(userId, id, body);
    return sendResponse(res, { success: true, status: 200, data: result });
  } catch (error: any) {
    if (error.message === "SOME_ERROR") {
      return sendResponse(res, { success: false, status: 400, msg: "..." });
    }
    return sendResponse(res, { success: false, status: 500, msg: "Internal server error while ..." });
  }
};
```

## Service Pattern

```typescript
import { DomainModel } from "../models";

export const domainService = {
  method: async (userId: string, ...args): Promise<Type> => {
    const { field } = data;
    if (!field) throw new Error("INVALID_PAYLOAD");

    try {
      const doc = await DomainModel.findOne({ _id: id, userId });
      if (!doc) throw new Error("DOMAIN_NOT_FOUND");
      return doc;
    } catch (dbError: any) {
      if (dbError.code === 11000) throw new Error("DUPLICATE_DOMAIN");
      console.error("DB Error:", dbError);
      throw new Error("DATABASE_ERROR");
    }
  },
};
```

## Error Handling — Robust Code

### 1. Always validate payloads early
Destructure required fields at the top. Throw `INVALID_PAYLOAD` if any are missing. Never let `undefined` or `null` reach a DB query.

### 2. Always scope by userId
Every service method that requires auth takes `userId: string` as the **first** parameter. Every DB query includes `userId` in the filter.

### 3. Null-check getters; throw for mutators
- **Getters** (read-only): return `null` if not found, let the controller decide the response
- **Mutators** (create/update/delete): throw `"..._NOT_FOUND"` if the document doesn't exist

### 4. Wrap DB calls in try/catch
- Catch `dbError.code === 11000` for duplicate key violations → throw `DUPLICATE_*`
- Log with `console.error("DB Error:", dbError)` before rethrowing
- Fallback: throw `DATABASE_ERROR`

### 5. String error code convention
All error codes are uppercase snake_case strings. Standard codes:

| Code | When | HTTP Status (controller) |
|------|------|--------------------------|
| `INVALID_PAYLOAD` | Missing required fields | 400 |
| `*_ID_NOT_EXISTING` | Missing ID param in payload | 400 |
| `*_NOT_FOUND` | Resource doesn't exist | 404 |
| `DUPLICATE_*` | Unique constraint violation | 400 or 409 |
| `CANNOT_*` | Business rule violation | 403 |
| `ALREADY_*` | Duplicate state conflict | 409 |
| `DATABASE_ERROR` | Unexpected DB error | 500 |

### 6. Use descriptive error codes, not generic messages
Bad: `throw new Error("Error")`
Good: `throw new Error("TEAM_NOT_FOUND")`

### 7. Controller catch blocks map codes to HTTP statuses
Use `if/else if` chains for multiple possible codes. `error.message` is always the string code.

### 8. Use sendResponse for every response
Never call `res.json()` directly. Always use:
```typescript
return sendResponse(res, { success: true, status: 200, data: result });
return sendResponse(res, { success: false, status: 400, msg: "..." });
```

### 9. Extract params with type assertion
```typescript
const { id } = req.params as { id: string };
```

### 10. Use non-null assertion for userId
```typescript
const userId = req.userId!;
```
(The `authenticate` middleware guarantees this is set.)

## Response Shape

```typescript
// Success
{ success: true, status: 200, data: { ... } }
{ success: true, status: 201, msg: "Created" }

// Error
{ success: false, status: 400, msg: "Description" }
```

## Adding a New Domain

1. `types/{domain}.ts` — interface
2. `models/{domain}.model.ts` — Mongoose schema + model
3. `services/{domain}.service.ts` — business logic
4. `controller/{domain}.controller.ts` — request handlers
5. `routes/{domain}.routes.ts` — route definitions
6. `validators/{domain}.validators.ts` — Zod schemas (optional)
7. Update all 6 barrel `index.ts` files + `routes/index.ts`
8. Mount in `src/index.ts`
