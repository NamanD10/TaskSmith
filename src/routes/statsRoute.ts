import express from 'express';
import asyncHandler from 'express-async-handler';
import { getTasksByTypeHandler, getUpcomingRunsHandler } from '../controllers/taskController';
import { getAverageDurationHandler, getExecutionCountLast24hHandler, getExecutionStatsHandler, getRecentExecutionsHandler } from '../controllers/responseController';

export const statsRouter = express.Router();

statsRouter.get('/task-type', asyncHandler(getTasksByTypeHandler));
statsRouter.get('/upcoming-runs', asyncHandler(getUpcomingRunsHandler));
statsRouter.get('/success-rate', asyncHandler(getExecutionStatsHandler));
statsRouter.get('/last-24h', asyncHandler(getExecutionCountLast24hHandler));
statsRouter.get('/avg-duration', asyncHandler(getAverageDurationHandler));
statsRouter.get('/recent-executions', asyncHandler(getRecentExecutionsHandler));