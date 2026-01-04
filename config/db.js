const mongoose = require('mongoose');
const { dbType } = require('./env');

let prismaConnector;
if (dbType === 'mysql') {
  prismaConnector = require('../core/prisma');
}

const connectDB = async () => {
  try {
    if (dbType === 'mysql') {
      await prismaConnector.connect();
      console.log('MySQL (Prisma) connected');
    } else {
      const { mongoUri } = require('./env');
      await mongoose.connect(mongoUri);
      console.log('MongoDB connected');
    }
  } catch (err) {
    console.error('DB connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;