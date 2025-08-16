require('dotenv').config();

const jwt = require('jsonwebtoken');

const authService = require('@services/auth');
const jwtService = require('@services/jwt');
const handleError = require('@utils/handleError');

const authController = {
  signUp: async (req, res) => {
    try {
      const messageKey = await authService.signUp(req.body);
      res.status(201).json({ message: req.t(messageKey) });
    } catch (error) {
      handleError(res, req, error);
    }
  },

  signIn: async (req, res) => {
    try {
      const { accessToken, refreshToken, deviceId } = await authService.signIn(
        req.body
      );

      res.cookie('skey', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({
        message: req.t('auth:sign_in_success'),
        token: accessToken,
        device_id: deviceId,
      });
    } catch (error) {
      handleError(res, req, error);
    }
  },

  requestRefreshToken: async (req, res) => {
    try {
      const refreshToken = req.cookies.skey;

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

          res.cookie('skey', newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/',
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
      const refreshToken = req.cookies.skey;

      if (!refreshToken) {
        return res
          .status(200)
          .json({ message: req.t('auth:sign_out_success') });
      }

      res.clearCookie('skey', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });

      return res.status(200).json({ message: req.t('auth:sign_out_success') });
    } catch (error) {
      return res.status(500).json({ message: req.t('message:server_error') });
    }
  },

  getCurrentUser: async (req, res) => {
    try {
      const userData = await authService.getCurrentUser(req);

      return res.status(200).json({ user: userData });
    } catch (error) {
      handleError(res, req, error);
    }
  },

  changePassword: async (req, res) => {
    try {
      const { code, messageKey } = await authService.changePassword(req);
      return res.status(code).json({
        message: req.t(messageKey),
      });
    } catch (error) {
      handleError(res, req, error);
    }
  },

  forgotPassword: async (req, res) => {
    try {
      const { code, messageKey } = await authService.forgotPassword(req);

      return res.status(code).json({
        message: req.t(messageKey),
      });
    } catch (error) {
      handleError(res, req, error);
    }
  },

  verifyCode: async (req, res) => {
    try {
      const { code, messageKey } = await authService.verifyCode(req);

      return res.status(code).json({
        message: req.t(messageKey),
      });
    } catch (error) {
      handleError(res, req, error);
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { code, messageKey } = await authService.resetPassword(req);

      return res.status(code).json({
        message: req.t(messageKey),
      });
    } catch (error) {
      handleError(res, req, error);
    }
  },
};

module.exports = authController;
