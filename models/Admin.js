// In a typical scenario, you would have an 'admin' role in your User model,
// so this file might not be strictly necessary. But if you want to maintain 
// an `Admin` model for more specific use cases, you can use this pattern.

const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, default: 'admin' },
});

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;
