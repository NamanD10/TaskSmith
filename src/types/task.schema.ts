import z  from "zod";

export const taskSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(2),
    type: z.string().min(2),
    scheduledAt: z.date().optional(),
    repeatable: z.boolean().optional(),
    priority: z.number().optional(),

});

export type Task = z.infer<typeof taskSchema>;