import { integer, pgTable, timestamp, varchar, boolean, pgEnum } from "drizzle-orm/pg-core";

export const statusEnum = pgEnum(
    "statuses",
    ["PENDING","PROCESSING","RETRYING","COMPLETED","FAILED"]
);

export const taskTable = pgTable(
    "tasks", 
    {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    title: varchar({ length: 255 }).notNull(),
    description: varchar({ length: 255 }).notNull(),
    type: varchar({ length: 255 }).notNull(),
    scheduledAt: timestamp(),
    priority: integer().default(3),
    
    attempts: integer().default(0),
    maxAttempts: integer().default(3),

    isRepeatable: boolean().default(false),
    repeatPattern: varchar(),
    nextRunAt: timestamp(),
    lastRunAt: timestamp(),
    repeatEnabled: boolean(),

    errorLog: varchar(),
    status: statusEnum().default("PENDING"),
    createdAt: timestamp().defaultNow(),
    updatedAt: timestamp(),
    
    }
);


//NEXT STEP: Push db changes using drizzle command 