import app from "./app";
import dotenv from 'dotenv';
import { primaryWorker } from "./workers/taskWorker";
import { secondWorker } from "./workers/secondWorker";
import { thirdWorker } from "./workers/thirdWorker";
import { fourthWorker } from "./workers/fourthWorker";

dotenv.config();

primaryWorker.run();
secondWorker.run();
thirdWorker.run();
fourthWorker.run();
    
const port = process.env.PORT;
    
app
 .listen(port, () => {
     console.log(`App listening on port ${port}`)
 })
 .on("error", e => console.error(e));
    
    

