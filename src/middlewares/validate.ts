import { NextFunction, Request, Response } from "express";
import z from "zod";
import { ZodError } from "../core/CustomError";

export const validate = (schema: z.ZodType) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);

        if(!result.success){
            const errors = result.error.issues.map((issue) => ({
                path : issue.path.join("."),
                message : issue.message
            }));
            throw new ZodError(`Error while parsing schema ${JSON.stringify(errors)}`);
        }

        req.body = result.data;
        next();
    }
};