import { myQueue } from "../config/redis";
import { createTask, getTaskById, getTasks } from "../models/taskModel";
import { Request, Response } from "express";

export const createTaskHandler = async (req : Request, res: Response) => {
    const { title, description, type} = req.body;
    
    const task = await createTask(title ,description, type);

    await myQueue.add('processTask', {taskId: task.id}, {
        attempts: 3, //max retry attempts
        backoff : {
            type: 'exponential',
            delay: 5000,  //delay btw retries in ms
        }
    });
    console.log(`Job for task id ${task.id} added`);

    res.status(201).json({message:`Task added successfully`, task});

};

export const getTaskByIdHandler = async (req:Request, res:Response) => {
    const id = parseInt(req.params.id);
    if(isNaN(id)){
        res.status(400).json({message:'Invalid id parameter'});
    }

    const task = await getTaskById(id);

    if(!task){
        res.status(404).json({message:"Task not found"});
    }
    res.status(201).json(task);
};

export const getTaskStatusByIdHandler = async (req:Request, res:Response) => {
    const id = parseInt(req.params.id);
    if(isNaN(id)){
        return res.status(400).json({message:'Invalid id parameter'});
    }

    const task = await getTaskById(id);

    if(!task){
        return res.status(404).json({message:"Task not found"});
    }
    res.status(201).json(task.status);
};


export const getTasksHandler = async (req:Request, res:Response) => {

    const tasks = await getTasks();

    if(!tasks){
        res.status(404).json({message:"Task not found"});
    }
    res.status(201).json(tasks);
};