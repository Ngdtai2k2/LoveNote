const bannerServices = require('@services/public/banner');
const handleError = require('@utils/handleError');

const bannerController = {
  getAll: async (req, res) => {
    try {
      const { code, data } = await bannerServices.getAll(req);
      res.status(code).json(data);
    } catch (error) {
      handleError(res, req, error);
    }
  },
};

module.exports = bannerController;
