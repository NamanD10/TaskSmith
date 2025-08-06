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
const env_1 = require("./env");
exports.connection = new ioredis_1.default(Object.assign(Object.assign({}, env_1.config.redis), { db: 0, maxRetriesPerRequest: null }));
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
