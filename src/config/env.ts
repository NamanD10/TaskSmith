// config/env.ts
import dotenv from 'dotenv';
import { z } from 'zod';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const envSchema = z.object({
  REDIS_PORT: z.string().min(1),
  REDIS_HOST: z.string().min(1),
  REDIS_USERNAME: z.string().min(1),
  REDIS_PASSWORD: z.string().min(1),
});

const env = envSchema.parse(process.env);

export const config = {
  redis: {
    port: parseInt(env.REDIS_PORT, 10),
    host: env.REDIS_HOST,
    username: env.REDIS_USERNAME,
    password: env.REDIS_PASSWORD,
  },
};
