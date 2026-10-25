import { getAllResponse, getAverageDuration, getExecutionCountLast24h, getExecutionStats, getResponse, getRecentExecutions } from "../models/responseModel";
import { Response, Request } from "express";
import { BadRequestError, NotFoundError } from "../core/CustomError";

export const getResponseHandler = async (req : Request, res : Response) => {
    const taskId = req.params.id;     //or either from request parameters depending upon our decision

    if (!taskId) {
        throw new BadRequestError("Taks Id required to get response details");
    }

    const response = await getResponse(taskId);
    if(!response) {
        throw new NotFoundError(`Response with task id ${taskId} not found`);
    }

    res.status(200).json(response);
    return;
};

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

export const getAllResponseHandler = async (req : Request, res : Response) => {
    const taskId = req.params.id;     //or either from request parameters depending upon our decision

    if (!taskId) {
        throw new BadRequestError("Taks Id required to get response details");
    }

    const response = await getAllResponse(taskId);
    if(!response) {
        throw new NotFoundError(`Response with task id ${taskId} not found`);
    }

    res.status(200).json(response);
    return;
};