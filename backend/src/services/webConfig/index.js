const { WebConfig } = require('@models');

const webConfigServices = {
  getAll: async () => {
    const data = await WebConfig.findAll();

    if (!data || data.length === 0) {
      throw { code: 404, messageKey: 'not_found:data' };
    }

    return data;
  },
};

module.exports = webConfigServices;
