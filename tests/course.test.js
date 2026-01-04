const request = require('supertest');
const app = require('../server');
const Course = require('../models/Course');
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

describe('Course Endpoints', () => {
  it('should create a new course', async () => {
    const res = await request(app)
      .post('/api/courses')
      .send({
        title: 'Test Course',
        description: 'This is a test course',
        code: 'TEST101',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('title');
  });
});