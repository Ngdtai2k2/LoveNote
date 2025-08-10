const handleError = require('@utils/handleError');
const usersService = require('@services/admin/users');

const usersController = {
  allUsers: async (req, res) => {
    try {
      const { code, data } = await usersService.allUsers(req);
      return res.status(code).json(data);
    } catch (error) {
      handleError(res, req, error);
    }
  },

  banned: async (req, res) => {
    try {
      const { code, messageKey } = await usersService.banned(req);
      return res.status(code).json({ message: req.t(messageKey) });
    } catch (error) {
      handleError(res, req, error);
    }
  },
};

module.exports = usersController;
