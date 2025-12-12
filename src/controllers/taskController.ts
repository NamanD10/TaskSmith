import { myQueue } from "../config/redis";
import z from 'zod';
import { createdTask, getTaskById, getTasks } from "../models/taskModel";
import { Request, Response } from "express";
import { BadRequestError, NotFoundError, ZodError } from "../core/CustomError";
import { taskSchema } from "../types/task.schema";

export const createTaskHandler = async (req : Request, res: Response) => {

    const task = await createdTask(req.body.title, req.body.description, req.body.type, req.body?.scheduledAt, req.body?.repeatable, req.body?.priority);
    let delayInMS = 0;
    if(task.scheduledAt !== null){
        delayInMS = task.scheduledAt.getTime() - Date.now();
    }
    await myQueue.add('processTask', {taskId: task.id}, {
        attempts: 3, //max retry attempts
        backoff : {
            type: 'exponential',
            delay: 5000,  //delay btw retries in ms
        },
        delay: delayInMS,
    });
    console.log(`Job for task id ${task.id} added`);

    res.status(201).json({
        message:`Task added successfully`, 
        task
    });
    return ;

};

export const getTaskByIdHandler = async (req:Request, res:Response) => {
    const idSchema =  z.string().regex(/^\d+$/, "ID must be a number").transform(Number);
    const parsedId = idSchema.safeParse(req.params.id);

    if (!parsedId.success) {
        throw new BadRequestError("Invalid id parameter");
    }

    const id = parsedId.data;    
    const task = await getTaskById(id);

    if(!task){
        throw new NotFoundError("Task Not Found");
    }
    res.status(200).json(task);
    return;
};

export const getTaskStatusByIdHandler = async (req:Request, res:Response) => {
    const idSchema =  z.string().regex(/^\d+$/, "ID must be a number").transform(Number);
    const parsedId = idSchema.safeParse(req.params.id);

    if (!parsedId.success) {
        throw new BadRequestError("Invalid id parameter");
    }
    
    const id = parsedId.data;
    const task = await getTaskById(id);

    if(!task){
        res.status(404).json({message:"Task not found"});
        return;
    }
    res.status(200).json(task.status);
    return;
};


export const getTasksHandler = async (req:Request, res:Response) => {

    const tasks = await getTasks();

    if(!tasks){
        throw new NotFoundError("Task list not found");
    }

    res.status(200).json(tasks);
    return;
};