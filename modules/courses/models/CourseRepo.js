const { dbType } = require('../../../config/env');

if (dbType === 'mysql') {
  const { prisma } = require('../../../core/prisma');

  module.exports = {
    async create(data) {
      return prisma.course.create({ data });
    },

    async findById(id) {
      return prisma.course.findUnique({ where: { id: Number(id) }, include: { instructor: true, lessons: true } });
    },

    async findMany() {
      return prisma.course.findMany({ include: { instructor: true } });
    },

    async findOne(where) {
      return prisma.course.findFirst({ where });
    },

    async update(id, data) {
      return prisma.course.update({ where: { id: Number(id) }, data });
    },

    async count() {
      return prisma.course.count();
    },

    async isStudentEnrolled(courseId, studentId) {
      const r = await prisma.enrollment.findFirst({ where: { courseId: Number(courseId), studentId: Number(studentId) } });
      return !!r;
    },

    async enrollStudent(courseId, studentId) {
      return prisma.enrollment.create({ data: { courseId: Number(courseId), studentId: Number(studentId) } });
    },
  };
} else {
  // Mongoose fallback
  const Course = require('./Course');

  module.exports = {
    async create(data) {
      const course = new Course(data);
      return course.save();
    },

    async findById(id) {
      return Course.findById(id).populate('instructor', 'name');
    },

    async findMany() {
      return Course.find().populate('instructor', 'name');
    },

    async findOne(where) {
      return Course.findOne(where);
    },

    async update(id, data) {
      const c = await Course.findById(id);
      if (!c) return null;
      Object.assign(c, data);
      return c.save();
    },

    async count() {
      return Course.countDocuments();
    },

    async isStudentEnrolled(courseId, studentId) {
      const course = await Course.findById(courseId);
      if (!course) return false;
      return course.students.some((s) => String(s) === String(studentId));
    },

    async enrollStudent(courseId, studentId) {
      const course = await Course.findById(courseId);
      course.students.push(studentId);
      await course.save();
      return course;
    },
  };
}
