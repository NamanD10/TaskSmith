import { emailWorker } from "./jobs/taskWorker";
import app from "./app";
import dotenv from 'dotenv';

dotenv.config();
emailWorker.run();
    
const port = process.env.PORT;
    
app
 .listen(port, () => {
     console.log(`App listening on port ${port}`)
 })
 .on("error", e => console.error(e));
    
    

