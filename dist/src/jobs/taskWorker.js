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
exports.emailWorker = void 0;
const bullmq_1 = require("bullmq");
const redis_1 = require("../config/redis");
const taskModel_1 = require("../models/taskModel");
exports.emailWorker = new bullmq_1.Worker('taskQueue', (job) => __awaiter(void 0, void 0, void 0, function* () {
    const { taskId } = job.data;
    //update status to processing on 1st attempt
    if (job.attemptsMade === 0) {
        yield (0, taskModel_1.updateTaskStatus)(taskId, 'PROCESSING');
        console.log("Task status changed to 'PROCESSING'");
    }
    else {
        yield (0, taskModel_1.updateTaskStatus)(taskId, 'PROCESSING');
        console.log(`Retry attempt #${job.attemptsMade} for task ${taskId}`);
    }
    //simulating processing
    yield new Promise(res => setTimeout(res, 3000));
    //you can write your own working here
    //fake error for testing retry 
    if (Math.random() < 0.5)
        throw new Error("Simulated error");
    yield (0, taskModel_1.updateTaskStatus)(taskId, 'COMPLETED');
    console.log("Task status changed to 'COMPLETED'");
}), {
    connection: redis_1.connection,
    autorun: false
});
exports.emailWorker.on('completed', (job, err) => __awaiter(void 0, void 0, void 0, function* () {
    if (!job)
        return;
    const { taskId } = job.data;
    const attemptsMade = job.attemptsMade + 1;
    yield (0, taskModel_1.updateTaskAttempts)(taskId, attemptsMade);
    console.log(`Task ${job.id} completed by Bull MQ worker`);
}));
exports.emailWorker.on('failed', (job, err) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!job) {
        console.error("Job is undefined in 'failed' event");
        return;
    }
    //?? {} is the null coalescing operator which means
    //if lhs is undefined it (taskId) falls back to {} or empty object
    const { taskId } = (_a = job === null || job === void 0 ? void 0 : job.data) !== null && _a !== void 0 ? _a : {};
    const attemptsMade = job.attemptsMade + 1; //job.attemptsMade is zero based (like array index)
    //update amt of attempts
    yield (0, taskModel_1.updateTaskAttempts)(taskId, attemptsMade);
    // if no more retries left, mark as permanently failed
    if (job.attemptsMade >= job.opts.attempts) { //! at the end is non-null assertion wheer we gurantee typescript that the object/property is not null
        if (taskId) {
            yield (0, taskModel_1.updateTaskStatus)(taskId, 'FAILED');
            console.error(`Task ${taskId} permanently failed after ${job.attemptsMade} attempts.`);
        }
    }
    else {
        console.warn(`Task ${taskId} failed attempt #${job.attemptsMade}: ${err.message}`);
    }
}));
exports.emailWorker.on('error', (error) => console.error('Worker error', error)); //handling any internal worker error
