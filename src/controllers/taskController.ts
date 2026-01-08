import z from 'zod';
import { createdTask, deleteTask, getTaskById, getTasks, updateTask } from "../models/taskModel";
import { Request, Response } from "express";
import { BadRequestError, NotFoundError, ZodError } from "../core/CustomError";
import { taskUpdateSchema } from "../types/task.schema";
import { addImmediateJob, addRepeatableJob, addScheduledJob } from '../jobs/jobHandlers';

export const createTaskHandler = async (req : Request, res: Response) => {

    const {title, description, type, isRepeatable, scheduledAt, repeatPattern, priority} = req.body;

    if(scheduledAt && repeatPattern){
        throw new BadRequestError("A task cannot be both scheduled and repeatable");
    }
    
    const task = await createdTask(
        title,
        description,
        type,
        isRepeatable,
        scheduledAt ? new Date(scheduledAt) : null,
        repeatPattern ? repeatPattern : null,
        priority,
    );

    if(task.isRepeatable){
        await addRepeatableJob(task);
    }
    else if(task.scheduledAt){
        await addScheduledJob(task);
    }
    else{
        await addImmediateJob(task);
    }
    
    console.log(`Job for task id ${task.id} added`);

    res.status(201).json({
        message:`Task added successfully`, 
        task
    });
    return;
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

export const updateTaskHandler = async (req: Request, res: Response) => {
    
    const idSchema =  z.string().regex(/^\d+$/, "ID must be a number").transform(Number);
    const parsedId = idSchema.safeParse(req.params.id);
    if (!parsedId.success) {
        throw new BadRequestError("Invalid id parameter for update route");
    }

    const parsedData = taskUpdateSchema.safeParse(req.body);
    if (!parsedData.success) {
        throw new BadRequestError("Invalid body for update route");
    }

    const id = parsedId.data;  
    const data = parsedData.data;
    
    const updatedTask = await updateTask(id, data);

    console.log(`Task with id ${id} updated`);

    res.status(201).json({
        message:`Task updated successfully`, 
        updatedTask
    });
    return;
}

export const deleteTaskHandler = async (req: Request, res: Response) => {
    const idSchema =  z.string().regex(/^\d+$/, "ID must be a number").transform(Number);
    const parsedId = idSchema.safeParse(req.params.id);
    if (!parsedId.success) {
        throw new BadRequestError("Invalid id parameter for update route");
    }
    const id = parsedId.data; 

    const deletedTask = await deleteTask(id);

    console.log(`Task with id ${id} deleted`);

    res.status(200).json({
        message: 'Task deleted successfully',
        deletedTask
    });
}