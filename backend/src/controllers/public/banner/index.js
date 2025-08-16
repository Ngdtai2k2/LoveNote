const bannerServices = require('@services/public/banner');
const handleError = require('@utils/handleError');

const bannerController = {
  getAll: async (req, res) => {
    try {
      const result = await bannerServices.getAll(req);
      res.status(200).json(result);
    } catch (error) {
      handleError(res, req, error);
    }
  },
};

module.exports = bannerController;
