"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.myQueue = exports.connection = void 0;
const bullmq_1 = require("bullmq");
const ioredis_1 = __importDefault(require("ioredis"));
// const client = createClient({
//     username: 'default',
//     password: '6CwNVcym1ZXo4QtgSX1E7432CYtTNJqo',
//     socket: {
//         host: 'redis-15848.c232.us-east-1-2.ec2.redns.redis-cloud.com',
//         port: 15848
//     }
// });
exports.connection = new ioredis_1.default({
    port: 15848, // Redis port
    host: 'redis-15848.c232.us-east-1-2.ec2.redns.redis-cloud.com', // Redis host
    username: "default", // needs Redis >= 6
    password: '6CwNVcym1ZXo4QtgSX1E7432CYtTNJqo',
    db: 0, // Defaults to 0,
    maxRetriesPerRequest: null, //bull mq and io redis connection error fix 
});
exports.connection.on('connect', () => console.log('Redis connected successfully'));
exports.connection.on('error', err => console.log('Redis Client Error', err));
const test = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.connection.set('foo', 'bar');
        const result = yield exports.connection.get('foo');
        console.log('Redis connection value', result); // >>> bar
    }
    catch (err) {
        console.log('Error while testing redis', err);
    }
});
test();
exports.myQueue = new bullmq_1.Queue('taskQueue', { connection: exports.connection });
