import { Request, Response } from "express";
import { InternalError } from "../core/CustomError";
import { myQueue } from "../config/redis";

export const getQueueStatsHandler = async (req: Request, res: Response) => {
    try{
            const [waiting, active, completed, failed, delayed] = await Promise.all([
                myQueue.getWaitingCount(),
                myQueue.getActiveCount(),
                myQueue.getCompletedCount(),
                myQueue.getFailedCount(),
                myQueue.getDelayedCount(),
            ]);
            const total = waiting + active + completed + failed + delayed;
            
            const successRate = completed + failed > 0
            ? ((completed / (completed + failed))*100).toFixed(2)
            : 0
            
            const jobs = await myQueue.getJobs('completed', 0, 100);
            const recentJobs = jobs.filter((job) =>
                job.finishedOn && 
                (Date.now() - job.finishedOn) < 5 * 60 * 1000
            );

            const throughput = (recentJobs.length / 5).toFixed(1);

            const processedTimes = recentJobs
            .filter((job) => job.finishedOn && job.processedOn)
            .map((job) => (job.finishedOn! - job.processedOn!) / 1000);
    
            const avgProcessingTime = processedTimes.length > 0 
            ? (processedTimes.reduce((a,b) => a+b, 0) / processedTimes.length)
            : 0;
    
            res.status(201)
            .json({
                queue: {
                    pending: waiting,
                    active: active,
                    completed: completed,
                    failed: failed,
                    delayed: delayed,
                    total: total
              
                },
                performance: {
                    throughput: throughput,
                    avgProcessingTime: avgProcessingTime,
                    successRate: successRate
                },
                timestamp: new Date().toISOString(),
            });
    
    } catch(error : any) { 
            throw new InternalError('Error fetching queue statistics: ' + error)
    }
}