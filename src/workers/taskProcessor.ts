import { BadRequestError, InternalError } from "../core/CustomError";
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
        //cant send apiTask to the function due to missing id field in task.schema (zod)
        const duration = Date.now() - startTime;
        console.log(`[${new Date().toISOString()}] Completed task ${taskId} in ${duration/1000} seconds`);
        
        let nextRun = null;
        if(task.isRepeatable){
            if(!task.repeatPattern){
                throw new BadRequestError("Repeat pattern is required for repeatable jobs");
            }

            const interval = parser.parse(task.repeatPattern);
            nextRun = interval.next().toDate();
        }

        await updateTask(userId, taskId, {
            status: 'COMPLETED',
            nextRunAt : nextRun,
        });
    } 
    catch(error : any) {

        throw new InternalError(`Task ${taskId} failed: ${error.message}`);
    
    }
}