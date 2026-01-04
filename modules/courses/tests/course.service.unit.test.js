const courseService = require('../services/courseService');
const CourseRepo = require('../models/CourseRepo');
const User = require('../../auth/models/User');

jest.mock('../models/CourseRepo');
jest.mock('../../auth/models/User');

test('createCourse throws if user not instructor', async () => {
  User.findById.mockResolvedValue({ id: 2, role: 'student' });
  await expect(courseService.createCourse(2, { title: 't', description: 'd', code: 'C1' })).rejects.toMatchObject({ status: 403 });
});

test('createCourse creates when user is instructor', async () => {
  User.findById.mockResolvedValue({ id: 3, role: 'instructor' });
  CourseRepo.create.mockResolvedValue({ id: 10, title: 't' });
  const res = await courseService.createCourse(3, { title: 't', description: 'd', code: 'C1' });
  expect(res).toHaveProperty('id', 10);
});