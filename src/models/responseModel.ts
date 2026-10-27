import { eq, count, sql, and, gt, gte, desc, lt } from "drizzle-orm";
import { db } from "../db/db";
import { response, task } from "../db/schema";
import z from 'zod';

const resHeadersSchema = z.record(
    z.string().min(1).max(200),
    z.string().max(2000))
.nullish();
type ResponseHeadersType = z.infer<typeof resHeadersSchema>;

type InsertResponseParams = {
    taskId : string;
    userId : string;
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
    userId,
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
            userId : userId,
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

export const getExecutionStats = async (userId: string) => {
    const [row] = await db
        .select({
            total: sql<number>`count(*)::int`,
            successful: sql<number>`
                (count(*) filter (where ${response.statusCode} between 200 and 299))::int
            `,
        })
        .from(response)
        .where(eq(response.userId, userId));

    const total = row?.total ?? 0;
    const successful = row?.successful ?? 0;

    return {
        totalExecutions: total,
        successfulExecutions: successful,
        successRate: total > 0 ? Number(((successful / total) * 100).toFixed(2)) : 0,
    };
};

export const getExecutionCountLast24h = async (userId: string) => {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [row] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(response)
        .where(
            and(
                eq(response.userId, userId),
                gte(response.executionDate, since)
            )
        );

    return {
        executionsLast24h: row?.count ?? 0,
        since: since.toISOString(),
    };
};

export const getAverageDuration = async (userId: string) => {
    const [row] = await db
        .select({
            avgDurationMs: sql<number>`coalesce(avg(${response.durationMs}), 0)::float8`,
            sampleSize: sql<number>`count(*)::int`,
        })
        .from(response)
        .where(
            and(
                eq(response.userId, userId),
                gt(response.durationMs, 0)   //to remove rows with durationMs=0 from the average
            )
        );

    return {
        averageDurationMs: Number((row?.avgDurationMs ?? 0).toFixed(2)),
        sampleSize: row?.sampleSize ?? 0,
    };
};

export const getRecentExecutions = async (userId: string, limit = 10) => {
    return await db
        .select({
            id : task.id,
            title: task.title,
            targetUrl: task.targetUrl,
            reqMethod: task.reqMethod,
            statusCode: response.statusCode,
            durationMs : response.durationMs,
            executionDate: response.executionDate,
        })
        .from(response)
        .innerJoin(task, eq(response.taskId, task.id))
        .where(eq(response.userId, userId))
        .orderBy(desc(response.executionDate))
        .limit(limit);
};

export const getTaskResponses = async (
  userId: string,
  taskId: string,
  limit = 20,
  cursor?: Date
) => {
  const rows = await db
    .select()
    .from(response)
    .where(
      and(
        eq(response.userId, userId),
        eq(response.taskId, taskId),
        cursor ? lt(response.executionDate, cursor) : undefined
      )
    )
    .orderBy(desc(response.executionDate))
    .limit(limit + 1); // one extra row tells us whether another page exists

  const hasMore = rows.length > limit;
  const items = hasMore ? rows.slice(0, limit) : rows;

  return {
    items,
    nextCursor: hasMore ? items[items.length - 1].executionDate.toISOString() : null,
  };
};

export const getTaskExecutionSummary = async (userId: string, taskId: string) => {
  const [row] = await db
    .select({
      total: sql<number>`count(*)::int`,
      successful: sql<number>`(count(*) filter (where ${response.statusCode} between 200 and 299))::int`,
      avgDurationMs: sql<number>`coalesce(avg(${response.durationMs}) filter (where ${response.durationMs} > 0), 0)::float8`,
    })
    .from(response)
    .where(and(eq(response.userId, userId), eq(response.taskId, taskId)));

  const total = row?.total ?? 0;
  const successful = row?.successful ?? 0;

  return {
    total,
    successful,
    successRate: total > 0 ? Number(((successful / total) * 100).toFixed(2)) : 0,
    averageDurationMs: Number((row?.avgDurationMs ?? 0).toFixed(2)),
  };
};