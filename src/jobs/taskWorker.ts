
import { Job, Worker } from "bullmq";
import { connection, myQueue } from "../config/redis";
import { updateTaskStatus } from "../models/taskModel";


export const taskWorker = new Worker('taskQueue', async (job:Job) =>{
    
    const { taskId } = job.data;

    await updateTaskStatus(taskId, 'in progress');
    console.log("Task status changed to 'in progress'");

    await new Promise(res => setTimeout(res, 3000));

    await updateTaskStatus(taskId, 'completed');
    console.log("Task status changed to 'completed'");
}, {connection, autorun : false}, 
);
    
    taskWorker.on('completed', (job) => {
        console.log(`Task ${job.id} completed by Bull MQ worker`);
    });
    
    taskWorker.on('failed', (job, err) => {
        console.error(`Task ${job?.id} failed: ${err.message}`);
    });

    taskWorker.on('error', (error) =>
    console.error('Worker error' ,error)
    ); //handling any internal worker error