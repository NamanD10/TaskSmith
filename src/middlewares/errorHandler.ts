import { Request, Response, NextFunction } from "express";
import { BadRequestError, InternalError, NotFoundError, ZodError } from "../core/CustomError";

export function errorHandler(
    error: NotFoundError | BadRequestError | ZodError | InternalError ,
    req: Request,
    res: Response,
    next: NextFunction
) {
    return res.status(error.statusCode).json({
        message: error.message,
    });
}