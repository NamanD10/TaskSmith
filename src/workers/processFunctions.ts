import axios from "axios";
import path from "path";
import fs from "fs/promises";
import { InternalError } from "../core/CustomError";
import { getTasks } from "../models/taskModel";

export async function makeApiCall () {
    try{
        const response = await axios.get('https://jsonplaceholder.typicode.com/posts/1');
    } catch(error) {
        throw new InternalError(`Can not call API during processing task ${error}`);
    }
};

export async function performFileOperation(task: any) {
    const tempDir = path.join(__dirname, '../temp');
    const filePath = path.join(tempDir, `task-${task.id}.txt`);

    try{
        const data = `Task ${task.id} ${task.title}\n`.repeat(500);
        await fs.writeFile(filePath, data);
        const content = await fs.readFile(filePath, 'utf-8');
        await fs.unlink(filePath);
    }
    catch(error) {
        throw new InternalError(`File operation failed while processing job ${error}`);
    }
};

export async function performDatabaseOperation() {
    const relatedTasks = await getTasks();

    await new Promise(res => setTimeout(res, 200));
};

export async function performDefaultWork(task : any) {
    const workload = task.priority || 3;
    const iterations = workload*50000;

    let result = 0;
    for (let i=0; i<iterations; i++){
        result += Math.sqrt(i) * Math.sin(i) * Math.cos(i);
    }

};