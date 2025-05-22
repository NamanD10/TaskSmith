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
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskWorker = void 0;
const bullmq_1 = require("bullmq");
const redis_1 = require("../config/redis");
const taskModel_1 = require("../models/taskModel");
exports.taskWorker = new bullmq_1.Worker('taskQueue', (job) => __awaiter(void 0, void 0, void 0, function* () {
    const { taskId } = job.data;
    yield (0, taskModel_1.updateTaskStatus)(taskId, 'in progress');
    console.log("Task status changed to 'in progress'");
    yield new Promise(res => setTimeout(res, 3000));
    yield (0, taskModel_1.updateTaskStatus)(taskId, 'completed');
    console.log("Task status changed to 'completed'");
}), { connection: redis_1.connection, autorun: false });
exports.taskWorker.on('completed', (job) => {
    console.log(`Task ${job.id} completed`);
});
exports.taskWorker.on('failed', (job, err) => {
    console.error(`Task ${job === null || job === void 0 ? void 0 : job.id} failed: ${err.message}`);
});
exports.taskWorker.on('error', (error) => console.error('Worker error', error)); //handling any internal worker error
