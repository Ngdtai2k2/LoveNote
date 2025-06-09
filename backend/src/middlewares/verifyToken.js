const jwt = require('jsonwebtoken');

const verifyMiddleware = {
  token: (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({
        message: req.t('validate:no_token'),
      });
    }
    const accessToken = token.split(' ')[1];
    jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
      if (err) {
        return res.status(401).json({
          message: req.t('validate:invalid_token'),
        });
      }
      req.user = user;
      next();
    });
  },
  ownership: (req, res, next) => {
    verifyMiddleware.token(req, res, () => {
      if (req.user.id !== req.params.userId) {
        return res.status(403).json({ message: req.t('validate:not_allowed') });
      }
      next();
    });
  },
  admin: (req, res, next) => {
    verifyMiddleware.token(req, res, () => {
      if (req.user.role === 0) {
        return res.status(403).json({ message: req.t('validate:not_allowed') });
      }
      next();
    });
  },
};

module.exports = verifyMiddleware;
