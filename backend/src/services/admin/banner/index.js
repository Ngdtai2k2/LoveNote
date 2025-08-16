const paginate = require('@helpers/paginate');
const { Banner } = require('@models');
const { parseBoolean } = require('@helpers');

const bannerService = {
  getAll: async (req) => {
    const { is_active } = req.query;

    const where = {};

    const boolValue = parseBoolean(is_active);

    if (boolValue !== undefined) {
      where.is_active = boolValue;
    }

    const banners = await paginate(Banner, req, {
      where,
    });

    return {
      code: 200,
      data: banners,
    };
  },

  activated: async (req) => {
    const { id } = req.params;

    const banner = await Banner.findByPk(id);

    if (!banner) {
      return {
        code: 404,
        messageKey: 'notfound:banner',
      };
    }

    banner.is_active = !banner.is_active;
    await banner.save();

    return {
      code: 200,
      messageKey: banner.is_active
        ? 'message:activated_successfully'
        : 'message:activation_failed',
    };
  },
};

module.exports = bannerService;
