import { ApiError, ErrorType } from "./AppError";

export class BadRequestError extends ApiError{
    constructor(message: string="Bad Request"){
        super(ErrorType.BAD_REQUEST, 400, message);
    }
}

export class NotFoundError extends ApiError{
    constructor(message: string="Resource Not Found"){
        super(ErrorType.NOT_FOUND, 404, message);
    }
}

export class ZodError extends ApiError{
    constructor(message: string="Zod Error"){
        super(ErrorType.ZOD, 500, message);
    }
}

export class InternalError extends ApiError{
    constructor(message: string="Internal Server Error"){
        super(ErrorType.INTERNAL, 500, message);
    }
}
