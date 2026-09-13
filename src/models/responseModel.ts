import { db } from "../db/db";
import { response } from "../db/schema";
import z from 'zod';

const resHeadersSchema = z.record(
    z.string().min(1).max(200),
    z.string().max(2000))
.nullish();
type ResponseHeadersType = z.infer<typeof resHeadersSchema>;

export const insertResponse = async (taskId : string, executionDate : Date, statusCode : number, statusMessage : string, durationMs : number, responseBody : string | null, resopnseHeaders : ResponseHeadersType, errorCode : string | null, errorMessage : string | null) => {
    const result = await db.insert(response) 
        .values({
            taskId: taskId,
            executionDate: executionDate,
            statusCode: statusCode,
            statusMessage: statusMessage,
            durationMs : durationMs,
            responseBody : responseBody ?? null,
            responseHeaders : resopnseHeaders ?? null,
            errorCode : errorCode ?? null,
            errorMessage : errorMessage ?? null
        }
    ).returning();
    return result[0];
};