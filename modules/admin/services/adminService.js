const User = require('../../auth/models/User');
const CourseRepo = require('../../courses/models/CourseRepo');

module.exports = {
  async getAnalytics() {
    const totalUsers = await User.countDocuments();
    const totalCourses = await CourseRepo.count();
    const totalInstructors = await User.countDocuments({ role: 'instructor' });
    const totalStudents = await User.countDocuments({ role: 'student' });

    return { totalUsers, totalCourses, totalInstructors, totalStudents };
  },
};