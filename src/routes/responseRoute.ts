import express from 'express';
import { getResponseHandler, getAllResponseHandler, getExecutionStatsHandler, getExecutionCountLast24hHandler, getAverageDurationHandler, getRecentExecutionsHandler } from '../controllers/responseController';
import asyncHandler from 'express-async-handler';
import { getExecutionCountLast24h } from '../models/responseModel';

export const responseRouter = express.Router();

responseRouter.get('/stats/successRate', asyncHandler(getExecutionStatsHandler));
responseRouter.get('/stats/last-24h', asyncHandler(getExecutionCountLast24hHandler));
responseRouter.get('/stats/avgDuration', asyncHandler(getAverageDurationHandler));
responseRouter.get('/recent', asyncHandler(getRecentExecutionsHandler));
responseRouter.get('/:id', asyncHandler(getResponseHandler)); 
responseRouter.get('/:id/all', asyncHandler(getAllResponseHandler));