"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = exports.ErrorType = void 0;
var ErrorType;
(function (ErrorType) {
    ErrorType["BAD_REQUEST"] = "BadRequest";
    ErrorType["NOT_FOUND"] = "NotFound";
    ErrorType["ZOD"] = "ZodError";
    ErrorType["INTERNAL"] = "Internal";
})(ErrorType || (exports.ErrorType = ErrorType = {}));
class ApiError extends Error {
    constructor(type, statusCode, message) {
        super(message);
        this.type = type,
            this.statusCode = statusCode,
            Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
    static handle(error, res) {
        res.status(error.statusCode || 500).json({
            type: error.type || ErrorType.INTERNAL,
            message: error.message || "Internal Server Error"
        });
    }
}
exports.ApiError = ApiError;
