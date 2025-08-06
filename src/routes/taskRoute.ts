import express from 'express';
import { createTaskHandler, getTasksHandler, getTaskByIdHandler } from '../controllers/taskController';
import asyncHandler from 'express-async-handler';

export const taskRouter = express.Router();

taskRouter.get('/:id', asyncHandler(getTaskByIdHandler));
taskRouter.post('/create', asyncHandler(createTaskHandler));
taskRouter.get('/', asyncHandler(getTasksHandler));


//add a status and a log route in this 
