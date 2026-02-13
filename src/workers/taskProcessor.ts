import { InternalError } from "../core/CustomError";
import { getTaskById, updateTask } from "../models/taskModel";
import { makeApiCall, performDatabaseOperation, performDefaultWork, performFileOperation } from "./processFunctions";

export default async function processTask(taskId: number) {
    const task = await getTaskById(taskId);

    const startTime = Date.now();

    try {
        switch(task.type){

            case "api-call" : 
            await makeApiCall();
            break;

            case "file-operation" :
            await performFileOperation(task);
            break;

            case "database-operations" : 
            await performDatabaseOperation();
            break;
            
            default: 
            await performDefaultWork(task);
            break;
        }

        const duration = Date.now() - startTime;
        console.log(`[${new Date().toISOString()}] Completed task ${taskId} in ${duration/1000} seconds`);

        await updateTask(taskId, {
            status: 'COMPLETED',
        });
    } 
    catch(error : any) {

        throw new InternalError(`Task ${taskId} failed: ${error.message}`);
    
    }
}