require('dotenv').config();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { User, RefreshToken } = require('@models');
const authService = require('@services/auth');

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
      console.error('Sign Up Error:', error);
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

      const refreshTokenData = await RefreshToken.findOne({
        where: { token: refreshToken },
      });

      if (!refreshTokenData) {
        return res
          .status(401)
          .json({ message: req.t('validate:invalid_refresh_token') });
      }

      if (refreshTokenData.expiresAt < new Date()) {
        return res
          .status(401)
          .json({ message: req.t('validate:refresh_token_expired') });
      }

      const user = await User.findByPk(refreshTokenData.user_id);
      if (!user) {
        return res.status(404).json({ message: req.t('notfound:user') });
      }

      jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_KEY,
        async (err, decodedToken) => {
          if (err) {
            return res
              .status(401)
              .json({ message: req.t('validate:invalid_refresh_token') });
          }

          const accessToken = authController.generateAccessToken(decodedToken);
          const refreshToken =
            authController.generateRefreshToken(decodedToken);

          // update refresh token in database
          const newRefreshTokenData = await RefreshToken.update(
            { token: refreshToken },
            {
              where: {
                user_id: user.id,
                device_id: refreshTokenData.device_id,
              },
            }
          );

          if (!newRefreshTokenData)
            return res
              .status(401)
              .json({ message: req.t('notfound:refresh_token') });

          // set new cookie to refresh token
          res.cookie('rf', refreshToken, {
            httpOnly: true,
            secure: true,
            path: '/',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          });
          return res.json({
            token: accessToken,
          });
        }
      );
    } catch (error) {
      return res.status(500).json({ message: req.t('message:server_error') });
    }
  },

  signOut: async (req, res) => {
    try {
      const refreshToken = req.cookies.rf;
      const { deviceId } = req.body;

      if (!refreshToken) {
        return res
          .status(401)
          .json({ message: req.t('notfound:refresh_token') });
      }

      const refreshTokenData = await RefreshToken.findOne({
        where: { token: refreshToken, device_id: deviceId },
      });

      if (!refreshTokenData) {
        return res
          .status(401)
          .json({ message: req.t('validate:invalid_refresh_token') });
      }

      await RefreshToken.destroy({ where: { token: refreshToken } });
      res.clearCookie('rf');

      await User.update(
        {
          last_sign_in_ip: req.ip_address,
          sign_in_ip: null,
        },
        {
          where: { id: refreshTokenData.user_id },
        }
      );

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
        attributes: { exclude: ['password'] },
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
