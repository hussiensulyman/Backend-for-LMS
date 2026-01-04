const { PrismaClient } = require('@prisma/client');
const logger = require('./logger');

const prisma = new PrismaClient({
  log: [
    { level: 'query', emit: 'event' },
    { level: 'error', emit: 'event' },
    { level: 'warn', emit: 'event' },
  ],
});

prisma.$on('query', (e) => logger.debug(e.query));
prisma.$on('error', (e) => logger.error(e));
prisma.$on('warn', (e) => logger.warn(e.message));

async function connect() {
  try {
    await prisma.$connect();
    logger.info('Prisma connected');
  } catch (err) {
    logger.error('Prisma connection error', err);
    throw err;
  }
}

async function disconnect() {
  await prisma.$disconnect();
}

module.exports = { prisma, connect, disconnect };
