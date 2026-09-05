# CollabFlow

CollabFlow is a modern, collaborative project management web application designed for agile and small teams to manage projects, assign tasks, collaborate on Kanban boards, track real-time progress, and streamline discussions.

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, React Router v7, TanStack Query v5
- **Backend:** Node.js, Express, TypeScript, Zod, CORS
- **Database / ORM:** PostgreSQL, Prisma ORM
- **Testing (upcoming):** Vitest / Supertest / Playwright

## Project Structure

```
CollabFlow/
├── client/                 # Frontend Vite + React + TypeScript application
│   ├── src/
│   │   ├── app/            # App entry, router & global providers
│   │   ├── components/ui/  # Reusable UI component library
│   │   ├── features/       # Feature-specific modules
│   │   ├── layouts/        # Page and application layouts
│   │   ├── pages/          # Application views / route targets
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utilities & centralized API client
│   │   ├── types/          # Shared TypeScript type definitions
│   │   ├── constants/      # App constants & configs
│   │   ├── assets/         # Static assets (images, icons)
│   │   ├── styles/         # Global CSS & Tailwind styles
│   │   └── main.tsx        # Application mount
│   └── package.json
├── server/                 # Backend Node.js + Express + TypeScript API
│   ├── prisma/             # Prisma schema & migrations
│   ├── src/
│   │   ├── config/         # Environment & server configuration
│   │   ├── routes/         # Express routing endpoints
│   │   ├── controllers/    # Request handlers & response formatters
│   │   ├── services/       # Business logic layer
│   │   ├── repositories/   # Data access layer
│   │   ├── middleware/     # Error handling, auth, validation
│   │   ├── schemas/        # Zod validation schemas
│   │   ├── lib/            # Utilities (logger, db client)
│   │   ├── types/          # Backend TypeScript types
│   │   ├── app.ts          # Express application initialization
│   │   └── server.ts       # Server entry point & listener
│   └── package.json
├── .gitignore
├── README.md
└── package.json            # Root workspace scripts
```

## Prerequisites

- **Node.js**: v18.0.0 or later (v20+ recommended)
- **npm**: v9.0.0 or later
- **PostgreSQL**: v14+ (for database phase)

## Getting Started

### 1. Installation

Install all client and server dependencies:

```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

### 2. Environment Configuration

Copy the example environment files:

```bash
# Client environment configuration
cp client/.env.example client/.env

# Server environment configuration
cp server/.env.example server/.env
```

### 3. Development Mode

Run client and server development servers:

```bash
# In the root directory:
npm run dev:client    # Starts Vite dev server (default: http://localhost:5173)
npm run dev:server    # Starts Express API dev server with tsx watch (default: http://localhost:5000)
```

### 4. Build & Typecheck

```bash
# Run typechecking across client and server
npm run typecheck

# Build both client and server for production
npm run build
```
