const handleError = require('@utils/handleError');
const shortLinkProviderService = require('@services/admin/shortLinkProvider');

const shortLinkProviderController = {
  getAllProviders: async (req, res) => {
    try {
      const { code, data } =
        await shortLinkProviderService.getAllProviders(req);
      return res.status(code).json(data);
    } catch (error) {
      handleError(res, req, error);
    }
  },

  update: async (req, res) => {
    try {
      const { code, data, messageKey } =
        await shortLinkProviderService.update(req);
      return res.status(code).json({ data, message: req.t(messageKey) });
    } catch (error) {
      handleError(res, req, error);
    }
  },
};

module.exports = shortLinkProviderController;
