import express from 'express';
import { createTaskHandler, getTasksHandler, getTaskByIdHandler } from '../controllers/taskController';

export const taskRouter = express.Router();

taskRouter.get('/:id', getTaskByIdHandler);

taskRouter.post('/create', createTaskHandler);

taskRouter.get('/', getTasksHandler);

//add a status and a log route in this 
