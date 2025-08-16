const musicService = require('@services/public/music');
const handleError = require('@utils/handleError');

const musicController = {
  getAll: async (req, res) => {
    try {
      const { code, data } = await musicService.getAll();
      return res.status(code).json(data);
    } catch (error) {
      handleError(res, req, error);
    }
  },
};

module.exports = musicController;
