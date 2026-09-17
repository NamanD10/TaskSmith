import { db } from "../db/db";
import { response } from "../db/schema";
import z from 'zod';

const resHeadersSchema = z.record(
    z.string().min(1).max(200),
    z.string().max(2000))
.nullish();
type ResponseHeadersType = z.infer<typeof resHeadersSchema>;

type InsertResponseParams = {
    taskId : string;
    executionDate : Date;
    statusCode : number;
    statusMessage : string;
    durationMs : number;
    responseBody?: string | null;
    responseHeaders?: any | null;
    errorCode?: string | null;
    errorMessage?: string | null; 
};

export const insertResponse = async ({
    taskId,
    executionDate, 
    statusCode, 
    statusMessage, 
    durationMs, 
    responseBody = null, 
    responseHeaders = null, 
    errorCode = null, 
    errorMessage = null   
} : InsertResponseParams) => {
    const result = await db.insert(response) 
        .values({
            taskId: taskId,
            executionDate: executionDate,
            statusCode: statusCode,
            statusMessage: statusMessage,
            durationMs : durationMs,
            responseBody : responseBody,
            responseHeaders : responseHeaders,
            errorCode : errorCode,
            errorMessage : errorMessage
        })
        .returning();
    return result[0];
};