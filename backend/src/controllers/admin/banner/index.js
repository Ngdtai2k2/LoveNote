const handleError = require('@utils/handleError');
const bannerService = require('@services/admin/banner');

const bannerController = {
  getAll: async (req, res) => {
    try {
      const { code, data } = await bannerService.getAll(req);
      return res.status(code).json(data);
    } catch (error) {
      handleError(res, req, error);
    }
  },

  activated: async (req, res) => {
    try {
      const { code, messageKey } = await bannerService.activated(req);
      return res.status(code).json({ message: req.t(messageKey) });
    } catch (error) {
      handleError(res, req, error);
    }
  },
};

module.exports = bannerController;
