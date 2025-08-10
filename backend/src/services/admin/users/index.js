const paginate = require('@helpers/paginate');
const { User } = require('@models');

const usersService = {
  allUsers: async (req) => {
    const users = await paginate(User, req, {
      where: { role: 0 },
      attributes: [
        'id',
        'avatar',
        'full_name',
        'email',
        'phone_number',
        'is_banned',
        'created_at',
      ],
    });

    return {
      code: 200,
      data: users,
    };
  },

  banned: async (req) => {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      throw {
        code: 404,
        messageKey: 'notfound:user',
      };
    }

    user.is_banned = !user.is_banned;
    await user.save();

    return {
      code: 200,
      messageKey: user.is_banned
        ? 'message:banned_user_success'
        : 'message:unbanned_user_success',
    };
  },
};

module.exports = usersService;
