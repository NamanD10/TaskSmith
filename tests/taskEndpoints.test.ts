import request from 'supertest';
import app from '../src/app';

describe('Task API Endpoints', () => {
  let createdTaskId: number;

  // Test POST /tasks/create
  it('should create a new task', async () => {
    const res = await request(app)
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
  });

  // Test GET /tasks
  it('should get a list of all tasks', async () => {
    const res = await request(app).get('/tasks');
    expect(res.statusCode).toBe(201);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  // Test GET /tasks/:id
  it('should get details of a specific task', async () => {
    const res = await request(app).get(`/tasks/${createdTaskId}`);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id', createdTaskId);
    expect(res.body).toHaveProperty('title', 'Test Task');
  });

  // Test GET /tasks/:id with invalid ID
  it('should return 400 for invalid id parameter', async () => {
    const res = await request(app).get('/tasks/invalid_id');
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Invalid id parameter');
  });

  // Test GET /tasks/:id for non-existent ID
  it('should return 404 for non-existent task', async () => {
    const res = await request(app).get('/tasks/999999');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message', 'Task not found');
  });
});