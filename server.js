const createApp = require('./core/app');
const connectDB = require('./config/db');
const { port, nodeEnv } = require('./config/env');
const logger = require('./core/logger');
const { initNotifications } = require('./utils/notifications');

const app = createApp();

// Only start server when run directly
if (require.main === module) {
  // Database connection
  connectDB();

  // Start server
  const server = app.listen(port, () => {
    logger.info(`Server running in ${nodeEnv} mode on port ${port}`);
  });

  // Initialize notifications
  initNotifications(server);
}

// Export app for testing
module.exports = app;