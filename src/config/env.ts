import dotenv from 'dotenv';
import { z } from 'zod';
import path from 'path';
import { pick } from 'lodash';

dotenv.config({ path: 'D:/Coding/Programs/Backend/TaskSmith/.env' });

const envSchema = z.object({
  REDIS_PORT: z.string().min(1),
  REDIS_HOST: z.string().min(1),
  REDIS_USERNAME: z.string().min(1),
  REDIS_PASSWORD: z.string().min(1),
});


const envVars = pick(process.env, [
  'REDIS_PORT',
  'REDIS_HOST',
  'REDIS_USERNAME',
  'REDIS_PASSWORD'
]);

const parsedEnv = envSchema.safeParse(envVars);
if (!parsedEnv.success) {
        throw new Error("Env is not parsed safely");
        
    }

export const config = {
  redis: {
    port: parseInt(parsedEnv.data.REDIS_PORT, 10),
    host: parsedEnv.data.REDIS_HOST,
    username: parsedEnv.data.REDIS_USERNAME,
    password: parsedEnv.data.REDIS_PASSWORD,
  },
};
