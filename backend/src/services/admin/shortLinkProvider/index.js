const paginate = require('@helpers/paginate');

const { ShortLinkProviders } = require('@models');

const shortLinkProviderService = {
  getAllProviders: async (req) => {
    const providers = await paginate(ShortLinkProviders, req, {});

    return {
      code: 200,
      data: providers,
    };
  },

  update: async (req) => {
    const { id } = req.params;
    const provider = await ShortLinkProviders.findByPk(id);

    if (!provider) {
      throw {
        code: 404,
        messageKey: 'notfound:provider',
      };
    }

    const { name, api_key, view_limit_per_day, base_url, price } = req.body;

    provider.name = name;
    provider.api_key = api_key;
    provider.view_limit_per_day = view_limit_per_day;
    provider.base_url = base_url;
    provider.price = price;

    await provider.save();

    return {
      code: 200,
      messageKey: 'message:update_short_link_provider_success',
      data: provider,
    };
  },
};

module.exports = shortLinkProviderService;
