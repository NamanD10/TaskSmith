import { Queue } from "bullmq";
import IORedis from 'ioredis';
import { config } from "./env";

export const connection = new IORedis({
  ...config.redis,
  db: 0, // Defaults to 0,
  maxRetriesPerRequest: null, //bull mq and io redis connection error fix 
});

connection.on('connect', ()=>console.log('Redis connected successfully'));
connection.on('error', err => console.log('Redis Client Error', err));

const test = async() => { 
  try{
    await connection.set('foo', 'bar');
    const result = await connection.get('foo');
    console.log('Redis connection value',result);  // >>> bar
  }
  catch(err){
    console.log('Error while testing redis', err);
  }
}

test();

export const myQueue = new Queue('taskQueue', { connection });


