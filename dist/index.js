"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const taskWorker_1 = require("./jobs/taskWorker");
const app_1 = __importDefault(require("./app"));
const dotenv_1 = __importDefault(require("dotenv"));
process.on('uncaughtException', (err) => console.log(err));
dotenv_1.default.config();
taskWorker_1.taskWorker.run();
const port = process.env.PORT;
app_1.default.listen(port, () => console.log(`App listening on port ${port}`));
