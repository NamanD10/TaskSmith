import { myQueue } from "../config/redis";
import { createTask, getTaskById, getTasks } from "../models/taskModel";
import { Request, Response } from "express";

export const createTaskHandler = async (req : Request, res: Response) => {
    const { title, description} = req.body;
    
    const task = await createTask(title ,description);

    await myQueue.add('processTask', {taskId: task.id});
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

export const getTasksHandler = async (req:Request, res:Response) => {

    const tasks = await getTasks();

    if(!tasks){
        res.status(404).json({message:"Task not found"});
    }
    res.status(201).json(tasks);
};