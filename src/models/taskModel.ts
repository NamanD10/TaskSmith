import { db } from '../db/db';
import { task } from '../db/schema';
import { and, InferInsertModel, eq, isNull, isNotNull, count, asc, sql } from 'drizzle-orm';
import { NotFoundError } from '../core/CustomError';
import { HeadersType, ReqBodyType } from '../types/task.schema';
import dotenv from "dotenv";
dotenv.config();


type TaskUpdate = Partial<InferInsertModel<typeof task>>;
type ReqMethodType =  "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | undefined


export const createdTask = async (userId: string, title: string, targetUrl: string, isRepeatable: boolean, scheduledAt: Date | null, repeatPattern: string | null, priority: number, reqMethod: ReqMethodType,  headers: HeadersType, reqBody: ReqBodyType) =>{ 
    const result =  await db.insert(task)
        .values({ 
            userId: userId,
            title: title,
            targetUrl : targetUrl,
            isRepeatable: isRepeatable,
            scheduledAt: scheduledAt,
            repeatPattern: repeatPattern,
            priority : priority,
            reqMethod : reqMethod,
            headers : headers,
            reqBody : reqBody
        }
        ).returning();  
    return result[0];
};

export const updateTask = async (userId: string, id: string, data: TaskUpdate) => {

    const result = await db.update(task)
        .set({
            ...data
        })
        .where(
            and(
                eq(task.userId, userId),
                eq(task.id, id)
            )    
        )
        .returning();

        if(!result[0]){
            throw new NotFoundError(`Task with id ${id} not found in updateTask task model`);
        }
        return result[0];
    
};

export const getTaskById = async (userId:string, id: string) => {
    const result = await db.select()
    .from(task)
    .where(
        and(
            eq(task.userId, userId),
            eq(task.id , id)
        )
    );
    
    return result[0];
};

export const getTasks = async (userId: string) => {
    return await db.select()
    .from(task)
    .where(eq(task.userId, userId));
};

export const getTasksByType = async (userId: string) => {
    const [row] = await db
        .select({
            immediate: sql<number>`(count(*) filter (where ${task.isRepeatable} = false and ${task.scheduledAt} is null))::int`,
            scheduled: sql<number>`(count(*) filter (where ${task.isRepeatable} = false and ${task.scheduledAt} is not null))::int`,
            repeatable: sql<number>`(count(*) filter (where ${task.isRepeatable} = true))::int`,
        })
        .from(task)
        .where(eq(task.userId, userId));

    return {
        immediate: row?.immediate ?? 0,
        scheduled: row?.scheduled ?? 0,
        repeatable: row?.repeatable ?? 0,
    };
};

export const getUpcomingRuns = async (userId: string, limit = 5) => {
    return await db
        .select({
            title: task.title,
            targetUrl: task.targetUrl,
            reqMethod: task.reqMethod,
            nextRunAt: task.nextRunAt,
        })
        .from(task)
        .where(
            and(
                eq(task.userId, userId),
                isNotNull(task.nextRunAt)
            )
        )
        .orderBy(asc(task.nextRunAt))
        .limit(limit);
};

export const deleteTask = async (userId: string, id: string) => {
    const result = await db.delete(task)
    .where(
        and(
            eq(task.userId, userId),
            eq(task.id , id)
        )
    )
    .returning()

    if(!result[0]){
        throw new NotFoundError(`Task with id ${id} not found in deleteTask task model`);
    }

    return result[0];
};
  
