import express, { NextFunction, Request, Response } from 'express';
import { taskRouter } from './routes/taskRoute';
import { errorHandler } from './middlewares/errorHandler';
import { ApiError } from './core/AppError';
import { InternalError } from './core/CustomError';

const app = express();

app.use(express.json());

app.use('/tasks', taskRouter);

app.use((err: Error, req : Request, res: Response, next: NextFunction) => {
    if(err instanceof ApiError) {
        ApiError.handle(err, res)
    }
    ApiError.handle(new InternalError(), res);
})
export default app;

