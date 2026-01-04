const Resource = require('../models/Resource');

module.exports = {
  async uploadResource(data) {
    const r = new Resource(data);
    return r.save();
  },
};