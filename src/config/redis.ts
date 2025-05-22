import { Queue } from "bullmq";
import IORedis from 'ioredis';

export const connection = new IORedis({
  port: 15848, // Redis port
  host: 'redis-15848.c232.us-east-1-2.ec2.redns.redis-cloud.com', // Redis host
  username: "default", // needs Redis >= 6
  password: '6CwNVcym1ZXo4QtgSX1E7432CYtTNJqo',
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


