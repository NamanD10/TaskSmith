import { db } from "../db/db";
import { response } from "../db/schema";

export const insertResponse = async (taskId : string, executionDate : Date, attemptNumber : number, statusCode : number, statusMessage : string) => {
    const result = await db.insert(response)
        .values({
            taskId: taskId,
            executionDate: executionDate,
            attemptNumber: attemptNumber,
            statusCode: statusCode,
            statusMessage: statusMessage
        }
    ).returning();
    return result[0];
};