const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { app, connection } = require('../index');

let mongoServer;

describe('Task API', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    process.env.MONGO_CONN_STR = mongoServer.getUri();
    process.env.USE_DB_AUTH = 'false';
    await connection();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await mongoose.connection.db.dropDatabase().catch(() => {});
  });

  it('GET /api/tasks returns an empty list initially', async () => {
    const response = await request(app).get('/api/tasks');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('POST /api/tasks creates a task', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .send({ task: 'Write tests' });

    expect(response.status).toBe(201);
    expect(response.body.task).toBe('Write tests');
    expect(response.body.completed).toBe(false);
  });

  it('PUT /api/tasks/:id updates a task', async () => {
    const created = await request(app)
      .post('/api/tasks')
      .send({ task: 'Update me' });

    const response = await request(app)
      .put(`/api/tasks/${created.body._id}`)
      .send({ completed: true });

    expect(response.status).toBe(200);
    expect(response.body.completed).toBe(true);
  });

  it('DELETE /api/tasks/:id removes a task', async () => {
    const created = await request(app)
      .post('/api/tasks')
      .send({ task: 'Delete me' });

    const response = await request(app)
      .delete(`/api/tasks/${created.body._id}`);

    expect(response.status).toBe(204);
  });
});
