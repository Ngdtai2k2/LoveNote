const uploadMiddleware = require('@middlewares/upload');
const userServices = require('@services/user');
const handleError = require('@utils/handleError');

const userController = {
  updateProfile: async (req, res) => {
    const { userId } = req.params;
    const upload = uploadMiddleware(`${userId}`).single('file');

    upload(req, res, async (err) => {
      if (err && err.code !== 'LIMIT_UNEXPECTED_FILE') {
        return handleError(res, req, {
          code: 500,
          messageKey: 'validate:error_uploading_file',
        });
      }

      try {
        const result = await userServices.updateProfile(req);
        return res.status(200).json({ message: req.t(result.messageKey) });
      } catch (error) {
        return handleError(res, req, error);
      }
    });
  },
};

module.exports = userController;
