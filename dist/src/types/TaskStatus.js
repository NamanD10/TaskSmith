"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskStatus = void 0;
var TaskStatus;
(function (TaskStatus) {
    TaskStatus[TaskStatus["PENDING"] = 0] = "PENDING";
    TaskStatus[TaskStatus["PROCESSING"] = 1] = "PROCESSING";
    TaskStatus[TaskStatus["RETRYING"] = 2] = "RETRYING";
    TaskStatus[TaskStatus["COMPLETED"] = 3] = "COMPLETED";
    TaskStatus[TaskStatus["FAILED"] = 4] = "FAILED";
})(TaskStatus || (exports.TaskStatus = TaskStatus = {}));
