const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const { port, nodeEnv, fileUploadPath } = require('./config/env');
const errorHandler = require('./middleware/errorHandler');
const { initNotifications } = require('./utils/notifications');
const logger = require('./utils/logger');
const assignmentRoutes = require('./routes/assignmentRoutes');
const lessonRoutes = require('./routes/lessonRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));

// File uploads
app.use('/uploads', express.static(fileUploadPath));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/assignments', require('./routes/assignmentRoutes'));
app.use('/api/quizzes', require('./routes/quizRoutes'));
app.use('/api/progress', require('./routes/progressRoutes'));
app.use('/api/resources', require('./routes/resourceRoutes'));
app.use('/api/forums', require('./routes/forumRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/assignments', assignmentRoutes);
app.use('/api/lessons', lessonRoutes);


// Error handling
app.use(errorHandler);

// Database connection
connectDB();

// Start server
const server = app.listen(port, () => {
  logger.info(`Server running in ${nodeEnv} mode on port ${port}`);
});

// Initialize notifications
initNotifications(server);