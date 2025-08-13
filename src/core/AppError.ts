import { Response } from "express"

export enum ErrorType {
    BAD_REQUEST = "BadRequest",
    NOT_FOUND = "NotFound",
    ZOD = "ZodError",
    INTERNAL = "Internal",

}

export class ApiError extends Error {
    type : ErrorType
    statusCode : number 
    constructor(type: ErrorType, statusCode: number, message: string){
        super(message)
        this.type = type,
        this.statusCode = statusCode,
        Object.setPrototypeOf(this, new.target.prototype)
        Error.captureStackTrace(this, this.constructor)
    }

    static handle(error : ApiError, res: Response) {
        res.status(error.statusCode || 500).json({
            type: error.type || ErrorType.INTERNAL,
            message: error.message || "Internal Server Error"
        })
    } 
    
}