# Campus Study Group Finder

A full-stack web app for UCI students to find, create, and manage study groups.
Built for INF124 (full-stack development).

**Team:** Matthew Bautista, Steven Lee, Logan Szeto, Lance Vu

## Live Links

| Resource | URL |
|----------|-----|
| **Frontend (web app)** | https://ucistudygroups.vercel.app |
| **Backend (API)** | https://uci-study-group-finder.vercel.app |
| **Jira board** | https://mvttjb.atlassian.net/jira/software/projects/SCRUM/boards/1?atlOrigin=eyJpIjoiZTFjODU3OTIwOTYzNDU1NGFkNWIyNzAzNGZlZGE5YjAiLCJwIjoiaiJ9_ |
| **Demo video** | https://drive.google.com/file/d/1DDyvech2hTrR8Swh1LsHTCKav10FS4he/view?usp=sharing |

**Demo login:** `lance@uci.edu` / `password123`

## Tech Stack

- **Frontend:** Next.js (React) + TypeScript + Tailwind CSS + shadcn/ui — hosted on **Vercel**
- **Backend:** Node.js + Express + TypeScript — deployed as a serverless function on **Vercel**
- **Database:** PostgreSQL on **Supabase**, accessed via **Prisma** ORM
- **Auth:** JWT (jsonwebtoken) + bcrypt password hashing
- **Validation:** zod
- **External API:** [Anteater API](https://anteaterapi.com) for live UCI course data

## Architecture

See [`docs`](docs) for the C4 diagrams (System Context,
Container, and Component levels).

```
Student → Next.js web app (Vercel) → Express API (Vercel serverless) → PostgreSQL (Supabase)
                                              └→ Anteater API (UCI courses)
```

The web app calls the API over HTTPS, attaching a JWT for authenticated requests.
The API uses Prisma to read/write Supabase, and fetches course data live from the
Anteater API.

## Features

- User registration, login, and password reset (JWT auth)
- Browse & search study groups with filters (subject, day, time, size) and sorting
- View full group details (members, schedule, shared resources)
- Create a group using **live UCI course data** from the Anteater API
- Join groups (creates a request) and manage incoming requests (approve / decline)
- Personal dashboard showing groups you own or belong to
- Edit profile, manage enrolled courses, and set weekly availability
- **Authorization:** only a group's owner can edit/delete it or act on its requests
- Responsive design (mobile → desktop) and accessibility improvements (WCAG)

## API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/health` | — | Liveness + DB connectivity |
| POST | `/auth/register` | — | Create account, returns JWT |
| POST | `/auth/login` | — | Log in, returns JWT |
| POST | `/auth/reset-password` | — | Set a new password |
| GET | `/groups` | — | List groups (filter/sort/paginate) |
| GET | `/groups/:id` | — | Group detail |
| POST | `/groups` | ✓ | Create a group |
| PATCH | `/groups/:id` | ✓ owner | Update a group |
| DELETE | `/groups/:id` | ✓ owner | Delete a group |
| POST | `/groups/:id/join` | ✓ | Request to join |
| GET | `/requests` | ✓ | Pending requests for groups you own |
| POST | `/requests/:id/approve` | ✓ owner | Approve a request |
| POST | `/requests/:id/decline` | ✓ owner | Decline a request |
| GET | `/users/me` | ✓ | Current user profile |
| PATCH | `/users/me` | ✓ | Update profile |
| DELETE | `/users/me` | ✓ | Delete account |
| GET | `/users/me/groups` | ✓ | Groups you own or belong to |
| POST | `/users/me/courses` | ✓ | Enroll in a course |
| DELETE | `/users/me/courses/:code` | ✓ | Unenroll from a course |
| GET | `/users/me/availability` | ✓ | Read weekly availability |
| PUT | `/users/me/availability` | ✓ | Replace weekly availability |
| GET | `/courses/departments` | — | UCI departments |
| GET | `/courses?department=X` | — | Courses in a department (Anteater API) |

A ready-to-import **Postman collection** is at
[`docs/StudyGroupFinder.postman_collection.json`](docs/StudyGroupFinder.postman_collection.json)
(run *Auth → Login* first; it auto-saves the token).

## Local Development

### Prerequisites
- Node.js 18+
- A PostgreSQL database (local, Docker, or Supabase)

### 1. Backend (`/server`)
```bash
cd server
npm install

# Create your env file
cp .env.example .env        # then edit values (see below)

# Set up the database
npm run prisma:generate
npm run prisma:migrate      # name it "init"
npm run db:seed             # loads demo data

npm run dev                 # API on http://localhost:4000
```

**`server/.env`:**
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/studygroups?schema=public"
DIRECT_URL="postgresql://postgres:postgres@localhost:5432/studygroups?schema=public"
JWT_SECRET="<a long random string>"
JWT_EXPIRES_IN="7d"
PORT=4000
CORS_ORIGIN="http://localhost:3000"
```

> Quick local Postgres via Docker:
> ```bash
> docker run --name studygroups-db -e POSTGRES_PASSWORD=postgres \
>   -e POSTGRES_DB=studygroups -p 5432:5432 -d postgres:16
> ```

### 2. Frontend (repo root)
```bash
npm install

# Point the frontend at the API
echo 'NEXT_PUBLIC_API_URL=http://localhost:4000' > .env.local

npm run dev                 # web app on http://localhost:3000
```

## Deployment

Both the frontend and backend are deployed on **Vercel** (two projects from this repo);
the database is **Supabase** PostgreSQL.

| Assignment requirement (AWS-worded) | Our implementation |
|-------------------------------------|--------------------|
| Backend on a single service | Express serverless function on Vercel |
| Frontend served publicly | Next.js app on Vercel |
| Public HTTPS + ACM certificate | Vercel managed HTTPS (automatic) |
| CloudWatch logs | Vercel deployment & function logs |
| Secrets in SSM / EB config | Vercel environment variables |

- **Backend project:** root directory = `server/` (uses `vercel.json` to route all
  requests to the serverless Express app).
- **Frontend project:** root directory = repo root; env var
  `NEXT_PUBLIC_API_URL` = backend URL.
- **CORS:** backend `CORS_ORIGIN` env var includes the frontend URL.
- **DB migrations:** run `npm run prisma:deploy` against Supabase (uses `DIRECT_URL`).

## Accessibility & Responsive Design

- Responsive layouts from mobile to desktop (mobile nav collapses into a drawer).
- Semantic HTML, labeled form controls, ARIA labels on icon buttons, visible focus
  states, and `lang` set on `<html>`.
- Verified with the IBM Equal Access Accessibility Checker (see `/docs` for reports).

## Repository Structure

```
.
├── src/                  # Next.js frontend (app router, components, lib)
├── server/               # Express + Prisma backend
│   ├── prisma/           # schema + seed
│   └── src/              # routes, middleware, config
├── docs/                 # C4 diagrams, Postman collection, a11y reports
└── README.md
```

## Extra Credit / Notable

- Live integration with the external **Anteater API** for real UCI course data.
- Owner-based **authorization** layered on top of JWT authentication.
