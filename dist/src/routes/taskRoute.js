"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskRouter = void 0;
const express_1 = __importDefault(require("express"));
const taskController_1 = require("../controllers/taskController");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
exports.taskRouter = express_1.default.Router();
exports.taskRouter.get('/:id', (0, express_async_handler_1.default)(taskController_1.getTaskByIdHandler));
exports.taskRouter.post('/create', (0, express_async_handler_1.default)(taskController_1.createTaskHandler));
exports.taskRouter.get('/', (0, express_async_handler_1.default)(taskController_1.getTasksHandler));
//add a status and a log route in this 
