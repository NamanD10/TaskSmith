import { drizzle } from 'drizzle-orm/neon-http';
import { taskTable } from '../db/schema';
import { InferInsertModel } from 'drizzle-orm';
import { eq } from 'drizzle-orm';
import dotenv from "dotenv";
import { InternalError, NotFoundError } from '../core/CustomError';
dotenv.config();

const db = drizzle(process.env.DATABASE_URL!);


type TaskUpdate = Partial<InferInsertModel<typeof taskTable>>;


export const createdTask = async (title: string, description: string, type: string, isRepeatable: boolean, scheduledAt: Date | null, repeatPattern: string | null, priority: number ) =>{ 
    const result =  await db.insert(taskTable)
        .values({ 
            title: title,
            description: description,
            type: type,
            isRepeatable: isRepeatable,
            scheduledAt: scheduledAt,
            repeatPattern: repeatPattern,
            priority : priority,
        }
        ).returning();  
    return result[0];
};

export const updateTask = async (id: number, data: TaskUpdate) => {

    const result = await db.update(taskTable)
        .set({
            ...data,
            updatedAt: new Date(),
        })
        .where(
            eq(taskTable.id, id)
        )
        .returning();
    
    if(!result[0]){
        throw new NotFoundError(`Task with id ${taskTable.id} not found in updateTask task model`);
    }
    return result[0];
};

export const getTaskById = async (id: number) => {
    const result = await db.
    select()
    .from(taskTable)
    .where(eq(taskTable.id, id)).limit(1);
    
    return result[0];
};

export const getTasks = async () => {
    return await db.select().from(taskTable);
};

export const deleteTask = async (id : number) => {
    const result = await db.delete(taskTable)
    .where(eq(taskTable.id, id))
    .returning()

    if(!result[0]){
        throw new NotFoundError(`Task with id ${id} not found in deleteTask task model`);
    }

    return result[0];
};
  
