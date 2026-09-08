import { jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { integer, index, pgTable, timestamp, boolean, pgEnum, text } from "drizzle-orm/pg-core";
import { randomUUID } from "crypto";

export const statusEnum = pgEnum(
    "statuses",
    ["PENDING","PROCESSING","RETRYING","COMPLETED","FAILED"]
);

export const methodEnum = pgEnum(
    "methods",
    ["GET","POST","PUT","DELETE","PATCH"]
);

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);


export const task = pgTable(
    "task", 
    {
    id: text().primaryKey().$defaultFn(() => randomUUID()),
    userId : text().references(() => user.id),
    title: text().notNull(),
    targetUrl : text().notNull(),
    scheduledAt: timestamp(),
    priority: integer().notNull().default(3),

    headers: jsonb('headers').$type<Record<string, string>>(),
    reqMethod : methodEnum().default("POST"),
    reqBody: jsonb('req_body').$type<Record<string, unknown> | string>(),
    
    attempts: integer().default(0),
    maxAttempts: integer().default(3),

    isRepeatable: boolean().default(false),
    repeatPattern: text(),
    nextRunAt: timestamp(),
    lastRunAt: timestamp(),
    repeatEnabled: boolean(),

    status: statusEnum().default("PENDING"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    }
);

export const response = pgTable(
    "response",
    {

        id : text().primaryKey(),
        taskId : text().references(() => task.id).notNull(),
        executionDate : timestamp(),
        attemptNumber : integer().default(0),
        statusCode : integer(),
        statusMessage : text(),
            
    }
)

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

//Push db changes using drizzle command - npx drizzle-kit push 
//(make sure that working dir is the one where drizzle config file resides)