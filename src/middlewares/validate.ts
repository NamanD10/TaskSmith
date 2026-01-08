import { NextFunction, Request, Response } from "express";
import z from "zod";
import { ZodError } from "../core/CustomError";

export const validate = (schema: z.ZodType) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);

        if(!result.success){
            throw new ZodError(`Error while parsing schema ${result.error}`);
        }

        req.body = result.data;
        next();
    }
};