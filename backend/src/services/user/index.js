require('dotenv').config();

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

    if (req.files?.avatar?.[0]) {
      const file = req.files.avatar[0];
      const fileUrl = `${process.env.SERVER_URL}/assets/avatars/${userId}/${file.filename}`;

      if (user.avatar) {
        try {
          await helpers.safeUnlink(user.avatar);
        } catch (err) {
          throw {
            code: 500,
            messageKey: 'message:file_delete_failed',
          };
        }
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
