import express from 'express';
import { createTaskHandler, getTasksHandler, getTaskByIdHandler } from '../controllers/taskController';
import asyncHandler from 'express-async-handler';
import { validate } from '../middlewares/validate';
import { taskSchema } from '../types/task.schema';

export const taskRouter = express.Router();

taskRouter.get('/:id', asyncHandler(getTaskByIdHandler));
taskRouter.post('/create', validate(taskSchema), asyncHandler(createTaskHandler));
taskRouter.get('/', asyncHandler(getTasksHandler));


//add a status and a log route in this 
