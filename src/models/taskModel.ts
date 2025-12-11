import { drizzle } from 'drizzle-orm/neon-http';
import { TaskStatus } from '../types/taskStatus.schema';
import { taskTable } from '../db/schema';
import { InferSelectModel } from 'drizzle-orm';
import { eq } from 'drizzle-orm';
import dotenv from "dotenv";
dotenv.config();

const db = drizzle(process.env.DATABASE_URL!);


type Task = InferSelectModel<typeof taskTable>;


export const createdTask = async (title: string, description: string, type: string, scheduledAt?: Date, repeatable?: boolean, priority?: number) =>{ 
    const result = await db.insert(taskTable)
    .values({ 
        title: title,
        description: description,
        type: type,
        ...(scheduledAt && {scheduledAt}),
        ...(repeatable !== undefined && {repeatable}),
        ...(priority && {priority})
     }
    ).returning();
    return result[0];
};

export const updateTaskStatus = async (id: number, status: TaskStatus) => {

    await db.update(taskTable)
        .set({ 
            status: status
        })
        .where((
            eq(taskTable.id, id)
        ))
};

export const updateTaskAttempts = async (id: number, attempts: number) => {

    await db.update(taskTable)
        .set({
            attempts: attempts
        })
        .where(
            eq(taskTable.id, id)
        )
};

export const getTaskById = async (id: number) => {
    return db.select({
        
    })
    .from(taskTable);
    
};

export const getTasks = async () => {
    return await db.select().from(taskTable);
};
  
