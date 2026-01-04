const request = require('supertest');
const app = require('../server');
const User = require('../models/User');
const connectDB = require('../config/db');
const { dbType } = require('../config/env');
const mongoose = require('mongoose');
const { prisma } = require('../core/prisma');

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  if (dbType === 'mysql') {
    await prisma.$disconnect();
  } else {
    await mongoose.connection.close();
  }
});

describe('Auth Endpoints', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'student',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
  });

  it('should login an existing user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });
});