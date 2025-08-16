const { WebConfig } = require('@models');

const webConfigServices = {
  getAll: async ({ raw = false } = {}) => {
    const webConfigs = await WebConfig.findAll({
      raw,
      attributes: raw ? { exclude: ['created_at', 'updated_at'] } : undefined,
    });

    return {
      code: 200,
      data: webConfigs,
    };
  },
};

module.exports = webConfigServices;
