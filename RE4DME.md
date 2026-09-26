# TaskSmith

TaskSmith is a hosted webhook/cron scheduler for developers. Users define a target URL, an HTTP method, headers, and a body, and TaskSmith reliably calls that URL — once, on a delay, or on a recurring cron schedule — with automatic retries, backoff, and per-execution logging. Built with Node.js, Express, PostgreSQL, and Redis (BullMQ), it's a lightweight, self-hostable alternative to services like cron-job.org, EasyCron, or Upstash QStash.

# Features

- **Authentication**: Email/password sign-up plus GitHub OAuth, powered by better-auth. Every task is scoped to the authenticated user.
- **Flexible Scheduling**: One-time (immediate), delayed/scheduled, or recurring (cron) HTTP calls to a target URL.
- **Priority Queues**: Critical tasks get processed first (Priority 1-3, 1 = highest).
- **Retry Mechanism**: Automatic retries with exponential backoff on failure.
- **Distributed Workers**: 4 BullMQ workers, each with a concurrency of 5 (20 jobs in flight at once), all sharing the same queue.
- **Execution Logging**: Every HTTP call TaskSmith makes is recorded in a `response` table — status code, duration, response body/headers (or error code/message on failure).
- **SSRF Protection**: Target URLs pointing at `localhost`, loopback, or private (`10.x`, `192.168.x`) addresses are rejected at validation time.
- **Persistent Storage**: All tasks, executions, and auth data are stored in PostgreSQL (via Drizzle ORM).
- **Docker Ready**: One command deployment.

# Use Cases

- Scheduled or delayed webhook delivery
- Periodic health checks / uptime pings against an API
- Cron-triggered HTTP calls (reports, syncs, cleanup jobs) against your own services
- Any "hit this URL on a schedule, with retries" workflow

# Tech Stack

- **Backend:** Node.js (Express)
- **Auth:** better-auth (email/password + GitHub OAuth)
- **Database:** PostgreSQL (managed via Drizzle ORM)
- **Message Queue & Caching:** Redis with BullMQ
- **HTTP dispatch:** Axios

# Architecture

```mermaid
graph TB
    Client["👤 Client"]

    Client -->|"/api/auth/*"| Auth["better-auth<br/>(email/password, GitHub OAuth)"]
    Client -->|POST /tasks/create| AuthMW["requireAuth middleware"]
    Client -->|GET /tasks, /tasks/:id| AuthMW
    Client -->|PUT /DELETE /tasks/:id| AuthMW
    Client -->|GET /queue/stats| AuthMW

    AuthMW -->|session valid| ExpressApp["Express Server"]
    ExpressApp --> TaskRouter["Task Router"]
    ExpressApp --> QueueRouter["Queue Router"]

    TaskRouter --> TaskCtrl["Task Controller"]
    QueueRouter --> QueueCtrl["Queue Controller"]

    TaskCtrl -->|Validate| Zod["Zod Schema<br/>(title, targetUrl, reqMethod,<br/>headers, reqBody, priority...)"]
    Zod -->|Valid| Persist["Insert task<br/>(Postgres)"]

    Persist --> JobHandler["Job Handlers"]
    JobHandler -->|Immediate| Queue["🔴 BullMQ Queue<br/>Attempts: 3<br/>Backoff: exponential"]
    JobHandler -->|Scheduled (delay)| Queue
    JobHandler -->|Repeatable (cron)| Queue

    QueueCtrl --> Queue

    Queue -->|Pick Job| W1["Worker 1<br/>concurrency: 5"]
    Queue -->|Pick Job| W2["Worker 2<br/>concurrency: 5"]
    Queue -->|Pick Job| W3["Worker 3<br/>concurrency: 5"]
    Queue -->|Pick Job| W4["Worker 4<br/>concurrency: 5"]

    W1 -->|Status: PROCESSING| Processor["Task Processor<br/>taskProcessor.ts"]
    W2 -->|Status: PROCESSING| Processor
    W3 -->|Status: PROCESSING| Processor
    W4 -->|Status: PROCESSING| Processor

    Processor -->|"axios call to task.targetUrl"| ApiCall["makeApiCall<br/>HTTP request via Axios"]

    ApiCall -->|Log result| ResponseModel["Response Model<br/>insertResponse"]
    ApiCall --> Update["Update Task Status"]

    Update -->|COMPLETED| TaskModel["Task Model<br/>updateTask"]
    Update -->|FAILED| TaskModel
    Update -->|RETRYING| TaskModel

    ResponseModel --> ORM["Drizzle ORM"]
    TaskModel --> ORM

    ORM --> DB["🐘 PostgreSQL<br/>task / response / user tables"]

    Queue -.->|Backed by| Redis["🔴 Redis"]

    style Client fill:#e1f5ff,stroke:#01579b
    style ExpressApp fill:#fff3e0,stroke:#e65100
    style Queue fill:#ffebee,stroke:#b71c1c
    style W1 fill:#c8e6c9,stroke:#1b5e20
    style W2 fill:#c8e6c9,stroke:#1b5e20
    style W3 fill:#c8e6c9,stroke:#1b5e20
    style W4 fill:#c8e6c9,stroke:#1b5e20
    style Processor fill:#fff9c4,stroke:#f57f17
    style DB fill:#f3e5f5,stroke:#4a148c
    style Redis fill:#ffebee,stroke:#b71c1c
    style Auth fill:#e8eaf6,stroke:#283593
```

# Getting Started

1. Clone the repository:

```bash
git clone https://github.com/NamanD10/TaskSmith.git
cd TaskSmith
```

2. Install dependencies

```bash
npm install
```

3. Configure your database, Redis, and auth connection in the `.env` file before running.

Sample `.env` file
```bash
DATABASE_URL="postgres://postgres:password@db:5432/mydb"
PORT=3000

REDIS_HOST=host_address
REDIS_PORT=6379
REDIS_USERNAME=default
REDIS_PASSWORD=my_pwd

# GitHub OAuth (used by better-auth's social login)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

4. Push the database schema (creates the `user`, `session`, `account`, `verification`, `task`, and `response` tables):

```bash
npx drizzle-kit push
```

5. Build and start the application

```bash
npm run build
npm start
```

# Docker Setup

1. Clone the repository:

```bash
git clone https://github.com/NamanD10/TaskSmith.git
cd TaskSmith
```

2. Start the stack

```bash
docker compose up
```

This will start:
- Redis server
- TaskSmith API server

The API will be available at `http://localhost:3000`.

NOTE — If you want to run Postgres locally instead of a managed instance, uncomment the relevant lines in `docker-compose.yaml`.

# Authentication

All `/tasks/*` and `/queue/*` routes require an authenticated session (handled by `requireAuth`). Auth itself is handled by better-auth under `/api/auth/*`, supporting:
- Email + password sign-up/sign-in
- GitHub OAuth

Requests without a valid session receive a `401 Unauthorized`.

# API Endpoints

All examples below assume you've already authenticated and are sending the session cookie/token issued by better-auth.

- `POST /tasks/create`

Example of a one-time immediate task
```bash
  POST /tasks/create
  {
    "userId": "<your-user-id>",
    "title": "Ping health endpoint",
    "targetUrl": "https://api.example.com/health",
    "reqMethod": "GET",
    "isRepeatable": false,
    "priority": 2
  }
```

Example of a scheduled task
```bash
  POST /tasks/create
  {
    "userId": "<your-user-id>",
    "title": "Send delayed webhook",
    "targetUrl": "https://api.example.com/webhook",
    "reqMethod": "POST",
    "scheduledAt": "2026-01-08T16:15:00Z",
    "isRepeatable": false,
    "priority": 3,
    "headers": { "Content-Type": "application/json" },
    "reqBody": { "event": "reminder" }
  }
```

Example of a repeatable (cron job) task
```bash
  POST /tasks/create
  {
    "userId": "<your-user-id>",
    "title": "Nightly sync",
    "targetUrl": "https://api.example.com/sync",
    "reqMethod": "POST",
    "isRepeatable": true,
    "repeatPattern": "0 12 * * *",
    "priority": 3
  }
```

Field notes:
- `targetUrl` must be `http`/`https` and cannot point at localhost or a private/internal address.
- `reqMethod` is one of `GET`, `POST`, `PUT`, `PATCH`, `DELETE`.
- `headers` and `reqBody` are optional; `reqBody` can be a JSON object or a raw string (max 50,000 chars).
- A task cannot be both `scheduledAt` and `repeatPattern` at the same time.

Common cron patterns
- `* * * * *` - Every minute
- `*/5 * * * *` - Every 5 minutes
- `0 * * * *` - Every hour
- `0 9 * * *` - Daily at 9 AM
- `0 9 * * 1` - Every Monday at 9 AM
- `0 0 1 * *` - First day of every month

- `GET /tasks`
  - Retrieve all tasks belonging to the authenticated user.

- `GET /tasks/:id`
  - Retrieve details of a specific task (including status, attempts, and schedule info).

- `PUT /tasks/:id`
  - Update the task data (partial update; same fields as create).
  - // It is not recommended to use the PUT request without proper study of the codebase.

- `DELETE /tasks/:id`
  - Delete a task.

- `GET /queue/stats`
  - Get queue statistics: pending, active, completed, failed, and delayed job counts, plus recent throughput, average processing time, and success rate.

Each execution attempt against `targetUrl` is also logged to the `response` table, including status code, duration, a truncated response body/headers on non-2xx or errored calls, and error code/message on network failures.

# Contact
For questions or support, contact (namandubey10@gmail.com).