import express from 'express';
import asyncHandler from 'express-async-handler';
import { getTasksByTypeHandler, getUpcomingRunsHandler } from '../controllers/taskController';
import { getAverageDurationHandler, getExecutionCountLast24hHandler, getExecutionStatsHandler, getRecentExecutionsHandler } from '../controllers/responseController';

export const statsRouter = express.Router();

statsRouter.get('/stats/task-type', asyncHandler(getTasksByTypeHandler));
statsRouter.get('/stats/upcoming-runs', asyncHandler(getUpcomingRunsHandler));
statsRouter.get('/stats/success-rate', asyncHandler(getExecutionStatsHandler));
statsRouter.get('/stats/last-24h', asyncHandler(getExecutionCountLast24hHandler));
statsRouter.get('/stats/avg-duration', asyncHandler(getAverageDurationHandler));
statsRouter.get('/stats/recent-executions', asyncHandler(getRecentExecutionsHandler));