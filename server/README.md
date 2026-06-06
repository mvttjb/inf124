# Study Group Finder — Backend API

Node.js + Express + Prisma + PostgreSQL backend for the Campus Study Group
Finder. This is a standalone Node project; the React
frontend lives one level up in the repo root.

## Stack

- **Runtime:** Node.js + Express (TypeScript)
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Auth (Phase 4):** JWT + bcrypt
- **Validation:** zod

## Prerequisites

- Node.js 18+
- A running PostgreSQL instance (local install, Docker, or AWS RDS)

## Setup

```bash
cd server
npm install

# 1. Create your env file and edit DATABASE_URL / JWT_SECRET
cp .env.example .env

# 2. Create the database (local example)
createdb studygroups

# 3. Generate the Prisma client + create the tables
npm run prisma:generate
npm run prisma:migrate        # name the migration e.g. "init"

# 4. Load the mock data from the frontend into the DB
npm run db:seed

# 5. Start the dev server (http://localhost:4000)
npm run dev
```

Verify it works:

```bash
curl http://localhost:4000/health
# -> {"status":"ok","db":"connected"}
```

Demo login created by the seed: `lance@uci.edu` / `password123`

## Project structure

```
server/
├── prisma/
│   ├── schema.prisma     # DB schema (mirrors ../src/types)
│   └── seed.ts           # loads mock data from ../src/lib
├── src/
│   ├── config/env.ts     # env var loading/validation
│   ├── db/prisma.ts      # shared Prisma client
│   ├── middleware/        # CORS is in app.ts; error handling here
│   ├── routes/            # one router per resource
│   ├── app.ts            # Express app + middleware wiring
│   └── index.ts          # server entry point
└── .env.example
```

## API roadmap

Implemented:

- `GET /health` — liveness + DB connectivity check

Planned (Phase 3 — CRUD) — maps to the frontend's existing TODOs:

| Method | Route | Frontend consumer |
|--------|-------|-------------------|
| POST   | `/auth/register`            | register page |
| POST   | `/auth/login`               | login page |
| POST   | `/auth/reset-password`      | reset-password page |
| GET    | `/users/me`                 | dashboard / profile |
| PATCH  | `/users/me`                 | profile (PATCH /api/profile TODO) |
| DELETE | `/users/me`                 | delete account TODO |
| GET    | `/groups`                   | search/browse (filters, sort, pagination) |
| GET    | `/groups/:id`               | group details |
| POST   | `/groups`                   | create-group TODO |
| POST   | `/groups/:id/join`          | join group TODO |
| GET    | `/requests`                 | requests page |
| POST   | `/requests/:id/approve`     | requests page |
| POST   | `/requests/:id/decline`     | requests page |
| GET/PUT| `/users/me/availability`    | new /availability screen |
| GET    | `/recommendations`          | dashboard "Recommended" (optional C# service) |
```
