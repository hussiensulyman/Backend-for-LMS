// Sequelize support removed — project migrated to Prisma.
// Keep this file as a safe-noop to avoid accidental requires. If you encounter an error indicating Sequelize is required,
// remove the import and migrate to Prisma instead.

module.exports = {
  getSequelize() {
    throw new Error('Sequelize has been removed. Use Prisma via core/prisma.js');
  },
  async connect() {
    throw new Error('Sequelize has been removed. Use Prisma via core/prisma.connect()');
  },
};
