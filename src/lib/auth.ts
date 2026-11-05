import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as schema from '../db/schema';
import { db } from "../db/db";
import dotenv from "dotenv";

dotenv.config();
const FRONTEND_URL = process.env.FRONTEND_URL!;
const FRONTEND_CUSTOM_URL = process.env.FRONTEND_CUSTOM_URL!;
const origins = [FRONTEND_URL, FRONTEND_CUSTOM_URL];
if (process.env.NODE_ENV !== "production") origins.push("http://localhost:3000");

export const auth = betterAuth({
    
    trustedOrigins: origins,

    database: drizzleAdapter(db, {
        provider: "pg",
        schema
    }),

    emailAndPassword: { 
        enabled: true, 
    }, 

    socialProviders: { 
        github: { 
            clientId: process.env.GITHUB_CLIENT_ID! as string, 
            clientSecret: process.env.GITHUB_CLIENT_SECRET! as string, 
        }, 

         google: { 
            prompt : "select_account",
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
    },

    account: {
        accountLinking: {
            enabled: true,
            trustedProviders: ["google", "github"]
        }
    },

    advanced : {
        database: {
            generateId : () => crypto.randomUUID(),
        },
    },
});