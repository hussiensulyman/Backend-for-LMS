const { dbType } = require('../../../config/env');
const bcrypt = require('bcryptjs');

if (dbType === 'mysql') {
  const { prisma } = require('../../../core/prisma');

  module.exports = {
    async findOne(where) {
      return prisma.user.findFirst({ where });
    },
    async findById(id) {
      return prisma.user.findUnique({ where: { id: Number(id) } });
    },
    async findMany() {
      return prisma.user.findMany();
    },
    async create(data) {
      if (data.password) data.password = await bcrypt.hash(data.password, 10);
      return prisma.user.create({ data });
    },
    async countDocuments(where = {}) {
      return prisma.user.count({ where });
    },
  };
} else {
  // Mongoose fallback
  const mongoose = require('mongoose');
  const { Schema } = mongoose;

  const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'instructor', 'student'], default: 'student' },
    createdAt: { type: Date, default: Date.now },
  });

  userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 10);
    }
    next();
  });

  const UserModel = mongoose.models.User || mongoose.model('User', userSchema);

  module.exports = {
    async findOne(where) {
      return UserModel.findOne(where).lean();
    },
    async findById(id) {
      return UserModel.findById(id).lean();
    },
    async findMany() {
      return UserModel.find().lean();
    },
    async create(data) {
      const u = new UserModel(data);
      await u.save();
      return u.toObject();
    },
    async countDocuments(where = {}) {
      return UserModel.countDocuments(where);
    },
  };
}
