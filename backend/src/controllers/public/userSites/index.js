const handleError = require('@utils/handleError');
const userSiteServices = require('@services/userSites');
const uploadMiddleware = require('@middlewares/upload');

const userSitesController = {
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
      const upload = uploadMiddleware(`${req.userId}`).single('file');

      upload(req, res, async (err) => {
        if (err && err.code !== 'LIMIT_UNEXPECTED_FILE') {
          return handleError(res, req, {
            code: 500,
            messageKey: 'validate:error_uploading_file',
          });
        }

        try {
          const result = await userSiteServices.createConfigSite(req);
          return res
            .status(200)
            .json({ message: req.t(result.messageKey), data: result.data });
        } catch (error) {
          return handleError(res, req, error);
        }
      });
    } catch (error) {
      handleError(res, req, error);
    }
  },
};

module.exports = userSitesController;
