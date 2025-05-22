Task Smith is a task scheduling and management application implementing message queues with Bull Mq and Redis. These tags are then added into a Message Queue followed by a worker completing them in the background.

Tech Stack : 
Node Js - Backend
Express JS - Framework
PostgreSQL - Database 
Prisma - ORM 
Redis with Bull MQ - Message Queues and Caching
Deployment - AWS Elastic Beanstalk (currently closed due to service charges)

To run the application on your system, run the following commands: 
 --> git clone "https://github.com/NamanD10/TaskSmith.git"
 --> npm install
 --> npm run build 
 --> npm run start 


Available url routes: 

1. POST : /tasks/create - Creating a taks with "title" and "description", their values given as JSON in the request body and its status as "pending" (default value)
2. GET : /tasks - Get the list of all the tasks added
3. GET : /tasks/:id - Get details of a specific task  

