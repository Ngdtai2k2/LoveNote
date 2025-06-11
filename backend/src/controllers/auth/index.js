require('dotenv').config();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { User } = require('@models');
const authService = require('@services/auth');
const jwtService = require('@services/jwt');

const authController = {
  signUp: async (req, res) => {
    try {
      const messageKey = await authService.signUp(req.body);
      res.status(201).json({ message: req.t(messageKey) });
    } catch (error) {
      const code = error.code || 500;
      const messageKey = error.messageKey || 'message:server_error';
      res.status(code).json({ message: req.t(messageKey) });
    }
  },

  signIn: async (req, res) => {
    try {
      const { accessToken, refreshToken, deviceId } = await authService.signIn(
        req.body
      );

      res.cookie('rf', refreshToken, {
        httpOnly: true,
        secure: true,
        path: '/',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({
        message: req.t('auth:sign_in_success'),
        token: accessToken,
        device_id: deviceId,
      });
    } catch (error) {
      const code = error.code || 500;
      const messageKey = error.messageKey || 'message:server_error';
      res.status(code).json({ message: req.t(messageKey) });
    }
  },

  requestRefreshToken: async (req, res) => {
    try {
      const refreshToken = req.cookies.rf;

      if (!refreshToken) {
        return res
          .status(401)
          .json({ message: req.t('notfound:refresh_token') });
      }

      jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_KEY,
        (err, decodedToken) => {
          if (err) {
            return res
              .status(401)
              .json({ message: req.t('validate:invalid_refresh_token') });
          }

          const { id, role, device_id } = decodedToken;

          const accessToken = jwtService.generateAccessToken({ id, role });
          const newRefreshToken = jwtService.generateRefreshToken(
            { id, role },
            device_id
          );

          res.cookie('rf', newRefreshToken, {
            httpOnly: true,
            secure: true,
            path: '/',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
          });

          return res.json({ token: accessToken });
        }
      );
    } catch (error) {
      return res.status(500).json({ message: req.t('message:server_error') });
    }
  },

  signOut: async (req, res) => {
    try {
      const refreshToken = req.cookies.rf;

      if (!refreshToken) {
        return res
          .status(200)
          .json({ message: req.t('auth:sign_out_success') });
      }

      res.clearCookie('rf', {
        httpOnly: true,
        secure: true,
        path: '/',
        sameSite: 'strict',
      });

      return res.status(200).json({ message: req.t('auth:sign_out_success') });
    } catch (error) {
      return res.status(500).json({ message: req.t('message:server_error') });
    }
  },

  getCurrentUser: async (req, res) => {
    try {
      const user = req.user;

      const userData = await User.findOne({
        where: { id: user.id },
        attributes: { exclude: ['password', 'role'] },
      });

      if (!userData) {
        return res.status(404).json({ message: req.t('notfound:user') });
      }

      return res.status(200).json({ user: userData });
    } catch (error) {
      return res.status(500).json({ message: req.t('message:server_error') });
    }
  },

  changePassword: async (req, res) => {
    try {
      const user = req.user;
      const { currentPassword, newPassword } = req.body;

      const userData = await User.findByPk(user.id);

      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        userData.password
      );
      if (!isPasswordValid) {
        return res
          .status(401)
          .json({ message: req.t('validate:invalid_password') });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await User.update(
        { password: hashedPassword },
        {
          where: { id: user.id },
        }
      );

      return res
        .status(200)
        .json({ message: req.t('auth:change_password_success') });
    } catch (error) {
      return res.status(500).json({ message: req.t('message:server_error') });
    }
  },
};

module.exports = authController;
