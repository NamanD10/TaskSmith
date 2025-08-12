"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
describe('Task API Endpoints', () => {
    let createdTaskId;
    // Test POST /tasks/create
    it('should create a new task', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .post('/tasks/create')
            .send({
            title: 'Test Task',
            description: 'Testing the task creation',
            type: 'GENERAL'
        });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('task');
        expect(res.body.task).toHaveProperty('id');
        createdTaskId = res.body.task.id;
        expect(res.body.task.title).toBe('Test Task');
    }));
    // Test GET /tasks
    it('should get a list of all tasks', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get('/tasks');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThanOrEqual(1);
    }));
    // Test GET /tasks/:id
    it('should get details of a specific task', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get(`/tasks/${createdTaskId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('id', createdTaskId);
        expect(res.body).toHaveProperty('title', 'Test Task');
    }));
    // Test GET /tasks/:id with invalid ID
    it('should return 400 for invalid id parameter', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get('/tasks/invalid_id');
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message', 'Invalid id parameter');
    }));
    // Test GET /tasks/:id for non-existent ID
    it('should return 404 for non-existent task', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get('/tasks/999999');
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('message', 'Task not found');
    }));
});
