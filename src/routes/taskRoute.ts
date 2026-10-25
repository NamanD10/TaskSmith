import express from 'express';
import { createTaskHandler, getTasksHandler, getTaskByIdHandler, updateTaskHandler, deleteTaskHandler, getTasksByTypeHandler, getUpcomingRunsHandler } from '../controllers/taskController';
import asyncHandler from 'express-async-handler';
import { validate } from '../middlewares/validate';
import { taskSchema, taskUpdateSchema } from '../types/task.schema';

export const taskRouter = express.Router();

taskRouter.get('/stats', asyncHandler(getTasksByTypeHandler));
taskRouter.get('/upcoming-runs', asyncHandler(getUpcomingRunsHandler));
taskRouter.get('/:id', asyncHandler(getTaskByIdHandler));
taskRouter.post('/create', validate(taskSchema), asyncHandler(createTaskHandler));
taskRouter.get('/', asyncHandler(getTasksHandler));
taskRouter.put('/:id', validate(taskUpdateSchema), asyncHandler(updateTaskHandler));
taskRouter.delete('/:id', asyncHandler(deleteTaskHandler));
