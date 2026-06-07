**Curo**

Developer Second Brain OS

*A unified operating system for developers — integrating tools, tracking knowledge, and predicting what you need next.*

| *The trick is to not make it another chatbot. Instead, make it a Developer Operating System.* |
| :---- |

# **The Concept**

Imagine opening one dashboard and seeing all of this — connected:

| GitHub          →  your repos, issues, PRs, commits Google Calendar →  meetings, deadlines, study sessions Notion / Notes  →  personal knowledge base Learning Log    →  topics studied, mastery scores Projects        →  visual architecture graphs |
| :---- |

Instead of switching between 10 tabs, everything is unified. One OS. One view. Total context.

# **The Problem**

A typical developer maintains active sessions across:

* GitHub — code, issues, PRs

* Jira / Trello — task and sprint management

* Notion — documentation and personal notes

* Google Calendar — meetings, deadlines

* Documentation tabs — references and guides

* Learning resources — courses, tutorials

Information is scattered across all of these. Developers waste 30–45 minutes every day just orienting themselves. Context-switching kills flow state and compounds over weeks into significant lost productivity.

# **The SaaS — Developer Second Brain OS**

Curo becomes a system that unifies five things most developers currently manage separately:

| Memory | Tracks everything you've learned, built, and done — and flags what you're forgetting |
| :---- | :---- |
| **Planning** | Tasks, deadlines, sprints — unified with your calendar and GitHub issues |
| **Learning** | Study sessions logged, mastery tracked, forgetting predicted with ML |
| **Project Management** | Live project health, risk scores, and completion predictions |
| **Knowledge Graph** | Visual React Flow graphs connecting concepts, projects, and skills |

# **Daily Usage Scenario**

A developer opens Curo in the morning. Instead of checking five apps, they see:

| Good morning, Yasas. Today:   2 meetings scheduled   4 open GitHub issues   1 pending PR review You planned to learn:   \- NestJS   \- Docker You haven't reviewed:   \- JWT Authentication  (14 days ago)   \- Docker Networking   (22 days ago) Burnout Risk: Medium  (high meeting load this week) Project completion estimate: June 14 |
| :---- |

*No AI API needed. Just integrations \+ prediction models running locally.*

# **React Flow — Visual Project Graphs**

Every project becomes an interactive node graph. Users can zoom, pan, connect, and edit nodes live. Think of it as a living technical roadmap.

| Ecommerce Platform Frontend    ├── Auth    ├── Products    └── Cart Backend    ├── Users API    ├── Orders API    └── Payments API |
| :---- |

The knowledge graph works the same way. Every topic a developer studies becomes a node, with subtopics branching off automatically:

| NestJS    ├── Controllers    ├── Services    ├── Guards    └── Middleware |
| :---- |

# **GitHub Integration**

Connect a repository and Curo tracks and learns from activity over time:

* Commits — frequency, size, patterns

* Issues — open count, resolution time, backlog depth

* Pull Requests — review time, merge rate

* Languages — skill breadth visible at a glance

* Repositories — multi-repo dashboard

The ML layer learns from this history and predicts:

| You usually finish issues within 3 days. Current issue \#42 may take 6 days — it's larger than your average. |
| :---- |

# **Google Calendar Integration**

Pull meetings, deadlines, and study sessions directly from Google Calendar. The Calendar Agent uses this data to predict workload and flag burnout risk before it happens:

| This week: 9 meetings scheduled Open issues: 6 Study sessions: 0 this week Burnout Risk: Medium Recommendation: Block 2 deep-work sessions Thursday |
| :---- |

# **AI Features — No External APIs**

All ML runs on-device via TensorFlow.js, Brain.js, ml5.js, and ONNX Runtime. No GPT. No API keys. No cost per request.

## **1\. Forgetting Prediction — TensorFlow.js**

Tracks study gaps using a forgetting curve model (Ebbinghaus). Predicts per-topic retention probability:

| JWT Authentication:   Last studied: 14 days ago   Estimated retention: 31%   Action: Review recommended today |
| :---- |

## **2\. Learning Mastery Score — TensorFlow.js**

Tracks study frequency, recency, and self-assessment to compute a mastery percentage per topic:

| NestJS mastery:  72% Docker mastery:  41% React mastery:   88% |
| :---- |

## **3\. Productivity Prediction — Brain.js**

Learns from historical commit velocity and task completion patterns to predict project milestones:

| Ecommerce Platform   Estimated completion: June 14   Current velocity: on track |
| :---- |

## **4\. Task Duration Estimator — Brain.js**

Neural network trained on your own past tasks. Estimates how long a new task will take before you start it:

| Task: Implement OAuth refresh token flow   Your estimate: ?   Curo estimate: 4.5 hours  (based on 12 similar past tasks) |
| :---- |

# **The Core Value — Questions No Tool Answers Today**

Most second-brain apps just store information. Curo answers questions:

| What am I forgetting? | Memory Agent surfaces decaying knowledge nodes |
| :---- | :---- |
| **What should I learn next?** | Learning Agent ranks topics by gap vs. project needs |
| **Which project is at risk?** | Project Agent monitors velocity and deadline proximity |
| **Which skill is growing fastest?** | Learning Agent tracks mastery delta over time |
| **What is blocking me?** | GitHub \+ Task Agent cross-references stale issues and PRs |
| **What should I work on today?** | Daily Digest combines all agent outputs into one prioritised list |

# **Multi-Agent Architecture — No LLM Required**

Curo uses a rule-based agent architecture. Each agent owns a domain, has its own ML models and rule sets, and feeds outputs into the shared Daily Digest. No GPT. No orchestration framework needed.

| Agent | Responsibility |
| :---- | :---- |
| **Learning Agent** | Predicts topic mastery, calculates study priority, surfaces review recommendations |
| **Memory Agent** | Tracks knowledge nodes, study gaps, and forgetting curves — owns the knowledge graph |
| **Project Agent** | Monitors project health, flags at-risk deliverables, tracks velocity against deadlines |
| **Task Agent** | Estimates task durations from history, prioritises the active backlog |
| **Calendar Agent** | Parses meeting density, feeds burnout prediction model, suggests deep-work blocks |
| **GitHub Agent** | Monitors commits and issues, learns resolution velocity, surfaces blockers |

# **Tech Stack**

| Layer | Technologies |
| :---- | :---- |
| **Frontend** | React (Vite), React Flow, Tailwind CSS, React Query, Axios |
| **Backend** | Node.js, Express.js, REST APIs, JWT Authentication, OAuth 2.0 |
| **Database** | MongoDB Atlas, Mongoose ODM |
| **ML / AI (on-device)** | TensorFlow.js, Brain.js, ml5.js, ONNX Runtime — no external API calls |
| **Graphs** | React Flow (interactive node graphs), Graphology (graph algorithms) |
| **Integrations** | GitHub REST API v3, Google Calendar API v3, OAuth 2.0 (GitHub \+ Google) |

# **What Impresses Lecturers**

Don't pitch this as an AI assistant. Pitch it as infrastructure:

| *"This is a Developer Digital Twin. The platform continuously learns from the developer's projects, learning history, tasks, and productivity patterns to predict knowledge decay, project risk, learning progress, and workload — while unifying developer tools into a single operating system."* |
| :---- |

Why this pitch works:

* No LLM wrappers — all intelligence is real ML models and rule-based agents

* Two live third-party integrations (GitHub, Google Calendar) with OAuth 2.0

* React Flow knowledge graph is genuinely distinctive — no comparable student project does this

* Multi-agent architecture without the complexity of an LLM orchestration layer

* The Digital Twin framing is credible: the system models the user, not just stores their data

