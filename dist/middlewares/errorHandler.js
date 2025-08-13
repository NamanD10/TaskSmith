"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
function errorHandler(error, req, res, next) {
    return res.status(error.statusCode).json({
        message: error.message,
    });
}
