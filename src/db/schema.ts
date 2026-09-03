import { jsonb } from "drizzle-orm/pg-core";
import { integer, pgTable, timestamp, varchar, boolean, pgEnum, text } from "drizzle-orm/pg-core";

export const statusEnum = pgEnum(
    "statuses",
    ["PENDING","PROCESSING","RETRYING","COMPLETED","FAILED"]
);

export const methodEnum = pgEnum(
    "methods",
    ["GET","POST","PUT","DELETE","PATCH"]
);

export const userTable = pgTable(
    "users",
    {
    
    id : integer().primaryKey(),
    name : varchar(),
    email : varchar().notNull(),
    password : varchar(),
    createdAt : timestamp().defaultNow(),

    }
);

export const taskTable = pgTable(
    "tasks", 
    {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId : integer().references(() => userTable.id),
    title: varchar({ length: 255 }).notNull(),
    targetUrl : varchar({ length : 255 }).notNull(),
    scheduledAt: timestamp(),
    priority: integer().notNull().default(3),

    headers: jsonb(),
    reqMethod : methodEnum().default("GET"),
    reqBody : varchar(),
    
    attempts: integer().default(0),
    maxAttempts: integer().default(3),

    isRepeatable: boolean().default(false),
    repeatPattern: varchar(),
    nextRunAt: timestamp(),
    lastRunAt: timestamp(),
    repeatEnabled: boolean(),

    status: statusEnum().default("PENDING"),
    createdAt: timestamp().defaultNow(),
    updatedAt: timestamp(),
    
    }
);

export const responseTable = pgTable(
    "responses",
    {

        id : integer().primaryKey().generatedAlwaysAsIdentity(),
        taskId : integer().references(() => taskTable.id).notNull(),
        executionDate : timestamp(),
        attemptNumber : integer().default(0),
        statusCode : integer(),
        statusMessage : text(),
            
    }
)

//Push db changes using drizzle command - npx drizzle-kit push 
//(make sure that working dir is the one where drizzle config file resides)