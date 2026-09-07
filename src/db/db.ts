import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema"; 
import dotenv from "dotenv";

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set in your .env file");
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

export const db = drizzle(pool, { schema });

// Optional: verify connection on startup
pool.connect()
  .then((client) => {
    console.log("Database connected");
    client.release();
  })
  .catch((err) => {
    console.error("Database connection failed:", err.message);
  });