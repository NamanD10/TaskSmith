import express from 'express';
import { getResponseHandler, getAllResponseHandler } from '../controllers/responseController';
import asyncHandler from 'express-async-handler';

export const responseRouter = express.Router();

responseRouter.get('/:id', asyncHandler(getResponseHandler)); 
responseRouter.get('/:id/all', asyncHandler(getAllResponseHandler));