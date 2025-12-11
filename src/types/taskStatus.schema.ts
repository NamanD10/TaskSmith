import z from "zod";

export const taskStatusEnum = z.enum(
    ["PENDING", "PROCESSING", "RETRYING", "COMPLETED", "FAILED"]
);

export type TaskStatus = z.infer<typeof taskStatusEnum>;