# Curo — Frontend

Centralized secrets management platform — React + TypeScript + Vite, styled with Tailwind CSS v4.

Securely store, manage, version, and synchronize environment variables across multiple projects and environments through a web dashboard.

## Scripts

- `pnpm dev` — start the dev server
- `pnpm build` — type-check and build for production
- `pnpm preview` — preview the production build
- `pnpm lint` — run ESLint

## Structure

```
src/
  components/   shared UI building blocks
  features/     feature-scoped modules (e.g. landing)
  hooks/        custom React hooks
  types/        shared TypeScript types
  utils/        pure helpers
  styles/       global styles and Tailwind layers
  assets/       static assets bundled by Vite
```
