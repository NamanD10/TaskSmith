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
exports.getTasksHandler = exports.getTaskStatusByIdHandler = exports.getTaskByIdHandler = exports.createTaskHandler = void 0;
const zod_1 = __importDefault(require("zod"));
const redis_1 = require("../config/redis");
const taskModel_1 = require("../models/taskModel");
const CustomError_1 = require("../core/CustomError");
const createTaskHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const taskSchema = zod_1.default.object({
        title: zod_1.default.string().min(1),
        description: zod_1.default.string().min(2),
        type: zod_1.default.string().min(2)
    });
    const parsedTask = taskSchema.safeParse(req.body);
    if (!parsedTask.success) {
        throw new CustomError_1.ZodError("Error while parsing task details");
    }
    const task = yield (0, taskModel_1.createTask)(parsedTask.data.title, parsedTask.data.description, parsedTask.data.type);
    yield redis_1.myQueue.add('processTask', { taskId: task.id }, {
        attempts: 3, //max retry attempts
        backoff: {
            type: 'exponential',
            delay: 5000, //delay btw retries in ms
        }
    });
    console.log(`Job for task id ${task.id} added`);
    res.status(201).json({
        message: `Task added successfully`,
        task
    });
    return;
});
exports.createTaskHandler = createTaskHandler;
const getTaskByIdHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const idSchema = zod_1.default.string().regex(/^\d+$/, "ID must be a number").transform(Number);
    const parsedId = idSchema.safeParse(req.params.id);
    if (!parsedId.success) {
        throw new CustomError_1.BadRequestError("Invalid id parameter");
    }
    const id = parsedId.data;
    const task = yield (0, taskModel_1.getTaskById)(id);
    if (!task) {
        throw new CustomError_1.NotFoundError("Task Not Found");
    }
    res.status(200).json(task);
    return;
});
exports.getTaskByIdHandler = getTaskByIdHandler;
const getTaskStatusByIdHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const idSchema = zod_1.default.string().regex(/^\d+$/, "ID must be a number").transform(Number);
    const parsedId = idSchema.safeParse(req.params.id);
    if (!parsedId.success) {
        throw new CustomError_1.BadRequestError("Invalid id parameter");
    }
    const id = parsedId.data;
    const task = yield (0, taskModel_1.getTaskById)(id);
    if (!task) {
        res.status(404).json({ message: "Task not found" });
        return;
    }
    res.status(200).json(task.status);
    return;
});
exports.getTaskStatusByIdHandler = getTaskStatusByIdHandler;
const getTasksHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tasks = yield (0, taskModel_1.getTasks)();
    if (!tasks) {
        throw new CustomError_1.NotFoundError("Task list not found");
    }
    res.status(200).json(tasks);
    return;
});
exports.getTasksHandler = getTasksHandler;
