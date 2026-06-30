---
name: redux
description: >
  Documents the Redux Toolkit + RTK Query workflow used in this project.
  Explains how UI components connect to slices and API services, and how
  data flows from the frontend to the backend and back. Referencing
  "redux" in a prompt signals the agent to follow this pattern when
  implementing or modifying state management for any domain.
---

# Redux Workflow

## Stack

- **Redux Toolkit** (`@reduxjs/toolkit`) — `createSlice` for local state, `configureStore`
- **RTK Query** (`createApi` / `fetchBaseQuery`) — server state (CRUD)
- **React-Redux** — pre-typed hooks (`useAppDispatch`, `useAppSelector`)

## Data Flow Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     UI Component                             │
│  (useGetXxxQuery, useAddXxxMutation, useAppDispatch, ...)  │
└──────────┬──────────────────────────────┬──────────────────┘
           │ query/mutation               │ dispatch(action)
           ▼                              ▼
┌──────────────────────┐    ┌──────────────────────────┐
│   RTK Query API      │    │  Slice (local state)     │
│   (domainApi.ts)     │    │  e.g. selectedProject    │
│   createApi          │    │  createSlice             │
└──────────┬───────────┘    └──────────────────────────┘
           │ fetch
           ▼
┌──────────────────────┐
│   Backend API        │
│   (Express routes)   │
└──────────────────────┘
```

**Two concerns are kept separate:**
- **Server state** (list data, CRUD) → RTK Query API service — cached, auto-synced
- **Local UI state** (selected item, modal flags) → Redux slice — synchronous, persisted across navigations

---

## File Structure per Domain

```
src/
  types/
    <domain>.ts              # Shared TypeScript interfaces
  features/
    <domain>/
      <domain>Slice.ts       # createSlice — local state + sync reducers
      <domain>Api.ts         # createApi — RTK Query endpoints (optional, only if backend CRUD exists)
  app/
    store.ts                 # configureStore — registers all reducers + API middleware
    hooks.ts                 # pre-typed useAppDispatch / useAppSelector
```

### File naming conventions

| File | Convention | Example |
|------|-----------|---------|
| Types | `<name>.ts` | `secret.ts` |
| Slice | `<name>Slice.ts` | `secretSlice.ts` |
| API | `<name>Api.ts` | `secretApi.ts` |
| Store | `store.ts` | `store.ts` |
| Hooks | `hooks.ts` | `hooks.ts` |

---

## Layer 1 — Types (`src/types/<domain>.ts`)

Defines the shape of data returned by the backend. Used by both the slice and the API service.

```ts
// src/types/secret.ts
export interface Secret {
  _id: string;
  secName: string;
  secKey: string;
  projectId: string;
  userId: string;
  environmentId?: string;
  author: string;
  updatedAt: string;
}
```

Add the type to `src/types/index.ts` barrel export.

---

## Layer 2 — Slice (`src/features/<domain>/<domain>Slice.ts`)

Holds **local, client-only state** — typically the "selected" item for detail views or modals.

**Do NOT put list data here** — that belongs in the RTK Query cache.

```ts
// src/features/secret/secretSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Secret } from "../../types/secret";

interface SecretState {
  selectedSecret: Secret | null;
}

const initialState: SecretState = {
  selectedSecret: null,
};

export const secretSlice = createSlice({
  name: "secret",
  initialState,
  reducers: {
    setSelectedSecret: (state, action: PayloadAction<Secret | null>) => {
      state.selectedSecret = action.payload;
    },
  },
});

export const { setSelectedSecret } = secretSlice.actions;

export const selectSelectedSecret = (state: { secret: SecretState }) =>
  state.secret.selectedSecret;

export default secretSlice.reducer;
```

### Slice rules

- Reducer name matches `state.secret` key in the store.
- Use `PayloadAction<T>` for action payloads.
- Export each action creator as a named export.
- Export a `select*` selector for each piece of state.
- Default-export `slice.reducer`.

---

## Layer 3 — API (`src/features/<domain>/<domain>Api.ts`)

Uses **RTK Query** to handle all server communication — fetch, create, update, delete.

```ts
// src/features/secret/secretApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Secret } from "../../types/secret";

const API_URL = import.meta.env.VITE_API_URL;

export const secretApi = createApi({
  reducerPath: "secretApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_URL, credentials: "include" }),
  tagTypes: ["Secret"],
  endpoints: (builder) => ({
    getSecrets: builder.query<Secret[], void>({
      query: () => "/secrets/all",
      providesTags: ["Secret"],
    }),
    addSecret: builder.mutation<Secret, Partial<Secret>>({
      query: (body) => ({
        url: "/secrets/save",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Secret"],
    }),
    updateSecret: builder.mutation<Secret, { id: string; body: Partial<Secret> }>({
      query: ({ id, body }) => ({
        url: `/secrets/update/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Secret"],
    }),
    removeSecret: builder.mutation<void, string>({
      query: (id) => ({
        url: `/secrets/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Secret"],
    }),
  }),
});

export const {
  useGetSecretsQuery,
  useAddSecretMutation,
  useUpdateSecretMutation,
  useRemoveSecretMutation,
} = secretApi;
```

### API rules

- `reducerPath` is `"<domain>Api"` — used as the store key.
- `baseQuery` uses `VITE_API_URL` and sends `credentials: "include"` for cookie-based auth.
- `tagTypes` declares cache invalidation tags (one per domain).
- `providesTags` marks queries — after a mutation with `invalidatesTags`, the query auto-refetches.
- Each endpoint maps to a backend route (`POST /secrets/save`, `DELETE /secrets/delete/:id`, etc.).
- Export generated hooks as named exports.

**Endpoint naming convention:**

| Backend route | Hook |
|---------------|------|
| `GET /<domain>/all` | `useGet<Domain>Query` |
| `POST /<domain>/save` | `useAdd<Domain>Mutation` |
| `PUT /<domain>/update/:id` | `useUpdate<Domain>Mutation` |
| `DELETE /<domain>/delete/:id` | `useRemove<Domain>Mutation` |

---

## Layer 4 — Store (`src/app/store.ts`)

Wires all slices and API services into a single Redux store.

```ts
// src/app/store.ts
import { configureStore } from "@reduxjs/toolkit";
import secretReducer from "../features/secret/secretSlice";
import { secretApi } from "../features/secret/secretApi";

const store = configureStore({
  reducer: {
    secret: secretReducer,
    [secretApi.reducerPath]: secretApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(secretApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
```

**When adding a new domain:**
1. Import the slice reducer and add it under its key (e.g. `project: projectReducer`).
2. Import the API service and add `[api.reducerPath]: api.reducer`.
3. Concat `api.middleware` to the middleware chain.

---

## Layer 5 — Hooks (`src/app/hooks.ts`)

Pre-typed hooks so you never type `RootState` or `AppDispatch` manually.

```ts
// src/app/hooks.ts
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./store";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
```

Always import these instead of `useDispatch` / `useSelector` from `react-redux`.

---

## Layer 6 — Provider (`src/main.tsx`)

The store is provided at the root of the React tree.

```tsx
<Provider store={store}>
  <BrowserRouter>
    <ToastProvider>
      <App />
    </ToastProvider>
  </BrowserRouter>
</Provider>
```

---

## UI Integration — Connecting Everything

### Query (read)

```tsx
const { data: secrets = [], isLoading, isError } = useGetSecretsQuery();

if (isLoading) return <p>Loading...</p>;
if (isError) return <p>Something went wrong.</p>;

return secrets.map((s) => <div key={s._id}>{s.secName}</div>);
```

### Mutation (write)

```tsx
const [addSecret] = useAddSecretMutation();
const [removeSecret] = useRemoveSecretMutation();

// Create
await addSecret({ secName, secKey, projectId }).unwrap();

// Delete
await removeSecret(id).unwrap();
```

### Dispatch (local state)

```tsx
const dispatch = useAppDispatch();
const selectedSecret = useAppSelector(selectSelectedSecret);

dispatch(setSelectedSecret(secret));
```

### Full component example

```tsx
import { useGetSecretsQuery, useRemoveSecretMutation } from "../features/secret/secretApi";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { setSelectedSecret, selectSelectedSecret } from "../features/secret/secretSlice";

export default function SecretsPage() {
  const dispatch = useAppDispatch();
  const selectedSecret = useAppSelector(selectSelectedSecret);

  const { data: secrets = [], isLoading, isError } = useGetSecretsQuery();
  const [removeSecret] = useRemoveSecretMutation();

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Something went wrong.</p>;

  return (
    <div>
      {secrets.map((secret) => (
        <div key={secret._id}>
          <p>{secret.secName}</p>
          <button onClick={() => dispatch(setSelectedSecret(secret))}>Select</button>
          <button onClick={() => removeSecret(secret._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
```

---

## Adding a New Domain — Step-by-Step Checklist

Assume you are adding a `project` domain:

1. **`src/types/project.ts`** — define `Project` interface; add to `src/types/index.ts`
2. **`src/features/project/projectSlice.ts`** — `createSlice` with `selectedProject` state; export `setSelectedProject` + `selectSelectedProject`
3. **`src/features/project/projectApi.ts`** — `createApi` with `getProjects`, `addProject`, `updateProject`, `removeProject` endpoints
4. **`src/app/store.ts`** — add `projectReducer` and `projectApi.reducer` + `projectApi.middleware`
5. **In the UI component** — import hooks from the API and slice; use them

**Registering in the store (`src/app/store.ts`):**

```ts
import projectReducer from "../features/project/projectSlice";
import { projectApi } from "../features/project/projectApi";

const store = configureStore({
  reducer: {
    // ...
    project: projectReducer,
    [projectApi.reducerPath]: projectApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      // ...
      projectApi.middleware,
    ),
});
```

---

## Key Principles

| Concern | Where | Mechanism |
|---------|-------|-----------|
| Server data (list CRUD) | `*Api.ts` | RTK Query — caching, auto-refetch, tags |
| Local UI state (selected item) | `*Slice.ts` | Redux `createSlice` — synchronous dispatch |
| Component-side effects | UI component | `useEffect`, formik `onSubmit` |
| Auth tokens | `fetchBaseQuery` credentials | Cookie-based (`credentials: "include"`) |
| Cache invalidation | Tags (`providesTags` / `invalidatesTags`) | Automatic refetch after mutation |

- **Do not** store fetched list data in slices — keep it in the RTK Query cache.
- **Do not** make API calls in slices — use RTK Query endpoints.
- **Do not** import `useDispatch`/`useSelector` directly — use `useAppDispatch`/`useAppSelector`.
