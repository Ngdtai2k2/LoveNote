const ShortLinkProviderService = require('@services/shortLinkProvider');

const ShortLinkProviderController = {
  getAllForUser: async (req, res) => {
    try {
      const { data, code } = await ShortLinkProviderService.getAllForUser(req);

      return res.status(code).json(data);
    } catch (error) {
      handleError(res, req, error);
    }
  },
};

module.exports = ShortLinkProviderController;
