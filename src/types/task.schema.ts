import z  from "zod";

const headersSchema = z.record(
  z.string().min(1, "Header name must not be empty").max(200, "Header name must be at most 200 characters"),
  z.string().max(2000, "Header value must be at most 2000 characters")
).nullish();

const reqBodySchema = z.union([
  z.record(z.string(), z.unknown(), {
    message: "Request body must be a JSON object",
  }), // JSON object body — the common case
  z.string().max(50_000, "Raw string body must be at most 50,000 characters"),
], {
  message: "Request body must be either a JSON object or a string",
}).nullish();

export const taskSchema = z.object({
  userId: z.string().min(1, "userId is required"),
  title: z.string().min(1, "Title is required"),
  targetUrl: z
    .url({ protocol : /^https?$/, error : "Target URL can be http or https only"})
    .refine((url) => {
        const hostname = new URL(url).hostname;
        const blocked = ["localhost", "127.0.0.1", "0.0.0.0", "::1"];
        return !blocked.includes(hostname) && !hostname.startsWith("192.168.") && !hostname.startsWith("10.");
    },
    {error : "TargetUrl cannot point to a private/internal address"}
  ),  
  isRepeatable: z.boolean({
    message: "isRepeatable must be a boolean value",
  }),
  scheduledAt: z.coerce.date({
    message: "scheduledAt must be a valid date",
  }).optional(),
  repeatPattern: z.string().min(1, "repeatPattern must not be empty").optional(),
  priority: z
    .number({ message: "Priority must be a number" })
    .min(1, "Priority must be at least 1")
    .max(3, "Priority must be at most 3"),
  reqMethod: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"], {
    message: "reqMethod must be one of GET, POST, PUT, PATCH, DELETE",
  }),
  headers: headersSchema,
  reqBody: reqBodySchema,
});

export const taskUpdateSchema = taskSchema.partial();
export type Task = z.infer<typeof taskSchema>;
export type HeadersType = z.infer<typeof headersSchema>;
export type ReqBodyType = z.infer<typeof reqBodySchema>;