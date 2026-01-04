const Enrollment = require('../models/Enrollment');

module.exports = {
  async enroll(studentId, courseId) {
    const e = new Enrollment({ student: studentId, course: courseId });
    return e.save();
  },
};