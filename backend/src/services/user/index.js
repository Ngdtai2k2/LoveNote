require('dotenv').config();
const path = require('path');

const { User } = require('@models');
const helpers = require('@helpers');

const userServices = {
  updateProfile: async (req) => {
    const { userId } = req.params;
    helpers.trimRequestBody(req.body);

    const { fullName, phoneNumber } = req.body;

    if (!fullName) {
      throw { code: 400, messageKey: 'validate:full_name_required' };
    }

    const user = await User.findByPk(userId);
    if (!user) {
      throw { code: 404, messageKey: 'notfound:user' };
    }

    let fileUrl = null;
    if (req.file) {
      fileUrl = `${process.env.SERVER_URL}/assets/avatar/${userId}/${req.file.filename}`;

      // Delete old avatar
      if (user.avatar) {
        const oldAvatarPath = path.join(
          __dirname,
          '../../assets/avatar',
          userId.toString(),
          path.basename(user.avatar)
        );
        helpers.deleteFile(oldAvatarPath);
      }

      await user.update({ avatar: fileUrl });
    }

    await user.update({
      full_name: fullName,
      phone_number: phoneNumber,
    });

    return { messageKey: 'message:profile_update_success' };
  },
};

module.exports = userServices;
