"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
// config/env.ts
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
const envSchema = zod_1.z.object({
    REDIS_PORT: zod_1.z.string().min(1),
    REDIS_HOST: zod_1.z.string().min(1),
    REDIS_USERNAME: zod_1.z.string().min(1),
    REDIS_PASSWORD: zod_1.z.string().min(1),
});
const env = envSchema.parse(process.env);
exports.config = {
    redis: {
        port: parseInt(env.REDIS_PORT, 10),
        host: env.REDIS_HOST,
        username: env.REDIS_USERNAME,
        password: env.REDIS_PASSWORD,
    },
};
