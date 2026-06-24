---
name: commit
description: >
  Defines the conventional commit format and rules for this project
  (type, scope, description conventions, grouping strategy, and commit
  grouping examples). Referencing "commit" in a prompt signals the
  agent to plan a commit strategy and present it to the user; if the
  user approves, the agent executes the commit.
---

# Commit Convention

## Format

```
<type>(<scope>): <description>
```

## Types

| Type     | When to use                                |
| -------- | ------------------------------------------ |
| `feat`   | A new feature                              |
| `fix`    | A bug fix                                  |
| `refactor` | Code restructuring, no new feature or fix  |
| `style`  | UI-only changes, no logic changes          |
| `docs`   | Documentation only                         |

## Scopes

Scopes are flexible — use whatever best describes the area of work. Common patterns:

- **Layer name** — `backend`, `frontend` (broad cross-cutting changes)
- **Domain name** — `auth`, `dashboard`, `animation`, `pricing`, `settings`, `teams`
- **Component / file name** — `ui`, `navbar`, `sidebar`, `modal`, `form`
- **Context** — `routes`, `models`, `middleware`, `ci`, `deps`, `config`

The scope doesn't have to come from a fixed list. Pick what makes the change easy to identify at a glance.

**Examples:**
```text
feat(auth): add login and register pages with formik + zod validation
style(ui): update FilterTabs button padding and hover states
refactor(routes): extract route definitions from App.tsx
feat(backend): add teams domain with models, service, controller and routes
fix(navbar): link all Get Started buttons to /register
```

## Rules

### 1. Group common changes in one commit
Related changes (e.g., a new page + its route + nav links) go in one commit. Split them across multiple commits if they are not common.

### 2. Properly structure the commits
Common changes should be commit in one single commit. So there might be multiple commits. Always the commit should relate commonly among the changes. 
Example:
  1. Commit 1 - feat(user): implemented user workflow...
  2. Commit 2 - feat(ui): implemented dashboard components...
Multiple commits but commits only related ones.

### 2. Do NOT push
Only commit locally. Never push to remote unless explicitly asked.

### 3. Keep descriptions clear and concise
Use present tense, imperative mood. Describe what the commit does, not what you changed.

**Good:** `feat(dashboard): add teams page with sidebar navigation`
**Bad:** `feat(dashboard): added teams page and also updated sidebar and mobile nav`

### 4. No emojis or markdown formatting
Plain text only in commit messages.

### 5. Separate refactors from features
If you're both refactoring and adding a feature, split into two commits:
1. `refactor(...): ...`
2. `feat(...): ...`

### 6. One commit per logical change
Don't cram unrelated changes into one commit. If a change touches both backend and frontend unrelatedly, split them.

## Examples

```text
feat(backend): add teams domain with models, service, controller and routes
refactor(frontend): extract routes to dedicated file and restructure pages
feat(frontend): add teams page with toast, alert modal and sidebar navigation
feat(frontend): enhance dashboard components with onClick, onBlur props and formik
style(ui): update FilterTabs button padding and hover states
fix(dashboard): link all Get Started buttons to /register
```
