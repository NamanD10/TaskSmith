CREATE TYPE "public"."methods" AS ENUM('GET', 'POST', 'PUT', 'DELETE', 'PATCH');--> statement-breakpoint
CREATE TYPE "public"."statuses" AS ENUM('PENDING', 'PROCESSING', 'RETRYING', 'COMPLETED', 'FAILED');--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "tasks_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" varchar(255) NOT NULL,
	"targetUrl" varchar(255) NOT NULL,
	"scheduledAt" timestamp,
	"priority" integer DEFAULT 3 NOT NULL,
	"headers" jsonb,
	"reqMethod" "methods" DEFAULT 'GET',
	"reqBody" varchar,
	"attempts" integer DEFAULT 0,
	"maxAttempts" integer DEFAULT 3,
	"isRepeatable" boolean DEFAULT false,
	"repeatPattern" varchar,
	"nextRunAt" timestamp,
	"lastRunAt" timestamp,
	"repeatEnabled" boolean,
	"errorLog" varchar,
	"status" "statuses" DEFAULT 'PENDING',
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp
);
