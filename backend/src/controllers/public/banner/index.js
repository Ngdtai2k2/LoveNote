const bannerServices = require('@services/banner');

const bannerController = {
  getAll: async (req, res) => {
    try {
      const result = await bannerServices.getAll(req);
      res.status(200).json(result);
    } catch (error) {
      console.log(error)
      const code = error.code || 500;
      const messageKey = error.messageKey || 'message:server_error';
      res.status(code).json({ message: req.t(messageKey) });
    }
  },
};

module.exports = bannerController;
