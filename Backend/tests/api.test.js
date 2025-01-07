const request = require('supertest');
const { app, server } = require('../index'); // Import both app and server

describe('API Endpoints', () => {
  // Close the server after all tests to avoid open handles
  afterAll(() => {
    server.close();
  });

  // Test root endpoint
  it('should return 200 for the root endpoint', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toBe('Server is running');
  });

  // Test unknown route
  it('should return 404 for an unknown route', async () => {
    const res = await request(app).get('/non-existent-route');
    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toBe('Route not found');
  });

  // Test users endpoint
  it('should return users data', async () => {
    const res = await request(app).get('/api/users');
    expect(res.statusCode).toEqual(200);

    // Validate the structure of the response data
    expect(res.body).toHaveProperty('users');
    expect(Array.isArray(res.body.users)).toBe(true);
  });

  // Test train data endpoint
  it('should return train data', async () => {
    const res = await request(app).get('/api/trainData');
    expect(res.statusCode).toEqual(200);

    // Validate the structure of the response data
    expect(res.body).toHaveProperty('trainData');
    expect(Array.isArray(res.body.trainData)).toBe(true);
  });

  // Test temp data endpoint
  it('should return temp data', async () => {
    const res = await request(app).get('/api/tempData');
    expect(res.statusCode).toEqual(200);

    // Validate the structure of the response data
    expect(res.body).toHaveProperty('tempData');
    expect(Array.isArray(res.body.tempData)).toBe(true);
  });

  // Test documents endpoint
  it('should return document data', async () => {
    const res = await request(app).get('/api/documents');
    expect(res.statusCode).toEqual(200);

    // Validate the structure of the response data
    expect(res.body).toHaveProperty('documents');
    expect(Array.isArray(res.body.documents)).toBe(true);
  });

  // Test posting a new user
  it('should create a new user', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'password123',
      });
    expect(res.statusCode).toEqual(201);

    // Validate the structure of the created user response
    expect(res.body).toHaveProperty('user');
    expect(res.body.user.name).toBe('Test User');
    expect(res.body.user.email).toBe('testuser@example.com');
  });

  // Test posting new temp data
  it('should create new temp data', async () => {
    const res = await request(app)
      .post('/api/tempData')
      .send({
        userId: '123456',
        data: [
          { banglish: 'shuvo', english: 'hello', bangla: 'শুভ' },
        ],
        status: 'pending',
      });
    expect(res.statusCode).toEqual(201);

    // Validate the structure of the response
    expect(res.body).toHaveProperty('tempData');
    expect(res.body.tempData.status).toBe('pending');
    expect(res.body.tempData.data[0].banglish).toBe('shuvo');
  });

  // Test updating a document
  it('should update an existing document', async () => {
    const documentId = '123456'; // Replace with a valid document ID
    const res = await request(app)
      .put(`/api/documents/${documentId}`)
      .send({
        content: 'Updated content',
      });
    expect(res.statusCode).toEqual(200);

    // Validate the structure of the response
    expect(res.body).toHaveProperty('document');
    expect(res.body.document.content).toBe('Updated content');
  });

  // Test handling of invalid POST requests
  it('should return 400 for invalid user data', async () => {
    const res = await request(app).post('/api/users').send({
      name: '', // Missing required fields
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toBe('Invalid data');
  });
});
