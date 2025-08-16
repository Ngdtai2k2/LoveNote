const { ShortLinkProviders, UserProviderLimit } = require('@models');

const ShortLinkProviderService = {
  getAllForUser: async (req) => {
    const userId = req.user.id;

    const providers = await ShortLinkProviders.findAll({
      attributes: { exclude: ['api_key', 'base_url'] },
      include: [
        {
          model: UserProviderLimit,
          as: 'user_provider',
          attributes: ['views_today'],
          where: { user_id: userId },
          required: false,
        },
      ],
    });

    if (!providers) {
      throw {
        code: 404,
        messageKey: 'notfound:provider',
      };
    }

    return {
      code: 200,
      data: providers,
    };
  },
};

module.exports = ShortLinkProviderService;
