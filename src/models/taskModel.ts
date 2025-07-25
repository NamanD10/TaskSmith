import { PrismaClient, TaskStatus} from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

const prisma = new PrismaClient().$extends(withAccelerate())

export const createTask = async (title: string, description: string, type: string) =>{ 
    return await prisma.task.create({
        data : {
            title: title,
            description: description,
            type: type,
        },

    })
};

export const updateTaskStatus = async (id: number, status: TaskStatus) => {
    await prisma.task.update({
        where : {
            id: id
        },
        data: {
            status: status 
        },

    })
};

export const updateTaskAttempts = async (id: number, attempts: number) => {
    await prisma.task.update({
        where : {
            id: id
        },
        data: {
            attempts: attempts 
        },

    })
};

export const getTaskById = async (id: number) => {
    return await prisma.task.findUnique({
        where: {
            id: id
        }
    })
};

export const getTasks = async () => {
    return await prisma.task.findMany();
};
  
