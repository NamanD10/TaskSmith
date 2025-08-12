import z from "zod";
import { myQueue } from "../config/redis";
import { createTask, getTaskById, getTasks } from "../models/taskModel";
import { Request, Response } from "express";

export const createTaskHandler = async (req : Request, res: Response) => {
    const taskSchema = z.object({
        title: z.string().min(1),
        description: z.string().min(2),
        type: z.string().min(2)
    });

    const parsedTask = taskSchema.safeParse(req.body);
    if(!parsedTask.success){
        res.status(400).json({ 
            message: "Bad request", 
            errors: parsedTask.error,   
        });
        return;
    }
    const task = await createTask(parsedTask.data.title, parsedTask.data.description, parsedTask.data.type);

    await myQueue.add('processTask', {taskId: task.id}, {
        attempts: 3, //max retry attempts
        backoff : {
            type: 'exponential',
            delay: 5000,  //delay btw retries in ms
        }
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
        res.status(400).json({ 
            message: "Invalid id parameter",
            errors: parsedId.error, 
        });
        return;
    }

    const id = parsedId.data;    
    const task = await getTaskById(id);

    if(!task){
        res.status(404).json({message:"Task not found"});
        return;
    }
    res.status(200).json(task);
    return;
};

export const getTaskStatusByIdHandler = async (req:Request, res:Response) => {
    const idSchema =  z.string().regex(/^\d+$/, "ID must be a number").transform(Number);
    const parsedId = idSchema.safeParse(req.params.id);

    if (!parsedId.success) {
        res.status(400).json({ 
            message: "Invalid id parameter",
            errors: parsedId.error, 
        });
        return;
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
        res.status(404).json({message:"Task not found"});
        return 
    }

    res.status(200).json(tasks);
    return;
};