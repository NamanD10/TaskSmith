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
exports.getTasks = exports.getTaskById = exports.updateTaskStatus = exports.createTask = void 0;
const client_1 = require("@prisma/client");
const extension_accelerate_1 = require("@prisma/extension-accelerate");
const prisma = new client_1.PrismaClient().$extends((0, extension_accelerate_1.withAccelerate)());
const createTask = (title, description) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.task.create({
        data: {
            title: title,
            description: description
        },
    });
});
exports.createTask = createTask;
const updateTaskStatus = (id, status) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.task.update({
        where: {
            id: id
        },
        data: {
            status: status
        },
    });
});
exports.updateTaskStatus = updateTaskStatus;
const getTaskById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.task.findUnique({
        where: {
            id: id
        }
    });
});
exports.getTaskById = getTaskById;
const getTasks = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.task.findMany();
});
exports.getTasks = getTasks;
