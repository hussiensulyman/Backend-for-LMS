const CourseRepo = require('../models/CourseRepo');
const User = require('../../auth/models/User');

module.exports = {
  async createCourse(userId, { title, description, code }) {
    const instructor = await User.findById(userId);
    const id = instructor?.id || instructor?._id;
    if (!instructor || (instructor.role && instructor.role !== 'instructor')) {
      const err = new Error('Only instructors can create courses');
      err.status = 403;
      throw err;
    }

    const data = {
      title,
      description,
      code,
      instructorId: Number(id) || id,
    };

    return CourseRepo.create(data);
  },

  async updateCourse(id, payload) {
    return CourseRepo.update(id, payload);
  },

  async getCourses() {
    return CourseRepo.findMany();
  },

  async enrollStudent(courseCodeOrId, studentId) {
    // allow passing either code or id
    let course = null;
    if (isNaN(Number(courseCodeOrId))) {
      course = await CourseRepo.findOne({ code: courseCodeOrId });
    } else {
      course = await CourseRepo.findById(courseCodeOrId);
    }

    if (!course) {
      const err = new Error('Course not found');
      err.status = 404;
      throw err;
    }

    const student = await User.findById(studentId);
    const id = student?.id || student?._id;
    if (!student || student.role !== 'student') {
      const err = new Error('Only students can enroll in courses');
      err.status = 403;
      throw err;
    }

    const already = await CourseRepo.isStudentEnrolled(course.id || course._id, id);
    if (already) {
      const err = new Error('You are already enrolled in this course');
      err.status = 400;
      throw err;
    }

    return CourseRepo.enrollStudent(course.id || course._id, id);
  },

  async getProgress(courseId) {
    const course = await CourseRepo.findById(courseId);
    if (!course) {
      const err = new Error('Course not found');
      err.status = 404;
      throw err;
    }

    const totalLessons = (course.lessons || []).length;
    const completedLessons = (course.completedLessons || []).length;
    const progress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
    return { progress };
  },
};
