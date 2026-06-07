**Curo**

Unified Intelligence Platform

**Full Build Documentation**

MERN Stack  •  TypeScript  •  BrainJS  •  TensorFlow.js  •  Vector DB

Version 1.0  •  June 2026

# **What We Are Building**

Curo is a unified intelligence platform that connects all the tools people use every day — GitHub, Slack, WhatsApp, Google Calendar, ClickUp and more — and brings everything into one place. But it is not just an aggregator. It learns from your data using BrainJS and TensorFlow.js, trains models on your personal usage patterns, and starts predicting what matters, what is at risk, and what needs your attention before you even ask.

The core problem it solves: every tool you use is siloed. Your Slack has context your GitHub does not. Your WhatsApp has decisions your ClickUp never captured. Nothing connects the dots. Curo does.

## **The Vision in One Sentence**

One intelligent workspace that knows everything happening across your work and life, learns your patterns, and acts before you ask.

## **The Three Layers**

| Layer | What It Does | Tech |
| :---- | :---- | :---- |
| Connection Layer | Pulls data from every connected app via OAuth and webhooks in real time | OAuth 2.0, Webhooks, Bull queue |
| Unified View | Normalizes everything into one schema and presents it intelligently | MongoDB, React, Express APIs |
| Intelligence Layer | Learns patterns, makes predictions, surfaces insights automatically | BrainJS, TF.js, Qdrant vector DB |

# **Screens to Build**

These are the actual screens users interact with, listed in order of importance.

## **1\. Onboarding — Connect Your Apps**

The first thing a user does. A clean step-by-step flow where they connect their tools one by one. Each integration has a Connect button that triggers the OAuth flow. Once connected, the app starts pulling their data immediately. The user never has to do this again.

## **2\. Daily Brief — Home Screen**

Every time a user opens the app this is what they see. Not a dump of notifications. An intelligent ranked view of what actually matters today. What is urgent. Who is waiting on you. What meetings are coming. What deadlines are at risk. All pulled from across every connected app automatically.

## **3\. Unified Feed**

A single chronological but smart timeline of everything happening across all tools. A commit was pushed. A message came in. A task moved. A meeting was added. All in one scroll. Filterable by source, person, or project. Gets smarter as BrainJS learns what you care about.

## **4\. People View**

Pick any person. See everything connected to them across all apps. Their Slack messages, WhatsApp threads, calendar meetings, ClickUp tasks, GitHub activity. One person, full cross-app picture. The system automatically knows that john@gmail.com and @john on Slack are the same person.

## **5\. Projects View**

Pick any project or topic. See everything related to it across all tools. The Slack discussion, the GitHub repo, the ClickUp board, the calendar meetings about it. Connections are found automatically using vector similarity — not tags you set manually.

## **6\. Search**

Type anything and find it across every connected app instantly. Semantic search — not just keyword matching. "What did we decide about the payment feature?" finds the answer across Slack, WhatsApp, GitHub comments, and ClickUp notes at once.

## **7\. Commitments Tracker**

Shows a list of things you said you would do and things others promised you — extracted automatically from Slack and WhatsApp messages. No manual task creation. The system heard the promise and remembered it. You mark them done when complete.

## **8\. Alerts and Predictions**

A dedicated screen for AI-generated alerts. Deadline risk warnings, relationship drift notifications, anomaly alerts like a sudden drop in team commit frequency, and workload overflow predictions. This is where the intelligence layer surfaces its findings.

# **Build Phases — Full Workflow**

Follow this exact order. Never build UI for something that does not work in the backend yet. Each phase must be complete and tested before starting the next.

| Phase 1 | Backend Foundation The base that everything else runs on. Auth, database, and project structure. |
| :---: | :---- |

### **What to build in Phase 1**

* Express \+ TypeScript project setup with a clean folder structure

* Environment config using dotenv — all secrets in .env, never hardcoded

* MongoDB connection using Mongoose with a base model setup

* Auth system — JWT based with register, login, refresh token, and logout endpoints

* User model — stores user profile and which apps they have connected

* Middleware — auth guard, error handler, request logger

* Basic health check endpoint to confirm the server is running

Deliverable: A running Express server with working auth endpoints you can test in Postman. Nothing else until this is solid.

| Phase 2 | Integration Layer OAuth connections and real-time data ingestion from each external app. |
| :---: | :---- |

### **What to build in Phase 2**

Build one connector end to end before starting the next. GitHub first because its API is the cleanest.

**For each connector you build three things:**

1. OAuth handshake — redirect user to the app, receive the token, store it encrypted in MongoDB

2. Data fetcher — initial pull of existing data from the app via their REST API

3. Webhook receiver — endpoint that listens for real-time events from the app

**Connector build order:**

* GitHub — repos, commits, pull requests, issues, review comments

* Google Calendar — events, attendees, meeting descriptions

* Slack — messages, channels, reactions, mentions

* ClickUp — tasks, comments, status changes, assignments

* WhatsApp — via WhatsApp Business API or Baileys library (do this last, it is the most complex)

**The unified schema — critical architectural decision:**

Every event from every app gets normalized into one shape before touching MongoDB. A Slack message, a GitHub PR, and a calendar event all become the same document structure. This is what makes the intelligence layer possible.

| Field | Description |
| :---- | :---- |
| \_id | MongoDB ObjectId |
| userId | Owner of this event |
| source | Which app: github | slack | calendar | clickup | whatsapp |
| type | Event type: message | commit | task | event | pr | comment |
| content | The actual text content of the event |
| entities | Extracted people, projects, topics mentioned |
| timestamp | When this happened in the source app |
| metadata | Source-specific data like PR number, channel name, repo |
| embedding | Vector embedding generated by TF.js — added in Phase 6 |

**Also build a Bull \+ Redis queue for background sync jobs. Do not make synchronous API calls in request handlers.**

Deliverable: Data flowing from GitHub and Google Calendar into MongoDB in normalized form. Real-time via webhooks.

| Phase 3 | Core Data Layer The APIs that power every screen — feed, people, projects, search. |
| :---: | :---- |

### **What to build in Phase 3**

* Unified feed API — returns normalized events across all sources, sorted by timestamp, paginated, filterable by source and type

* People resolver — logic that identifies the same person across apps. john@gmail.com in Calendar \= @john in Slack \= John Smith in ClickUp. Store a unified contacts collection with all aliases.

* People API — given a person, return all their events across all connected apps

* Projects resolver — groups events by detected topic using entity extraction. No manual tagging required.

* Projects API — given a topic, return all related events across apps

* Search API — full text search across all normalized events in MongoDB. Vector search gets added in Phase 6\.

* Commitments extractor — rule-based NLP that scans messages for promise language: "I will send", "can you do", "I will have this by". Returns a structured list of commitments with who made them and to whom.

* Commitments API — CRUD for the commitments list, mark as done, filter by person or project

Deliverable: All backend APIs working and tested in Postman. Every screen has its data source ready.

| Phase 4 | Frontend Foundation React \+ TypeScript setup, design system, auth screens, and API wiring. |
| :---: | :---- |

### **What to build in Phase 4**

* React \+ TypeScript \+ Vite project setup

* React Router setup with protected routes — unauthenticated users redirected to login

* Zustand for global state — user session, connected apps, notifications

* API service layer — typed axios wrappers for every backend endpoint. Do this properly once and never touch it again.

* Auth screens — login, register, forgot password

* Base design system components:

  * Button — primary, secondary, ghost variants

  * Card — base container for all content blocks

  * Badge — source labels, status indicators

  * Input, Select, Textarea — form elements

  * Sidebar — main navigation

  * TopBar — global search bar and user menu

  * Avatar — with initials fallback

  * EmptyState — for screens with no data yet

* WebSocket connection setup for real-time feed updates

Deliverable: A running React app with auth working end to end. Login, get a JWT, hit a protected API, see a response.

| Phase 5 | Frontend Screens Build every user-facing screen connected to real backend data. |
| :---: | :---- |

### **What to build in Phase 5 — in this exact order**

4. Onboarding flow — connect apps screen, OAuth redirect handling, success state per connector

5. Unified feed — infinite scroll, real-time WebSocket updates, filter bar by source, click to expand any event

6. Search — global search bar in top nav, results page with events grouped by source

7. People view — people list, individual person page with full cross-app timeline

8. Projects view — auto-detected project list, individual project page with all related events

9. Daily brief — home screen with hardcoded priority logic first: most recent \+ flagged \+ upcoming calendar. ML upgrade comes in Phase 6\.

10. Commitments tracker — list of extracted commitments, filter by mine vs others, mark as done

11. Alerts screen — placeholder for Phase 6 ML predictions. Show static examples for now.

Deliverable: A fully functional app. All screens work with real data. A user can connect their apps and use every feature.

| Phase 6 | Intelligence Layer BrainJS and TF.js models trained on real user data. Vector search. Predictions. |
| :---: | :---- |

Only start this phase when Phase 5 is complete and you have real users with real data flowing. You cannot train models on empty databases.

### **Step 1 — Vector embeddings**

* Set up Qdrant or Chroma alongside MongoDB

* TF.js Universal Sentence Encoder generates an embedding for every normalized event

* Store embeddings in the vector DB with the MongoDB event ID as reference

* Run a backfill job to embed all existing events

### **Step 2 — Upgrade search to semantic**

* Replace MongoDB full text search with Qdrant vector similarity search

* Queries are embedded at runtime and matched against the event embeddings

* Results are now semantic — "payment feature discussion" finds relevant events even without those exact words

### **Step 3 — Cross-app context linking**

* When a user opens a person or project, vector similarity automatically surfaces related events from other apps

* A GitHub PR about authentication pulls in the Slack thread where it was discussed and the calendar meeting where it was decided

* No manual tagging. All automatic.

### **Step 4 — BrainJS feed ranker**

* Track every feed event a user clicks on vs ignores

* Train a BrainJS feedforward network per user: input \= event features (source, type, person, age), output \= engagement probability

* Retrain weekly as new interaction data comes in

* Use the model scores to rerank the unified feed — what you care about floats up

### **Step 5 — BrainJS commitment classifier**

* Replace the rule-based commitment extractor with a trained BrainJS classifier

* Label examples of commitment language and non-commitment language from real messages

* Train the classifier and run every new message through it on ingestion

* Higher precision and recall than keyword rules

### **Step 6 — TF.js LSTM deadline predictor**

* Train an LSTM on each user's historical task completion patterns: task age, complexity signals, workload at time of completion, deadline hit or miss

* Predict for current open tasks: likelihood of on-time completion

* Surface predictions on the Alerts screen and Daily Brief: "You are likely to miss this deadline based on your current workload"

### **Step 7 — Relationship drift detector**

* Track interaction frequency and message sentiment per person over time

* BrainJS detects when a relationship is drifting: frequency dropping, sentiment becoming shorter or more terse

* Nudge the user before it becomes a problem: "You have not responded to Sarah in 5 days. Last message tone was negative."

### **Step 8 — Daily brief ML upgrade**

* Replace the hardcoded priority logic with the trained models

* Feed ranker score \+ deadline predictor \+ commitment urgency \+ relationship drift \= a fully ML-ranked morning brief

* The longer someone uses the app the more accurate their brief becomes

Deliverable: An app that gets measurably smarter over time. The longer you use it the better it knows you. This is what creates lock-in.

# **First Week Build Plan**

Do not deviate from this. After day 7 you will have a working v0.1 with real data and real UI. Everything else is additive.

| Day | What to Build |
| ----- | :---- |
| **Day 1** | Express \+ TypeScript setup. MongoDB connection. Auth endpoints (register, login, refresh, logout). Test everything in Postman. |
| **Day 2** | GitHub OAuth flow. Fetch user repos, commits, and pull request events. Normalize into unified schema. Store in MongoDB. |
| **Day 3** | Unified feed API endpoint. Returns GitHub events paginated and sorted. Add Bull \+ Redis queue for background sync. |
| **Day 4** | React \+ TypeScript \+ Vite setup. Auth screens. Protected routing. API service layer. Zustand global state. |
| **Day 5** | Render the unified feed in the frontend with real GitHub data. WebSocket connection for real-time updates. |
| **Day 6** | Google Calendar OAuth. Fetch calendar events. Normalize into same unified schema. Calendar events appear in the same feed as GitHub. |
| **Day 7** | People resolver — detect that the same person appears in both GitHub and Calendar. People view showing cross-app events for one person. |

**After day 7 you have a working multi-source unified feed with auth, real data, and cross-app person linking.**

That is your v0.1. Ship it to your first users and then you will feel exactly what to build next.

# **Tech Stack Reference**

## **Backend**

| Technology | Purpose |
| :---- | :---- |
| Node.js \+ Express | API server and webhook receivers |
| TypeScript | Type safety across the entire codebase |
| MongoDB \+ Mongoose | Primary database for all normalized events and user data |
| Bull \+ Redis | Background job queue for data sync and model training |
| JWT | Auth tokens — access token short-lived, refresh token long-lived |
| Socket.io | Real-time feed updates pushed to the frontend |

## **Frontend**

| Technology | Purpose |
| :---- | :---- |
| React \+ TypeScript | UI framework |
| Vite | Build tool and dev server |
| React Router v6 | Client-side routing with protected routes |
| Zustand | Global state management — lightweight, no boilerplate |
| Axios | HTTP client with typed request/response wrappers |
| Socket.io client | Real-time event subscription from the backend |
| TanStack Query | Server state caching, pagination, and background refetch |

## **Intelligence Layer**

| Technology | Purpose |
| :---- | :---- |
| TF.js Universal Sentence Encoder | Generates vector embeddings for all events |
| TF.js LSTM | Sequence modeling for deadline and workload prediction |
| BrainJS | Lightweight feedforward networks for feed ranking, commitment classification, and drift detection |
| ML5.js | Supplementary ML utilities and pre-trained model wrappers |
| Qdrant (or Chroma) | Vector database for semantic search and similarity matching |

## **Integrations**

| App | Method |
| :---- | :---- |
| GitHub | OAuth App \+ REST API v3 \+ Webhooks |
| Google Calendar | OAuth 2.0 \+ Google Calendar API v3 \+ Push notifications |
| Slack | Slack App OAuth \+ Events API \+ Socket Mode for real-time |
| ClickUp | OAuth \+ ClickUp REST API v2 \+ Webhooks |
| WhatsApp | WhatsApp Business API (official) or Baileys (unofficial, no cost) |

# **Recommended Folder Structure**

## **Backend**

| Folder / File | What Goes Here |
| :---- | :---- |
| src/config/ | Database connection, environment variables, Redis setup |
| src/models/ | Mongoose schemas — User, UnifiedEvent, Contact, Commitment |
| src/routes/ | Express route files — one per feature area |
| src/controllers/ | Request handlers — keep thin, call services |
| src/services/ | Business logic — auth, sync, extractor, resolver |
| src/integrations/ | One folder per connector — github/, slack/, calendar/, clickup/, whatsapp/ |
| src/integrations/\[app\]/oauth.ts | OAuth flow handler for this app |
| src/integrations/\[app\]/fetcher.ts | Pulls data from this app's API |
| src/integrations/\[app\]/webhook.ts | Receives real-time events from this app |
| src/integrations/\[app\]/normalizer.ts | Transforms raw API response into UnifiedEvent schema |
| src/queues/ | Bull queue definitions and job processors |
| src/ml/ | BrainJS and TF.js model training and inference code |
| src/middleware/ | Auth guard, error handler, rate limiter |
| src/utils/ | Shared helpers — date formatting, text extraction, encryption |

## **Frontend**

| Folder / File | What Goes Here |
| :---- | :---- |
| src/pages/ | One file per route — DailyBrief, Feed, People, Projects, Search, Commitments |
| src/components/ | Reusable UI components — Button, Card, Badge, Avatar, etc. |
| src/components/feed/ | Feed-specific components — FeedItem, FeedFilter, SourceBadge |
| src/components/people/ | Person card, person timeline, people list |
| src/services/ | Typed axios wrappers for every API endpoint |
| src/store/ | Zustand slices — auth, feed, people, search |
| src/hooks/ | Custom hooks — useFeed, usePerson, useSearch, useWebSocket |
| src/types/ | TypeScript interfaces — UnifiedEvent, Person, Project, Commitment |
| src/utils/ | Date formatting, text truncation, source color mapping |

# **Rules to Follow**

* Never build a frontend screen before its backend API is working and tested

* Never hardcode secrets — every key and token lives in .env

* Never store OAuth tokens in plain text — encrypt them at rest in MongoDB

* Never make API calls to external services synchronously in a request handler — always use the Bull queue

* Always normalize data into the unified schema immediately on ingestion — never store raw API responses as the source of truth

* One connector fully working end to end before starting the next one

* Write TypeScript interfaces for every API request and response — never use any

* The ML layer comes last — only after real users have real data. You cannot train on empty databases.

* Commit after every working milestone — never sit on large uncommitted changes

* Phase 6 models are per-user — never train a shared model on multiple users' data. Each user's BrainJS model is trained on their own behavior only.

Curo Build Documentation  •  v1.0  •  June 2026