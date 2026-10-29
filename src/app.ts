import express, { NextFunction, Request, Response } from 'express';
import cors from "cors";
import { taskRouter } from './routes/taskRoute';
import { ApiError } from './core/AppError';
import { InternalError } from './core/CustomError';
import { queueRouter } from './routes/queueRoute';
import { toNodeHandler } from "better-auth/node";
import { auth } from './lib/auth';
import { requireAuth } from './middlewares/auth';
import { createWorker } from "./workers/taskWorker";
import dotenv from 'dotenv';
import { statsRouter } from './routes/statsRoute';

dotenv.config();

const primaryWorker = createWorker();
primaryWorker.run();
const secondaryWorker = createWorker();
secondaryWorker.run();
const thirdWorker = createWorker();
thirdWorker.run();
const fourthWorker = createWorker();
fourthWorker.run();

const app = express();
const port = process.env.PORT;
app.use(cors({
    origin : ["http://localhost:3000"],
    credentials : true
}));

app.all('/api/auth/{*any}', toNodeHandler(auth));

app.use(express.json());

app.use('/tasks', requireAuth, taskRouter);
app.use('/queue', requireAuth, queueRouter);
app.use('/stats', requireAuth, statsRouter);

app.use((err: Error, req : Request, res: Response, next: NextFunction) => {
    if(err instanceof ApiError) {
        ApiError.handle(err, res)
    }
    else {
        ApiError.handle(new InternalError(), res);
    }
    //this throws an error "Error: Cannot set headers after they are sent to the client"
});


app
 .listen(port, () => {
     console.log(`App listening on port ${port}`)
 })
 .on("error", e => console.error(e));