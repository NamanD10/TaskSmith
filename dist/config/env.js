"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
const lodash_1 = require("lodash");
dotenv_1.default.config({ path: 'D:/Coding/Programs/Backend/TaskSmith/.env' });
const envSchema = zod_1.z.object({
    REDIS_PORT: zod_1.z.string().min(1),
    REDIS_HOST: zod_1.z.string().min(1),
    REDIS_USERNAME: zod_1.z.string().min(1),
    REDIS_PASSWORD: zod_1.z.string().min(1),
});
const envVars = (0, lodash_1.pick)(process.env, [
    'REDIS_PORT',
    'REDIS_HOST',
    'REDIS_USERNAME',
    'REDIS_PASSWORD'
]);
const parsedEnv = envSchema.safeParse(envVars);
if (!parsedEnv.success) {
    throw new Error("Env is not parsed safely");
}
exports.config = {
    redis: {
        port: parseInt(parsedEnv.data.REDIS_PORT, 10),
        host: parsedEnv.data.REDIS_HOST,
        username: parsedEnv.data.REDIS_USERNAME,
        password: parsedEnv.data.REDIS_PASSWORD,
    },
};
