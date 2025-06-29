const handleError = require('@utils/handleError');
const userSiteServices = require('@services/userSites');

const userSitesController = {
  checkSlugExists: async (req, res) => {
    try {
      const data = await userSiteServices.checkSlugExists(req);
      return res.status(200).json(data);
    } catch (error) {
      handleError(res, req, error);
    }
  },
  getConfigSite: async (req, res) => {
    try {
      const data = await userSiteServices.getConfigSite(req);
      return res.status(200).json(data);
    } catch (error) {
      handleError(res, req, error);
    }
  },

  createConfigSite: async (req, res) => {
    try {
      const result = await userSiteServices.createConfigSite(req);
      return res.status(200).json({
        message: req.t(result.messageKey),
        data: result.data,
      });
    } catch (error) {
      return handleError(res, req, error);
    }
  },
};

module.exports = userSitesController;
