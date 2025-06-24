require('dotenv').config();
const path = require('path');

const { User } = require('@models');
const uploadMiddleware = require('@middlewares/upload');
const helpers = require('@helpers');

const userController = {
  updateProfile: async (req, res) => {
    const { userId } = req.params;
    const upload = uploadMiddleware(`${userId}`).single('file');

    upload(req, res, async (err) => {
      if (err && err.code !== 'LIMIT_UNEXPECTED_FILE') {
        return res
          .status(500)
          .json({ message: req.t('validate:error_uploading_file') });
      }

      try {
        helpers.trimRequestBody(req.body);
        const { fullName, phoneNumber } = req.body;

        if (!fullName)
          return res
            .status(400)
            .json({ message: req.t('validate:full_name_required') });

        const user = await User.findByPk(userId);
        if (!user) {
          return res.status(404).json({ message: req.t('notfound:user') });
        }

        let fileUrl = null;
        if (req.file) {
          fileUrl = `${process.env.SERVER_URL}/assets/avatar/${userId}/${req.file.filename}`;

          // Delete the old avatar file if it exists
          if (user.avatar) {
            const oldAvatarPath = path.join(
              __dirname,
              '../../../assets/avatar',
              userId.toString(),
              path.basename(user.avatar)
            );

            helpers.deleteFile(oldAvatarPath);
          }

          await user.update({
            avatar: fileUrl,
          });
        }

        await user.update({
          full_name: fullName,
          phone_number: phoneNumber
        });

        return res.json({ message: req.t('message:profile_update_success') });
      } catch (error) {
        return res.status(500).json({ message: req.t('message:server_error') });
      }
    });
  },
};

module.exports = userController;
