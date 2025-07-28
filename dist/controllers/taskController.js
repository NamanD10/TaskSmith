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
exports.getTasksHandler = exports.getTaskStatusByIdHandler = exports.getTaskByIdHandler = exports.createTaskHandler = void 0;
const redis_1 = require("../config/redis");
const taskModel_1 = require("../models/taskModel");
const createTaskHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, type } = req.body;
    const task = yield (0, taskModel_1.createTask)(title, description, type);
    yield redis_1.myQueue.add('processTask', { taskId: task.id }, {
        attempts: 3, //max retry attempts
        backoff: {
            type: 'exponential',
            delay: 5000, //delay btw retries in ms
        }
    });
    console.log(`Job for task id ${task.id} added`);
    res.status(201).json({ message: `Task added successfully`, task });
});
exports.createTaskHandler = createTaskHandler;
const getTaskByIdHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        res.status(400).json({ message: 'Invalid id parameter' });
    }
    const task = yield (0, taskModel_1.getTaskById)(id);
    if (!task) {
        res.status(404).json({ message: "Task not found" });
    }
    res.status(201).json(task);
});
exports.getTaskByIdHandler = getTaskByIdHandler;
const getTaskStatusByIdHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid id parameter' });
    }
    const task = yield (0, taskModel_1.getTaskById)(id);
    if (!task) {
        return res.status(404).json({ message: "Task not found" });
    }
    res.status(201).json(task.status);
});
exports.getTaskStatusByIdHandler = getTaskStatusByIdHandler;
const getTasksHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tasks = yield (0, taskModel_1.getTasks)();
    if (!tasks) {
        res.status(404).json({ message: "Task not found" });
    }
    res.status(201).json(tasks);
});
exports.getTasksHandler = getTasksHandler;
