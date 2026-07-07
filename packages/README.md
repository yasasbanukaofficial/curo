```
 ██████╗██╗   ██╗██████╗  ██████╗
██╔════╝██║   ██║██╔══██╗██╔═══██╗
██║     ██║   ██║██████╔╝██║   ██║
██║     ██║   ██║██╔══██╗██║   ██║
╚██████╗╚██████╔╝██║  ██║╚██████╔╝
 ╚═════╝ ╚═════╝ ╚═╝  ╚═╝ ╚═════╝
```

# Curo CLI

**Centralized secrets management for teams — straight to your terminal.**

`name: curo`　`npm: @curo/cli`　`license: MIT`　[`curo.dev`](https://curo.dev)

**Pull your Curo project secrets directly into `.env` from the terminal.**  
Never share secrets via email, Slack, or messaging apps again.

--

## Table of Contents

- [What is Curo?](#what-is-curo)
- [Why Use Curo?](#why-use-curo)
- [How It Works](#how-it-works)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Usage](#usage)
- [Commands](#commands)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Configuration](#configuration)
- [What Gets Stored Locally](#what-gets-stored-locally)
- [Security Model](#security-model)
- [Why a CLI Instead of a Web Dashboard?](#why-a-cli-instead-of-a-web-dashboard)
- [Requirements](#requirements)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [Support](#support)
- [License](#license)

---

## What is Curo?

Curo is a **centralized secrets management platform** — think Doppler or HashiCorp Vault, but dead-simple to use.

You manage your secrets (API keys, database URLs, admin credentials, etc.) on **[curo.dev](https://curo.dev)** — create projects, invite your team, define environments, and assign access roles. This CLI pulls those secrets straight into your local `.env` file inside your project, so your application never needs to know where the secrets actually live.

---

## Why Use Curo?

### The Problem

How most teams share secrets today:

| Method                                   | Risk                                                                 |
| ---------------------------------------- | -------------------------------------------------------------------- |
| Email or Slack message                   | Stored forever in inboxes — any compromised account leaks everything |
| Shared spreadsheet                       | No audit trail, no access control, easily leaked                     |
| Messaging app (WhatsApp, Telegram, etc.) | Zero governance — anyone in the chat sees every secret               |
| Pasting in meetings / screenshots        | Visible to everyone on screen — no revocation                        |
| `.env` files committed to Git            | A single accidental push exposes every credential                    |

Every one of these methods is **insecure, unscalable, and unaccountable**.

### The Solution

Curo gives your team a **single source of truth** for every secret:

- **Centralized** — one place to create, update, and revoke secrets across all projects
- **Role-based access** — developers get read-only access to secret _names_; only admins can view or edit values
- **Auditable** — every access is authenticated, so you know exactly who pulled what and when
- **No secret sharing** — developers pull from Curo instead of asking each other for passwords
- **Local only** — secrets are written to your local `.env`; Curo never stores or syncs it
- **Accidental-commit safe** — works with your existing `.gitignore`d `.env` workflow

---

## How It Works

```
         curo.dev (web app)
                │
    Create projects, add secrets,
        invite your team
                │
                ▼
     ┌──────────────────────────────┐
     │      curo (open the CLI)     │
     │                              │
     │   /login     authenticate    │
     │   /projects  pick a project  │
     │   pull       write .env      │
     └──────────────────────────────┘
                │
                ▼
         local .env file
```

1. **Sign up** at [curo.dev](https://curo.dev) and create a project.
2. **Add secrets** (database URL, API key, etc.) through the web dashboard.
3. **Invite your team** and assign roles (developer / admin / viewer).
4. **Open the CLI** by running `curo` in your terminal.
5. **Type `/login`** to authenticate with your Curo account.
6. **Type `/projects`** to browse and select your project.
7. **Press `Enter` to open the project**, then select **pull .env** — your `.env` is generated instantly.
8. **Never manually handle a secret again.** Remove a teammate from a project on curo.dev and their access is revoked instantly — no key rotation required.

---

## Installation

**Global install (recommended):**

```bash
npm install -g @curo/cli
```

**Or run on demand, without installing:**

```bash
npx @curo/cli
```

**Other package managers:**

```bash
yarn global add @curo/cli
pnpm add -g @curo/cli
```

---

## Quick Start

```bash
# Install
npm install -g @curo/cli

# Launch the interactive CLI
curo

# Inside the CLI interface:
#   1. /login        → authenticate with your Curo account
#   2. /projects     → select a project
#   3. Enter         → open the project
#   4. pull .env     → write secrets to ./.env
```

That's it — your `.env` is ready and your application can boot normally.

---

## Usage

Running `curo` with no arguments launches the interactive terminal interface:

```
        ██████╗██╗   ██╗██████╗  ██████╗
        ██╔════╝██║   ██║██╔══██╗██╔═══██╗
        ██║     ██║   ██║██████╔╝██║   ██║
        ██║     ██║   ██║██╔══██╗██║   ██║
        ╚██████╗╚██████╔╝██║  ██║╚██████╔╝
         ╚═════╝ ╚═════╝ ╚═╝  ╚═╝ ╚═════╝

╭──────────────────────────────────────────────╮
│ Type a command, e.g. "/projects"              │
│ my-app  ·  developer@company.com              │
╰──────────────────────────────────────────────╯

  type /  for commands   ↑↓  navigate   enter  select   esc  clear

 ● Tip  Try /projects to browse your projects
```

Everything is keyboard-driven — type `/` to see the full command list, or just start typing to search.

---

## Commands

All commands are typed inside the CLI interface.

| Command     | Action                                               |
| ----------- | ---------------------------------------------------- |
| `/login`    | Authenticate, or switch to a different account       |
| `/projects` | Browse and select a project                          |
| `/settings` | View your profile, CLI version, and clear local data |
| `/logout`   | Sign out and clear your local session                |

Once a project is selected, press `Enter` to open it. Inside the project you'll see:

| Action        | What it does                                           |
| ------------- | ------------------------------------------------------ |
| **pull .env** | Writes every secret to `.env` in the current directory |
| **refresh**   | Reloads the secret list from the server                |

> `pull` always replaces the full `.env` file rather than merging keys. Backup your existing `.env` before pulling if you have custom entries.

---

## Keyboard Shortcuts

| Key       | Action                               |
| --------- | ------------------------------------ |
| `↑` / `↓` | Navigate lists / suggestion dropdown |
| `Enter`   | Confirm selection                    |
| `Esc`     | Go back / clear current input        |
| `Ctrl+C`  | Exit the application                 |

---

## Configuration

| Environment Variable | Default                        | Description                                                                        |
| -------------------- | ------------------------------ | ---------------------------------------------------------------------------------- |
| `CURO_API_URL`       | `http://localhost:5000/api/v1` | Override the backend API base URL (useful for self-hosted or staging environments) |

```bash
# Example: point the CLI at a staging environment
CURO_API_URL=https://api.staging.curo.dev/v1 curo
```

---

## What Gets Stored Locally

The CLI stores only an **authentication token** on your machine — never any secret values.

| Platform      | Location                     |
| ------------- | ---------------------------- |
| macOS / Linux | `~/.config/curo/config.json` |
| Windows       | `%APPDATA%\curo\config.json` |

This token authenticates your API requests. Clear it any time via **`/settings` → clear local data**, or by running `/logout`.

> **No secrets are ever cached to disk by the CLI itself.** Every `pull` fetches secrets fresh from the server and writes them directly to `.env`. Delete the token file and you're completely signed out.

---

## Security Model

| Concern             | How Curo handles it                                                              |
| ------------------- | -------------------------------------------------------------------------------- |
| Token storage       | Stored locally via a secure config store — never exposed outside the CLI process |
| API transport       | Encrypted over HTTPS end-to-end (configurable via `CURO_API_URL`)                |
| Auth expiry         | Tokens expire and require periodic re-authentication                             |
| Local `.env`        | Written to disk by the CLI — you own the file, not Curo                          |
| Secret visibility   | Role-based — developers see names only, admins see values                        |
| Revocation          | Remove a team member on curo.dev → their CLI access is revoked instantly         |
| Compromised machine | Run `/logout` or clear local data — the token is invalidated server-side         |

---

## Why a CLI Instead of a Web Dashboard?

Secrets belong **in your development environment**, not in a browser tab. The CLI:

- Writes secrets directly to `.env` where your app actually reads them
- Works offline once authenticated, until the next `pull`
- Drops into your existing workflow (`curo pull && npm run dev`)
- Never touches browser history, cookies, or `localStorage`

---

## Requirements

- Node.js `>= 18`
- npm, yarn, or pnpm
- A [curo.dev](https://curo.dev) account with at least one project

---

## Troubleshooting

**`curo: command not found` after install**
Make sure your global npm bin directory is on your `PATH`. Run `npm config get prefix` and confirm `<prefix>/bin` is included in your shell's `PATH`.

**`pull` overwrites my existing `.env`**
The CLI always replaces the full `.env` file rather than merging keys. Back up your file before pulling if you have custom entries you want to keep.

**Authentication keeps expiring**
Tokens have a limited lifetime for security. Run `/login` again to re-authenticate — this is expected behavior, not a bug.

**Need to fully reset the CLI**
Run `/settings → clear local data`, or manually delete the config file listed in [What Gets Stored Locally](#what-gets-stored-locally).

---

## Contributing

Issues and pull requests are welcome. Please open an issue first for significant changes so we can discuss the approach before you put in the work.

```bash
git clone https://github.com/curo-dev/cli.git
cd cli
npm install
npm run build
npm start
```

---

## Support

- Docs: [curo.dev/docs](https://curo.dev/docs)
- Issues: [github.com/curo-dev/cli/issues](https://github.com/curo-dev/cli/issues)
- Email: support@curo.dev

---

## License

MIT © Curo
