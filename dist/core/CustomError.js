"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalError = exports.ZodError = exports.NotFoundError = exports.BadRequestError = void 0;
const AppError_1 = require("./AppError");
class BadRequestError extends AppError_1.ApiError {
    constructor(message = "Bad Request") {
        super(AppError_1.ErrorType.BAD_REQUEST, 400, message);
    }
}
exports.BadRequestError = BadRequestError;
class NotFoundError extends AppError_1.ApiError {
    constructor(message = "Resource Not Found") {
        super(AppError_1.ErrorType.NOT_FOUND, 404, message);
    }
}
exports.NotFoundError = NotFoundError;
class ZodError extends AppError_1.ApiError {
    constructor(message = "Zod Error") {
        super(AppError_1.ErrorType.ZOD, 500, message);
    }
}
exports.ZodError = ZodError;
class InternalError extends AppError_1.ApiError {
    constructor(message = "Internal Server Error") {
        super(AppError_1.ErrorType.INTERNAL, 500, message);
    }
}
exports.InternalError = InternalError;
