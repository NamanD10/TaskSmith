"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const taskRoute_1 = require("./routes/taskRoute");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/tasks', taskRoute_1.taskRouter);
exports.default = app;
