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
};

module.exports = usersService;
