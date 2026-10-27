import { getAverageDuration, getExecutionCountLast24h, getExecutionStats, getRecentExecutions, getTaskExecutionSummary, getTaskResponses } from "../models/responseModel";
import { Response, Request } from "express";
import { BadRequestError, NotFoundError } from "../core/CustomError";
import z from "zod"; 

const executionsQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  cursor: z.coerce.date().optional(),
});

export const getExecutionStatsHandler = async (req : Request, res : Response) => {
    const user = req.user;

    if(!user) {
        throw new BadRequestError("User not found in request");
    }

    const executionStats = await getExecutionStats(user.id);
    res.status(200).json(executionStats);
};

export const getExecutionCountLast24hHandler = async (req: Request, res: Response) => {
    const user = req.user;
    if (!user) throw new BadRequestError("User not found in request");

    const result = await getExecutionCountLast24h(user.id);
    res.status(200).json(result);
};

export const getAverageDurationHandler = async (req: Request, res: Response) => {
    const user = req.user;
    if (!user) throw new BadRequestError("User not found in request");

    const result = await getAverageDuration(user.id);
    res.status(200).json(result);
};

export const getRecentExecutionsHandler = async (req: Request, res: Response) => {
    const user = req.user;
    if (!user) throw new BadRequestError("User not found in request");

    const executions = await getRecentExecutions(user.id, 10);
    res.status(200).json(executions);
};

export const getTaskResponsesHandler = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) throw new BadRequestError("User not found in request");

  const taskId = req.params.id;
  if (!taskId) throw new BadRequestError("Task id is required");

  const parsed = executionsQuerySchema.safeParse(req.query);
  if (!parsed.success) throw new BadRequestError("Invalid limit or cursor");
  const { limit, cursor } = parsed.data;

  // The summary only needs to be sent with the first page
  const [page, summary] = await Promise.all([
    getTaskResponses(user.id, taskId, limit, cursor),
    cursor ? Promise.resolve(undefined) : getTaskExecutionSummary(user.id, taskId),
  ]);

  res.status(200).json({ ...page, summary });
};