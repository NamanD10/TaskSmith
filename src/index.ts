import { taskWorker } from "./jobs/taskWorker";
import app from "./app";
import dotenv from 'dotenv';

process.on('uncaughtException' , (err) => console.log(err));

dotenv.config();
taskWorker.run();

const port = process.env.PORT;

app.listen(port, () => console.log(`App listening on port ${port}`));