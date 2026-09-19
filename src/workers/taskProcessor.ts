import { BadRequestError, InternalError } from "../core/CustomError";
import { user } from "../db/schema";
import { getTaskById, updateTask } from "../models/taskModel";
import { makeApiCall } from "./processFunctions";
import parser from 'cron-parser';

export default async function processTask(userId: string, taskId: string) {
    const task = await getTaskById(userId, taskId);
    const apiTask = {
        targetUrl : task.targetUrl,
        headers : task.headers,
        reqMethod : task.reqMethod,
        reqBody : task.reqBody
    };

    const startTime = Date.now();

    try {
        await makeApiCall(taskId, apiTask);
        //cant just send apiTask to the function due to missing id field in task.schema (zod)
        const endTime = new Date();
        const duration = endTime.getTime() - startTime;
        console.log(`[${new Date().toISOString()}] Completed task ${taskId} in ${duration/1000} seconds`);
        
        let nextRun = null;
        if(task.isRepeatable){
            if(!task.repeatPattern){
                throw new BadRequestError("Repeat pattern is required for repeatable jobs");
            }

            const interval = parser.parse(task.repeatPattern);
            nextRun = interval.next().toDate();
            await updateTask(userId, taskId, {
                attempts : 0
            });
        }
        
        await updateTask(userId, taskId, {
            status: 'COMPLETED',
            nextRunAt : nextRun,
            lastRunAt : endTime
        });
    } 
    catch(error : any) {
        throw new InternalError(`Task ${taskId} failed: ${error.message}`);
    }
};