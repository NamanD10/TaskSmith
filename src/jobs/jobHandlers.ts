import { myQueue } from "../config/redis";
import { Queue } from "bullmq";
import parser from 'cron-parser';
import { Task } from "../types/task.schema";
import { BadRequestError } from "../core/CustomError";
import { updateTask} from "../models/taskModel";

export async function addImmediateJob(task : any) { 
    await myQueue.add('processTask',
        {taskId: task.id},
        {
            attempts: 3, 
            backoff : {
                type: 'exponential',
                delay: 5000,  //delay btw retries in ms
            },
            priority: task.priority,
        }
    );
}

export async function addScheduledJob(task: any) {
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
        priority: task.priority,
    });
}

export async function addRepeatableJob(task: any) { 
    if(!task.repeatPattern){
        throw new BadRequestError("Repeat pattern is required for repeatable jobs");
    }

    await myQueue.add(
        'processRepeatableTask',
        {taskId: task.id},
        {
            repeat: {
                pattern: task.repeatPattern,
            },
             attempts: 3, //max retry attempts
            backoff : {
                type: 'exponential',
                delay: 5000,  //delay btw retries in ms
            },
            priority: task.priority,
        }
    );

    //parsing cron expression to calculate next run time
    const interval = parser.parse(task.repeatPattern);
    const nextRun = interval.next().toDate();

    await updateTask(task.id, {
        nextRunAt: nextRun
    });
}
