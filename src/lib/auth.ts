import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as schema from '../db/schema';
import { db } from "../db/db";

export const auth = betterAuth({
    
    trustedOrigins: ["http://localhost:5143", "http://localhost:8008", "http://localhost:3000"],

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
    },

    advanced : {
        database: {
            generateId : () => crypto.randomUUID(),
        },
    },
});
