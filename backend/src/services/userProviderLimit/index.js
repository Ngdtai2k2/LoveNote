const { User, ShortLinkProviders, UserProviderLimit } = require('@models');

const userProviderLimitService = {
  create: async (req) => {
    const { providerId } = req.body;
    const userId = req.user.id;

    const user = await User.findByPk(userId);

    if (!user) {
      throw {
        code: 404,
        messageKey: 'notfound:user',
      };
    }

    const provider = await ShortLinkProviders.findByPk(providerId);

    if (!provider) {
      throw {
        code: 404,
        messageKey: 'notfound:provider',
      };
    }

    let data = await UserProviderLimit.findOne({
      where: { user_id: user.id, provider_id: provider.id },
    });

    if (!data) {
      data = await UserProviderLimit.create({
        user_id: user.id,
        provider_id: provider.id,
        views_today: provider.view_limit_per_day,
        last_reset_date: new Date(),
      });
      return data;
    }

    return data;
  },
};

module.exports = userProviderLimitService;
