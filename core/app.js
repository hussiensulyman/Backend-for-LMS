const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const logger = require('./logger');
const { fileUploadPath } = require('../config/env');
const errorHandler = require('../middleware/errorHandler');

function createApp() {
  const app = express();

  // Middleware
  app.use(cors());

  // Capture raw body for specific routes (needed for payment provider webhooks like Stripe)
  app.use((req, res, next) => {
    if (req.path === '/api/payments/webhook') {
      let data = '';
      req.setEncoding('utf8');
      req.on('data', (chunk) => (data += chunk));
      req.on('end', () => {
        req.rawBody = data;
        next();
      });
    } else {
      next();
    }
  });

  app.use(express.json());
  app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));

  // Static files
  if (fileUploadPath) {
    app.use('/uploads', express.static(fileUploadPath));
  }

  // Serve API docs (Swagger UI) from docs/swagger.html
  const docsDir = path.join(__dirname, '..', 'docs');
  if (fs.existsSync(docsDir)) {
    app.use('/docs', express.static(docsDir));
    app.get('/api/docs', (req, res) => {
      res.sendFile(path.join(docsDir, 'swagger.html'));
    });
  }

  // Auto-register modules
  const modulesDir = path.join(__dirname, '..', 'modules');
  if (fs.existsSync(modulesDir)) {
    const moduleNames = fs.readdirSync(modulesDir).filter((name) => {
      return fs.statSync(path.join(modulesDir, name)).isDirectory();
    });

    moduleNames.forEach((name) => {
      try {
        const mod = require(path.join(modulesDir, name, 'index.js'));
        if (!mod) return;

        // Module may export a router directly or an object with `router`
        const router = mod.router || mod;
        app.use(`/api/${name}`, router);
        logger.info(`Mounted module ${name} at /api/${name}`);
      } catch (err) {
        logger.warn(`Failed to mount module ${name}: ${err.message}`);
      }
    });
  }

  // Error handler
  app.use(errorHandler);

  return app;
}

module.exports = createApp;
