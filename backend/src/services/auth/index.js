require('dotenv').config();
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const { User, PasswordResetCode } = require('@models');
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

    if (!currentPassword || !newPassword) {
      throw { code: 400, messageKey: 'validate:no_data' };
    }

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

    const isSamePassword = await bcrypt.compare(newPassword, userData.password);
    if (isSamePassword) {
      throw {
        code: 400,
        messageKey: 'validate:new_password_same_as_old',
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

  forgotPassword: async (req) => {
    const { email } = req.body;

    if (!email) {
      throw { code: 400, messageKey: 'validate:no_data' };
    }

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      throw {
        code: 404,
        messageKey: 'notfound:user',
      };
    }

    const code = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your Password Reset Token',
        html: `<div>
        <p>Dear ${email},</p>
        <p>You recently requested to reset your password. Please use the following token to reset your password:</p>
        <p style="font-size: 20px;"><strong>${code}</strong></p>
        <p>The token is only valid for 10 minutes.</p>
        <p>If you did not request a password reset, please ignore this email.</p>
        <p>Best regards,<br>${process.env.EMAIL_USER}</p>
      </div>`,
      });

      await PasswordResetCode.create({
        email,
        code,
        used: false,
        expires_at: expiresAt,
      });

      return {
        code: 200,
        messageKey: 'message:code_sent_success',
      };
    } catch (error) {
      throw {
        code: 500,
        messageKey: 'error:email_send_failed',
      };
    }
  },

  verifyCode: async (req) => {
    const { email, code } = req.body;

    if (!email || !code) {
      throw { code: 400, messageKey: 'validate:no_data' };
    }

    const record = await PasswordResetCode.findOne({
      where: { email, code, used: false },
      order: [['created_at', 'DESC']],
    });

    if (!record || new Date() > new Date(record.expires_at)) {
      throw {
        code: 400,
        messageKey: 'message:code_expired',
      };
    }

    record.used = true;
    await record.save();

    return {
      code: 200,
      messageKey: 'message:verification_successful',
    };
  },

  resetPassword: async (req) => {
    const { email, newPassword, code } = req.body;

    if (!email || !newPassword || !code) {
      throw { code: 400, messageKey: 'validate:no_data' };
    }

    const resetRecord = await PasswordResetCode.findOne({
      where: { email, code, used: true },
      order: [['created_at', 'DESC']],
    });

    if (!resetRecord || new Date() > new Date(resetRecord.expires_at)) {
      throw {
        code: 400,
        messageKey: 'message:code_expired',
      };
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw {
        code: 404,
        messageKey: 'notfound:user',
      };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    await user.save();

    return {
      code: 200,
      messageKey: 'message:reset_password_successful',
    };
  },
};

module.exports = authService;
