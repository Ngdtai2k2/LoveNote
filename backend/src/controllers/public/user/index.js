const userServices = require('@services/public/user');
const handleError = require('@utils/handleError');

const userController = {
  updateProfile: async (req, res) => {
    try {
      const result = await userServices.updateProfile(req);
      return res.status(200).json({ message: req.t(result.messageKey) });
    } catch (error) {
      return handleError(res, req, error);
    }
  },
};

module.exports = userController;
