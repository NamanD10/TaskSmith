import { Job, Worker } from "bullmq";
import { connection } from "../config/redis";
import { updateTask } from "../models/taskModel";
import processTask from "./taskProcessor";
import { InternalError } from "../core/CustomError";

export const primaryWorker = new Worker(
    'taskQueue', 
    async (job:Job) => {
    
    const { taskId } = job.data;
    
    //update status to processing on 1st attempt
    if(job.attemptsMade === 0){
        await updateTask(taskId, {status: 'PROCESSING'});;
        console.log(`Task with id ${taskId}, status changed to 'PROCESSING'`);
    } else {
        await updateTask(taskId, {status: 'PROCESSING'});
        console.log(`Retry attempt #${job.attemptsMade} for task ${taskId}`);
    }

    try{
      await processTask(taskId);
    } catch (error : any) {
      throw new InternalError(`Job ${taskId} failed: ${error.message}`);
    }
}, {
    connection,
    concurrency: 5,
    autorun : false
  }, 
);
    
primaryWorker.on('completed', async(job, err) => {
  if(!job) return;

  const { taskId } = job.data;
  const attemptsMade = job.attemptsMade + 1;
  
  await updateTask(taskId, {attempts: attemptsMade});

  console.log(`Task ${job.id} completed by Bull MQ worker`);
    
});
    
primaryWorker.on('failed', async (job, err) => {
    
  if (!job) {
    console.error("Job is undefined in 'failed' event");
    return;
  }

  //?? {} is the null coalescing operator which means
  //if lhs is undefined it (taskId) falls back to {} or empty object
  const { taskId } = job?.data ?? {};
  const attemptsMade = job.attemptsMade + 1;  //job.attemptsMade is zero based (like array index)
  
    //update amt of attempts
  await updateTask(taskId, {attempts: attemptsMade});

  // if no more retries left, mark as permanently failed
  if (job.attemptsMade >= job.opts.attempts!) {   //! at the end is non-null assertion wheer we gurantee typescript that the object/property is not null
    if (taskId) {
      await updateTask(taskId, {status: 'FAILED'});
      console.error(`Task ${taskId} permanently failed after ${job.attemptsMade} attempts.`);
    }
  } else {
    console.warn(`Task ${taskId} failed attempt #${job.attemptsMade}: ${err.message}`);
  }
});

//handling any internal worker error
primaryWorker.on('error', (error : any) =>
  {console.error(`Error in primary work`, error.message)}
); 


 