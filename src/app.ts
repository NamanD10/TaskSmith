import express, { NextFunction, Request, Response } from 'express';
import { taskRouter } from './routes/taskRoute';
import { ApiError } from './core/AppError';
import { InternalError } from './core/CustomError';
import { queueRouter } from './routes/queueRoute';
import { toNodeHandler } from "better-auth/node";
import { auth } from './lib/auth';
import dotenv from 'dotenv';
import { requireAuth } from './middlewares/auth';
// import { primaryWorker } from "./workers/taskWorker";
// import { secondWorker } from "./workers/secondWorker";
// import { thirdWorker } from "./workers/thirdWorker";
// import { fourthWorker } from "./workers/fourthWorker";

dotenv.config();

// primaryWorker.run();
// secondWorker.run();
// thirdWorker.run();
// fourthWorker.run();

const app = express();
const port = process.env.PORT;

app.all('/api/auth/{*any}', toNodeHandler(auth));

app.use(express.json());

app.use('/tasks', requireAuth, taskRouter);
app.use('/queue', requireAuth, queueRouter);

app.use((err: Error, req : Request, res: Response, next: NextFunction) => {
    if(err instanceof ApiError) {
        ApiError.handle(err, res)
    }
    ApiError.handle(new InternalError(), res);
});


app
 .listen(port, () => {
     console.log(`App listening on port ${port}`)
 })
 .on("error", e => console.error(e));