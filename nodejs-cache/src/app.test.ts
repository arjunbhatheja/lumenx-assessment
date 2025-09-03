import request from 'supertest';

// Mock the database connection
jest.mock('mysql2/promise', () => ({
  createConnection: jest.fn().mockResolvedValue({
    execute: jest.fn().mockResolvedValue([
      [
        {
          id: 1,
          title: 'Test Post',
          content: 'Test Content',
          user_id: 1,
          user_name: 'Test User',
          user_email: 'test@example.com'
        }
      ]
    ]),
    end: jest.fn()
  })
}));

// Fix Redis mock to return promises
jest.mock('redis', () => ({
  createClient: jest.fn(() => ({
    on: jest.fn(),
    connect: jest.fn().mockResolvedValue(undefined), // Return resolved promise
    get: jest.fn().mockResolvedValue(null),
    setEx: jest.fn().mockResolvedValue('OK'),
    disconnect: jest.fn().mockResolvedValue(undefined)
  }))
}));

// Import app after mocking
import app from './app';

describe('Cache API', () => {
  test('GET / should return health check', async () => {
    const response = await request(app)
      .get('/')
      .expect(200);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('Cache Service');
  });

  test('GET /cache/posts should return posts data', async () => {
    const response = await request(app)
      .get('/cache/posts')
      .expect(200);

    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('source');
    expect(['cache', 'database']).toContain(response.body.source);
  });

  test('GET /cache/posts/1 should return single post', async () => {
    const response = await request(app)
      .get('/cache/posts/1')
      .expect(200);

    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('source');
  });
});