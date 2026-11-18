# 🚀 CollabFlow — Team Project Management & Developer Accountability SaaS

<div align="center">

[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.0-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [The Problem CollabFlow Solves](#-the-problem-collabflow-solves)
- [The 8-Stage Accountability Workflow](#-the-8-stage-accountability-workflow)
- [🔍 Deep-Dive: Automated GitHub Verification Engine](#-deep-dive-automated-github-verification-engine)
  - [How URLs are Automatically Validated](#1-how-urls-are-automatically-validated)
  - [UI Verification Badges & Proof Card](#2-ui-verification-badges--proof-card)
  - [Handling Invalid Submissions & Fake Links](#3-handling-invalid-submissions--fake-links)
- [📊 Algorithmic Accountability Scoring](#-algorithmic-accountability-scoring)
- [⚡ Key Features & Capabilities](#-key-features--capabilities)
- [🛠️ System Architecture](#-system-architecture)
- [🗄️ Database Schema & Data Models](#-database-schema--data-models)
- [🔌 REST API Reference](#-rest-api-reference)
- [📂 Project Directory Structure](#-project-directory-structure)
- [🚀 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Configuration](#environment-configuration)
  - [Database Initialization](#database-initialization)
  - [Running Development Servers](#running-development-servers)
- [📋 Available Scripts](#-available-scripts)
- [🎨 Design System & UI/UX](#-design-system--uiux)
- [🔒 Security & Tenant Isolation](#-security--tenant-isolation)
- [📄 License](#-license)

---

## 🌟 Overview

**CollabFlow** is an enterprise-grade, full-stack engineering management SaaS application designed to eliminate ambiguity in agile software delivery. 

Traditional issue trackers (such as Trello or Jira) operate strictly on an **"honor system"**: developers can drag any task to *Done* without attaching proof of code delivery. This leads to *phantom progress*, inaccurate sprint reports, and biased subjective performance evaluations.

CollabFlow solves this with a **verifiable evidence layer**:
- Tasks **cannot** simply be marked *Done*.
- Developers submit concrete **GitHub deliverables** (Pull Request URLs, Commit SHAs, Branch references).
- Peers conduct structured code reviews, and project managers enforce an **Approval Gate**.
- An automated scoring algorithm calculates an objective **Accountability Score (0–100)** for every developer and project workspace.

---

## 🎯 The Problem CollabFlow Solves

| Traditional Task Managers (Jira, Trello, Asana) | CollabFlow Developer Accountability SaaS |
| :--- | :--- |
| **Honor System:** Anyone can mark a task "Complete" without showing actual work. | **Proof of Work:** Tasks require verifiable GitHub PRs or commit SHAs before completion. |
| **Ghost Progress:** Sprints look 90% done on paper, but code hasn't been merged or tested. | **Merge Validation:** Checks PR status, author identity, and merge state against GitHub API. |
| **Subjective Performance:** Reviews and ratings depend on manager bias or recency effect. | **Data-Driven Scoring:** Accountability scores factor on-time delivery, PR velocity, and review feedback. |
| **Disconnected Tooling:** Conversations in Slack, code on GitHub, tasks in Jira. | **Unified Hub:** Tasks, GitHub evidence, reviews, comments, and metrics in one glassmorphic workspace. |
| **Manual Verification:** Managers manually hunt down pull request links across repositories. | **Automated Snapshots:** Instant code diff inspection (`+additions`, `-deletions`, files changed) inside the task. |

---

## 🔄 The 8-Stage Accountability Workflow

CollabFlow enforces a strict, closed-loop delivery lifecycle:

```
[1. Task Assignment]
       │  (Owner/Manager assigns task with priority, tags & due date)
       ▼
[2. Work Updates & Check-ins]
       │  (Developer logs progress notes, hours spent & blockers)
       ▼
[3. GitHub Evidence Attachment]
       │  (Developer submits PR URL, Commit SHA, or Branch)
       ▼
[4. Automated GitHub API Verification]
       │  (System queries GitHub API, captures diff & validates repo)
       ▼
[5. Peer Code Review & Feedback]
       │  (Teammates review deliverable: Approved / Changes Requested)
       ▼
[6. Manager Sign-Off & Approval Gate]
       │  (Project Manager verifies final sign-off before status = DONE)
       ▼
[7. Algorithmic Accountability Score Computation]
       │  (Mathematical formula rates on-time delivery & review cycle)
       ▼
[8. Live Team & Workspace Velocity Analytics]
          (Real-time charts update sprint velocity & member scorecards)
```

---

## 🔍 Deep-Dive: Automated GitHub Verification Engine

The GitHub verification system provides automated proof-of-work validation without manual manager intervention.

### 1. How URLs are Automatically Validated

When a developer submits work evidence from the **Task Detail Dialog**:

1. **Regex URL Extraction & Scoping:**
   - The backend `GitHubService` parses the URL using strict pattern matching:
     - **Pull Request URL:** `https://github.com/:owner/:repo/pull/:prNumber`
     - **Commit URL / SHA:** `https://github.com/:owner/:repo/commit/:sha` or 7–40 character hex string.
2. **Project Repository Guard:**
   - If the project is linked to an official repository (e.g., `acme/backend`), the system enforces that the PR/Commit belongs to that exact repository, preventing developers from linking unrelated repositories.
3. **Automated GitHub API Query:**
   - CollabFlow calls the GitHub REST API in the background:
     ```http
     GET https://api.github.com/repos/{owner}/{repo}/pulls/{prNumber}
     GET https://api.github.com/repos/{owner}/{repo}/commits/{commitSha}
     ```
4. **Immutable Snapshot Capture:**
   - When verified, CollabFlow extracts and stores a permanent deliverable record:
     - **Author Identity:** GitHub handle of the contributor.
     - **PR Status & Merge State:** `OPEN` or `MERGED` (with `merged_at` timestamp).
     - **Branch Diffs:** Source branch (e.g., `feature/login`) &rarr; Target branch (e.g., `main`).
     - **Code Statistics:** Lines added (`+`), lines deleted (`-`), and total files changed.
     - **Commit Message:** Header message and timestamp.

---

### 2. UI Verification Badges & Proof Card

Within the task's **Submitted Work Proofs** card, team members immediately see the verified status:

| Status Badge | Icon | Description |
| :--- | :---: | :--- |
| **`Verified`** | 🟢 `CheckCircle2` | GitHub API confirmed the PR/Commit exists. The card shows lines changed (`+48 -12`), branches, author, and PR link. |
| **`Verification Failed`** | 🔴 `AlertTriangle` | GitHub returned a 404 (non-existent link) or repository mismatch. A red alert message details the failure. |
| **`Pending Verification`** | 🟡 `Clock` | Verification is queued or temporarily throttled by API rate limits. |
| **`Not Verified`** | ⚪ `MinusCircle` | Plain text work note submitted without a linked GitHub item. |

- **`🔄 Re-verify` Button:** A live action button on every evidence card allows developers or managers to re-query the GitHub API anytime (e.g., after a PR gets merged or permissions change).

---

### 3. Handling Invalid Submissions & Fake Links

CollabFlow protects against malicious or incorrect input via a **two-tier defense**:

```
Developer Submits Evidence
          │
          ├── [Format Invalid? (e.g. "https://google.com")]
          │        └── ❌ Immediate HTTP 400 Bad Request
          │             Toast alert: "Invalid GitHub Pull Request URL format."
          │
          ├── [Wrong Repo? (e.g. submitted "facebook/react" for an internal project)]
          │        └── ❌ Immediate HTTP 400 Bad Request
          │             Toast alert: "Evidence from repository does not match project repository."
          │
          └── [Valid URL structure, but PR doesn't exist? (e.g. pull/99999)]
                   └── ⚠️ Graceful Status: "VERIFICATION_FAILED"
                        • Card renders red alert: "Pull Request #99999 not found on GitHub repository"
                        • Task is flagged in Review
                        • Manager can click "Request Changes"
                        • Accountability Score penalty applies until fixed
```

---

## 📊 Algorithmic Accountability Scoring

CollabFlow rates engineering reliability on an objective **0 to 100** scale using a deterministic mathematical formula:

$$\text{Score} = (W_{\text{on-time}} \times 40) + (W_{\text{evidence}} \times 30) + (W_{\text{review}} \times 20) + (W_{\text{check-ins}} \times 10)$$

Where:
- **On-Time Delivery Rate ($40\%$):** Percentage of assigned tasks completed on or before the milestone due date.
- **Evidence Verification Completeness ($30\%$):** Ratio of tasks backed by verified GitHub pull requests or commit SHAs.
- **Review Approval & Turnaround ($20\%$):** Tasks approved on the first review cycle vs. those requiring multiple change requests.
- **Active Collaboration & Check-ins ($10\%$):** Punctual status updates, blocker logs, and comment thread participation.

---

## ⚡ Key Features & Capabilities

### 🏢 1. Multi-Tenant Workspace & RBAC
- **Automated Workspace Provisioning:** Every new signup instantly provisions a default private workspace.
- **Role-Based Access Control:** Strict permissions across four roles:
  - **`OWNER`:** Full workspace management, billing, project creation, deletion, and permission assignments.
  - **`MANAGER`:** Create/edit projects, assign tasks, conduct reviews, approve/reject deliverables.
  - **`MEMBER`:** Execute assigned tasks, submit GitHub evidence, post updates, comment on threads.
  - **`VIEWER`:** Read-only access to sprint boards, project timelines, and accountability scorecards.

### 📋 2. Interactive Kanban Sprint Board
- **Drag-and-Drop Workflow:** Move tasks across `TODO`, `IN_PROGRESS`, `REVIEW`, and `DONE`.
- **Live Search & Multivariable Filtering:** Search by keyword, assignee, priority (`High`, `Medium`, `Low`), and tag.
- **Rich Task Dialog:** Markdown-supported descriptions, checklist items, activity timeline, and threaded discussions.

### 🛡️ 3. Manager Approval Gate
- **State Machine Safeguard:** Tasks in `REVIEW` cannot transition to `DONE` without explicit manager sign-off.
- **Structured Feedback:** Managers can **Approve** or **Request Changes** with required revision notes.

### 📈 4. Team & Member Analytics
- **Project Velocity:** Completion trajectory, active vs. closed sprint tasks, burndown trend.
- **Member Scorecards:** Individual accountability ratings, delivery punctuality history, and GitHub contribution metrics.

### 🔔 5. Real-Time Collaboration & Notification Center
- **Live Event Synchronization:** Tasks, comments, and reviews synchronize immediately across active browser tabs.
- **Notification Popover:** Unread badge counter with direct links to tasks when you are assigned, reviewed, or mentioned.

### ✨ 6. Interactive Mock Projects Showcase
- **Built-in Demo Environment (`/app/mock-projects`):** A dedicated sandbox accessible from the sidebar.
- **Zero-Setup Evaluation:** Allows visitors, interviewers, and team members to explore pre-populated Kanban boards, sample PR diffs, and review flows without creating mock data in their actual database.

---

## 🛠️ System Architecture

```
┌──────────────────────────────────────────────────────────┐
│                   CLIENT (React 19 + Vite)               │
│  Tailwind CSS • React Router v7 • TanStack Query v5      │
│  State Management • Real-time WebSockets / SSE           │
└────────────────────────────┬─────────────────────────────┘
                             │ HTTP / JSON REST + WebSockets
┌────────────────────────────▼─────────────────────────────┐
│                   SERVER (Node.js + Express)             │
│  TypeScript • Zod Schemas • JWT Auth • RBAC Middleware   │
│  Services • Repositories • GitHub REST API Integration   │
└────────────────────────────┬─────────────────────────────┘
                             │ Prisma Client ORM
┌────────────────────────────▼─────────────────────────────┐
│                 DATABASE (PostgreSQL 16)                 │
│  Workspaces • Users • Projects • Tasks • Evidence        │
│  Reviews • Comments • Notifications • Activity Logs      │
└──────────────────────────────────────────────────────────┘
```

---

## 🗄️ Database Schema & Data Models

Managed via **Prisma ORM** with relational integrity and performance indexes on PostgreSQL:

```
User (id, email, passwordHash, name, avatar)
  ├── WorkspaceMember ──── Workspace (id, name, slug, ownerId)
  │                          ├── Project (id, name, status, priority, dueDate)
  │                          │     ├── ProjectGitHubRepo (repoUrl, owner, repoName)
  │                          │     ├── Task (id, title, status, priority, dueDate)
  │                          │     │     ├── WorkEvidence (description, status)
  │                          │     │     │     └── TaskGitHubEvidence (prUrl, commitSha, isMerged, verificationStatus)
  │                          │     │     ├── TaskReview (verdict, feedback, reviewerId)
  │                          │     │     ├── TaskComment (content, authorId)
  │                          │     │     └── TaskChecklist (title, isCompleted)
  │                          │     └── ActivityLog (action, target, type)
  │                          └── Notification (recipientId, type, title, message, isRead)
```

---

## 🔌 REST API Reference

### Authentication
- `POST /api/auth/register` — Create account and auto-provision initial workspace.
- `POST /api/auth/login` — Authenticate user and issue JWT session token.
- `GET /api/auth/me` — Retrieve current authenticated profile.

### Workspaces
- `GET /api/workspaces` — List workspaces where user is a member.
- `POST /api/workspaces` — Create a new workspace.
- `GET /api/workspaces/:workspaceId/members` — List members and assigned roles.

### Projects
- `GET /api/projects` — Fetch all projects in active workspace.
- `POST /api/projects` — Create project (Requires `OWNER` or `MANAGER`).
- `GET /api/projects/:projectId` — Project details with tasks and members.
- `PATCH /api/projects/:projectId` — Update project metadata.
- `DELETE /api/projects/:projectId` — Delete project.

### Tasks & Kanban
- `GET /api/projects/:projectId/tasks` — List tasks for project.
- `POST /api/projects/:projectId/tasks` — Create task.
- `PATCH /api/tasks/:taskId` — Update task details, status, or assignee.
- `DELETE /api/tasks/:taskId` — Delete task.

### GitHub Evidence & Accountability
- `POST /api/tasks/:taskId/evidence` — Submit GitHub PR/Commit evidence for verification.
- `GET /api/tasks/:taskId/evidence` — Retrieve submitted evidence with GitHub API snapshots.
- `POST /api/evidence/:evidenceId/verify` — Manually trigger re-verification against GitHub API.
- `POST /api/tasks/:taskId/reviews` — Submit manager peer review (`APPROVED` / `CHANGES_REQUESTED`).
- `GET /api/projects/:projectId/accountability` — Get project accountability scores and metrics.
- `GET /api/analytics/team` — Workspace velocity and member performance leaderboard.

---

## 📂 Project Directory Structure

```
CollabFlow/
├── client/                     # Frontend Application (React 19 + Vite)
│   ├── src/
│   │   ├── app/                # App entry, router & query providers
│   │   ├── components/         # Design system & shared components
│   │   │   ├── layout/         # AppSidebar, AppTopNav, PageHeader, PageContainer
│   │   │   └── ui/             # Buttons, Badges, Modals, Cards, Avatars, EmptyStates
│   │   ├── features/           # Modular Domain Architecture
│   │   │   ├── auth/           # Login, Signup, ProtectedRoute, AuthContext
│   │   │   ├── dashboard/      # Overview metrics, greetings, project summaries
│   │   │   ├── projects/       # Projects list, New Project, Mock Projects, Details
│   │   │   │   ├── components/ # ProjectCard, KanbanBoard, AccountabilityTab
│   │   │   │   ├── pages/      # ProjectsPage, MockProjectsPage, ProjectDetailPage
│   │   │   │   └── data/       # Reference mock datasets
│   │   │   ├── tasks/          # Task management & filter components
│   │   │   └── team/           # Team directory, member profiles, performance
│   │   ├── config/             # Navigation items & route metadata
│   │   ├── lib/                # API client (Axios/Fetch), Real-time sockets, utilities
│   │   └── styles/             # Tailwind CSS tokens & global styles
│   └── package.json
│
├── server/                     # Backend API & Database Layer (Node.js + Express)
│   ├── prisma/
│   │   └── schema.prisma       # Database schema (PostgreSQL)
│   ├── src/
│   │   ├── config/             # Environment, CORS, and JWT configs
│   │   ├── controllers/        # Request controllers (Auth, Project, Task, Review, Analytics)
│   │   ├── middleware/         # Auth guard, RBAC validator, error handler
│   │   ├── repositories/       # Prisma data access abstractions
│   │   ├── routes/             # REST API endpoint definitions
│   │   ├── schemas/            # Zod validation schemas
│   │   ├── services/           # Business logic & GitHub verification engine
│   │   └── app.ts              # Express app bootstrap
│   └── package.json
│
├── .gitignore                  # Git privacy & confidentiality filters
├── package.json                # Root orchestration workspace scripts
└── README.md                   # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or later (v20+ LTS recommended)
- **npm**: v9.0.0 or later
- **PostgreSQL**: v14+ (Local instance or cloud provider like Neon / Supabase)

---

### Installation

Clone the repository and install dependencies:

```bash
# Clone the repository
git clone https://github.com/your-username/CollabFlow.git
cd CollabFlow

# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install
```

---

### Environment Configuration

#### 1. Backend Configuration (`server/.env`)

Create a `.env` file in the `server/` directory:

```env
PORT=5000
NODE_ENV=development

# PostgreSQL Connection String
DATABASE_URL="postgresql://username:password@localhost:5432/collabflow?schema=public"

# JWT Authentication
JWT_SECRET="your-super-secure-jwt-secret-key-change-in-production"
JWT_EXPIRES_IN="7d"

# Client Application URL (for CORS validation)
CLIENT_URL="http://localhost:5173"

# Optional: GitHub Personal Access Token (for higher API rate limits)
GITHUB_ACCESS_TOKEN=""
```

#### 2. Frontend Configuration (`client/.env`)

Create a `.env` file in the `client/` directory:

```env
VITE_API_URL="http://localhost:5000/api"
VITE_WS_URL="ws://localhost:5000"
```

---

### Database Initialization

From the `server/` directory, initialize the database schema with Prisma:

```bash
# Push Prisma schema to PostgreSQL
npx prisma db push

# Generate Prisma Client types
npx prisma generate
```

---

### Running Development Servers

Run both client and server concurrently from the root directory:

```bash
# Run both Client and Server concurrently
npm run dev

# Or run separately:
# Terminal 1: Client (http://localhost:5173 or :5174)
npm run dev:client

# Terminal 2: Server API (http://localhost:5000)
npm run dev:server
```

Open your browser and navigate to:
```
http://localhost:5173
```

---

## 📋 Available Scripts

| Command | Scope | Description |
| :--- | :---: | :--- |
| `npm run dev` | Root | Starts both Vite frontend and Express backend concurrently. |
| `npm run dev:client` | Client | Starts the Vite development server with Hot Module Replacement (HMR). |
| `npm run dev:server` | Server | Starts the Express server using `tsx watch` for auto-restarts on code changes. |
| `npm run build` | Root | Compiles TypeScript and builds production bundles for client and server. |
| `npm run typecheck` | Root | Runs `tsc --noEmit` across both client and server to verify full type safety. |

---

## 🎨 Design System & UI/UX

CollabFlow is built with a **curated dark-mode glassmorphic interface**:
- **Palette:** `slate-950` canvas, `slate-900/80` cards with subtle borders, vibrant indigo/blue accents, and contextual status badges.
- **Typography:** Modern clean sans-serif hierarchy with balanced line heights and tabular numerical readouts for metrics.
- **Accessibility & Micro-Interactions:** Keyboard navigation (`Escape` closes drawers and dialogs), smooth dialog animations, and non-blocking toast notifications.
- **Responsive Layout:** Adaptive sidebar collapsible to an icon-only rail on desktop, with a smooth mobile drawer navigation menu.

---

## 🔒 Security & Tenant Isolation

- **Tenant Isolation:** Every query enforces `workspaceId` matching to prevent cross-tenant data leaks.
- **Stateless JWT Authentication:** Cryptographically signed tokens verified on every protected request.
- **Password Security:** Salted password hashing powered by `bcrypt`.
- **Zod Schema Validation:** Every incoming request body and query param is strictly validated before touching business services.
- **Graceful API Degradation:** Network interruptions to external APIs (like GitHub) fail gracefully without crashing user workflows.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
