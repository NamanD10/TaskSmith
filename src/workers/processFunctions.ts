import axios from "axios";
import { BadRequestError, InternalError } from "../core/CustomError";
import { Task } from "../types/task.schema";
import { insertResponse } from "../models/responseModel";

export async function makeApiCall (taskId : string, task : Partial<Task>) {
  try{
        if(!task.reqMethod) {
            throw new BadRequestError("Property reqMethod is needed");
        }
        const startDate = new Date();
        const response = await axios({
            method : task.reqMethod.toLowerCase(),
            url : task.targetUrl,
            headers : task.headers ?? undefined,
            data : task.reqBody ?? undefined,
            validateStatus : () => true,
            timeout : 10_000,
            maxContentLength: 1_000_000, 
            maxBodyLength: 1_000_000,
        });
  
        const durationMs = Date.now() - startDate.getTime();
        const endDate = new Date();

        if(response.status >= 200 && response.status < 300){
          const savedResponse = await insertResponse({
            taskId, 
            executionDate : endDate, 
            statusCode : response.status, 
            statusMessage : response.statusText, 
            durationMs
          });
        }  
        else if(response.status >= 300 && response.status < 500) {
          //save with response body, headers, errorCode, errorMsg 
          const savedResponse = await insertResponse({
            taskId, 
            executionDate : endDate, 
            statusCode : response.status, 
            statusMessage : response.statusText, 
            durationMs, 
            responseBody : JSON.stringify(response.data).slice(0, 2000),
            responseHeaders : response.headers
          });
        }
        else {
          const savedResponse = await insertResponse({
            taskId, 
            executionDate : endDate, 
            statusCode : response.status, 
            statusMessage : response.statusText, 
            durationMs, 
            responseBody : JSON.stringify(response.data).slice(0, 2000),
            responseHeaders : response.headers
          }); 
        }    
       
    } catch (error : any) {
      
      const savedResponse = await insertResponse({
        taskId,
        executionDate : new Date(),
        statusCode : 0,
        statusMessage : "",
        durationMs : 0,
        responseBody : null,
        responseHeaders : null,
        errorCode : error.code,
        errorMessage : error.message
      });

    throw new InternalError(`Unexpected error calling ${task.targetUrl}: ${error}`);
  } 
};

