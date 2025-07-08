const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const { User } = require('@models');
const jwtService = require('@services/jwt');

const authService = {
  signUp: async ({ fullName, email, password }) => {
    if (!fullName || !email || !password) {
      throw { code: 400, messageKey: 'validate:all_fields_required' };
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw { code: 400, messageKey: 'validate:email_exists' };
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    await User.create({ full_name: fullName, email, password: hashedPassword });

    return 'auth:sign_up_success';
  },

  signIn: async ({ email, password }) => {
    if (!email || !password) {
      throw { code: 400, messageKey: 'validate:all_fields_required' };
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw { code: 404, messageKey: 'notfound:user' };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw { code: 401, messageKey: 'validate:invalid_password' };
    }

    const accessToken = jwtService.generateAccessToken(user);
    const refreshToken = jwtService.generateRefreshToken(user);
    const deviceId = uuidv4();

    return {
      user,
      accessToken,
      refreshToken,
      deviceId,
    };
  },

  getCurrentUser: async (req) => {
    const user = req.user;

    const userData = await User.findOne({
      where: { id: user.id },
      attributes: { exclude: ['password'] },
    });

    if (!userData) {
      throw {
        code: 404,
        messageKey: 'notfound:user',
      };
    }

    return userData;
  },

  changePassword: async (req) => {
    const user = req.user;
    const { currentPassword, newPassword } = req.body;

    const userData = await User.findByPk(user.id);

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      userData.password
    );
    if (!isPasswordValid) {
      throw {
        code: 401,
        messageKey: 'validate:invalid_password',
      };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.update(
      { password: hashedPassword },
      {
        where: { id: user.id },
      }
    );

    return {
      code: 200,
      messageKey: 'auth:change_password_success',
    };
  },
};

module.exports = authService;
