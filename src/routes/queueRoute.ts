import express from "express";
import { myQueue } from "../config/redis";
import { InternalError } from "../core/CustomError";
import expressAsyncHandler from "express-async-handler";
import { getQueueStatsHandler } from "../controllers/queueController";

export const queueRouter = express.Router();

queueRouter.get("/stats", expressAsyncHandler(getQueueStatsHandler));