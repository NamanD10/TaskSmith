# TaskSmith

TaskSmith is a task scheduling and management application that leverages message queues with BullMQ and Redis for efficient background processing. It allows users to create, manage, and view tasks through a REST API.

# Tech Stack

- **Backend:** Node.js (Express)
- **Database:** PostgreSQL (managed via Prisma ORM)
- **Message Queue & Caching:** Redis with BullMQ

# Prerequisites

- Node.js & npm
- PostgreSQL
- Redis

# Getting Started

Clone the repository and install dependencies:

```bash
git clone https://github.com/NamanD10/TaskSmith.git
cd TaskSmith
npm install
npm run build
npm start
```

Configure your database and Redis connection in the `.env` file before running.
# Sample .env file
DATABASE_URL="postgres://postgres:password@db:5432/mydb"
PORT = 3000
REDIS_HOST = host_address
REDIS_PORT = 6379
REDIS_USERNAME = default
REDIS_PASSWORD = my_pwd

# API Endpoints

- `POST /tasks/create`
  - Create a task with a *title*, *description* and *status* (JSON body).
  - Status is set to "pending" by default.

- `GET /tasks`
  - Retrieve a list of all tasks.

- `GET /tasks/:id`
  - Retrieve details of a specific task.


# Contact

For questions or support, contact (namandubey10@gmail.com).