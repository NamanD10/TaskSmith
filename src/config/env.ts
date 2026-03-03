import dotenv from 'dotenv';
import { z } from 'zod';
import { pick } from 'lodash';

dotenv.config();

const envSchema = z.object({
  REDIS_PORT: z.string().default('6379'),
  REDIS_HOST: z.string().default('localhost'),
  REDIS_USERNAME: z.string().optional().default('default'),
  REDIS_PASSWORD: z.string().optional().default(''), // Allow empty password
});


const envVars = pick(process.env, [
  'REDIS_PORT',
  'REDIS_HOST',
  'REDIS_USERNAME',
  'REDIS_PASSWORD'
]);

const parsedEnv = envSchema.safeParse(envVars);
if (!parsedEnv.success) {
      console.error('❌ Environment validation failed:');
      console.error('Expected variables:', Object.keys(envSchema.shape));
      console.error('Received:', envVars);
      console.error('Errors:', parsedEnv.error);
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
