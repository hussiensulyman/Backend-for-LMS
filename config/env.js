const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  port: process.env.PORT || 5000,
  dbType: process.env.DB_TYPE || 'mysql', // 'mongo' or 'mysql'
  databaseUrl: process.env.DATABASE_URL,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  nodeEnv: process.env.NODE_ENV,
  fileUploadPath: process.env.FILE_UPLOAD_PATH,
};