# TaskSmith

TaskSmith is a task scheduling and management application that leverages message queues with BullMQ and Redis for efficient background processing. It allows users to create, manage, and view tasks through a REST API. Built with Node.js, Express, PostgreSQL, and Redis, TaskSmith provides a robust solution for handling asynchronous task processing at scale.

# Features

- **High Performance**: Processes
- **Fleible Scheduling**: One-time, delayed, or recurring (cron) jobs
- **Priority Queues**: Critical tasks get processed first 
- **Retry Mechanism**: Automatic retries upon failure in job processing
- **Distributed Workers**: For easy scaling of the system
- **Persistent Storage**: All tasks are stored in a Postgres DB
- **Docker Ready**: One command deployment

# Use Cases 

- Email campaigns with scheduled delivery
- Database operations 
- Background image/video processing
- Periodic report generation

# Tech Stack

- **Backend:** Node.js (Express)
- **Database:** PostgreSQL (managed via Drizzle ORM)
- **Message Queue & Caching:** Redis with BullMQ

# Prerequisites

- Node.js & npm
- PostgreSQL
- Redis

# Getting Started

1. Clone the repository:

```bash
git clone https://github.com/NamanD10/TaskSmith.git
cd TaskSmith
npm install

```
2. Install dependencies

```bash
npm install
```

3. Configure your database and Redis connection in the `.env` file before running.
# Sample .env file
DATABASE_URL="postgres://postgres:password@db:5432/mydb"
PORT = 3000
REDIS_HOST = host_address
REDIS_PORT = 6379
REDIS_USERNAME = default
REDIS_PASSWORD = my_pwd

4. Build and start the application
```bash
npm run build
npm start
```

# API Endpoints

- `POST /tasks/create`
Example of a one-time immediate task
```bash
  POST /tasks/create
  {
    "title": "Example immediate task ",
    "description": "Example task for the API",
    "type": "Email",
    "isRepeatable": false,
    "priority" : 3    //1-3 1 being the highest
  }
```
Example of a scheduled task
```bash
  POST /tasks/create
  {
    "title": "Example scheduled task ",
    "description": "Example scheduled task for the API",
    "type": "Email",
    "scheduledAt": "Jan 08 2026 16:15:00",   //date in the simple JS Date object format 
    "isRepeatable": false,
    "priority" : 3    //1-3 1 being the highest
  }
```

Example of a repeatable (cron job) task
```bash
  POST /tasks/create
  {
    "title": "Example repeatable task ",
    "description": "Example repeatable task for the API",
    "type": "Email",
    "isRepeatable": true,
    "repeatPattern": "0 12 * * *"     //cron pattern
    "priority" : 3    //1-3 (1 = highest)
  }
```

- `GET /tasks`
  - Retrieve a list of all tasks.

- `GET /tasks/:id`
  - Retrieve details of a specific task.

- `DELETE /tasks/:id`
  - Delete a task

- `PUT /tasks/:id`
  - Update the task data 
// It is not recommended to use the PUT request without proper study of the codebase

- `GET /queue/stats` 
  - Get the queue statistics, involving information like active, pending, delayed, completed or failed jobs and some other      metrics.

# Contact
For questions or support, contact (namandubey10@gmail.com).