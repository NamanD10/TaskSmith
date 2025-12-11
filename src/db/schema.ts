import { integer, pgTable, timestamp, varchar, pgEnum } from "drizzle-orm/pg-core";

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
    status: statusEnum().default("PENDING"),
    attempts: integer().default(0),
    maxAttempts: integer().default(3),
    scheduledAt: timestamp(),
    completedAt: timestamp(),
    errorLog: varchar(),
    createdAt: timestamp().defaultNow(),
    updatedAt: timestamp(),
    }
);


//NEXT STEP: To write query functions