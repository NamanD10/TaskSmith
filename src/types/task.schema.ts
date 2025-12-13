import z  from "zod";

export const taskSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(2),
    type: z.string().min(2),
    scheduledAt: z.date().nullable(),
    repeatable: z.boolean(),
    priority: z.number(),
    repeatPattern: z.string().nullable(),

});

export type Task = z.infer<typeof taskSchema>;