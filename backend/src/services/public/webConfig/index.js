const { WebConfig } = require('@models');

const webConfigServices = {
  getAll: async ({ raw = false } = {}) => {
    const data = await WebConfig.findAll({
      raw,
      attributes: raw ? { exclude: ['created_at', 'updated_at'] } : undefined,
    });

    if (!data || data.length === 0) {
      throw { code: 404, messageKey: 'notfound:data' };
    }

    return data;
  },
};

module.exports = webConfigServices;
