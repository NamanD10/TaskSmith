import z  from "zod";

const headersSchema = z.record(
    z.string().min(1).max(200),
    z.string().max(2000))
.optional();

const reqBodySchema = z.union([
  z.record(z.string(), z.unknown()),   // JSON object body — the common case
  z.string().max(50_000),               // raw string body (XML, plain text, etc.)
]).optional();

export const taskSchema = z.object({
    userId: z.string().min(1),
    title: z.string().min(1),
    targetUrl: z.string().min(1),
    isRepeatable: z.boolean(),
    scheduledAt: z.coerce.date().optional(),
    repeatPattern: z.string().optional(),
    priority: z.number(),
    reqMethod: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
    headers: headersSchema,
    reqBody: reqBodySchema

});

export const taskUpdateSchema = taskSchema.partial();
export type Task = z.infer<typeof taskSchema>;
export type HeadersType = z.infer<typeof headersSchema>;
export type ReqBodyType = z.infer<typeof reqBodySchema>;