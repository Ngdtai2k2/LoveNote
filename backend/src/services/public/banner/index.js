const { Banner } = require('@models');
const { parseBoolean } = require('@helpers');

const bannerController = {
  getAll: async (req) => {
    const { is_active } = req.query;

    const where = {};
    const boolValue = parseBoolean(is_active);
    if (boolValue !== undefined) {
      where.is_active = boolValue;
    }

    const banners = await Banner.findAll({ where });

    return {
      code: 200,
      data: banners,
    };
  },
};

module.exports = bannerController;
