const jwt = require('jsonwebtoken');

const verifyMiddleware = {
  token: (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: req.t('validate:no_token') });
    }
    const accessToken = token.split(' ')[1];
    jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
      if (err) {
        return res
          .status(401)
          .json({ message: req.t('validate:invalid_token') });
      }
      req.user = user;
      next();
    });
  },

  ownership:
    (
      Model,
      { idParam = 'id', ownerField = 'user_id', source = 'params' } = {}
    ) =>
    async (req, res, next) => {
      try {
        verifyMiddleware.token(req, res, async () => {
          const id =
            source === 'query'
              ? req.query[idParam]
              : source === 'body'
                ? req.body[idParam]
                : req.params[idParam];

          if (!id) {
            return res.status(400).json({ message: `Missing ${idParam}` });
          }

          const resource = await Model.findByPk(id);
          if (!resource) {
            return res
              .status(404)
              .json({ message: req.t('validate:not_found') });
          }

          if (resource[ownerField]?.toString() !== req.user.id) {
            return res
              .status(403)
              .json({ message: req.t('validate:not_allowed') });
          }

          req.resource = resource;
          next();
        });
      } catch (err) {
        return res.status(500).json({ message: req.t('message:server_error') });
      }
    },

  admin: (req, res, next) => {
    verifyMiddleware.token(req, res, () => {
      if (req.user.role === 0) {
        return res.status(403).json({ message: req.t('validate:not_allowed') });
      }
      next();
    });
  },

  adminOrOwner:
    (
      Model,
      { idParam = 'id', ownerField = 'user_id', source = 'params' } = {}
    ) =>
    async (req, res, next) => {
      try {
        verifyMiddleware.token(req, res, async () => {
          const id =
            source === 'query'
              ? req.query[idParam]
              : source === 'body'
                ? req.body[idParam]
                : req.params[idParam];

          if (!id) {
            return res.status(400).json({ message: `Missing ${idParam}` });
          }

          const resource = await Model.findByPk(id);
          if (!resource) {
            return res
              .status(404)
              .json({ message: req.t('validate:not_found') });
          }

          const isAdmin = req.user.role !== 0;
          const isOwner = resource[ownerField]?.toString() === req.user.id;

          if (!isAdmin && !isOwner) {
            return res
              .status(403)
              .json({ message: req.t('validate:not_allowed') });
          }

          req.resource = resource;
          next();
        });
      } catch (err) {
        return res.status(500).json({ message: req.t('message:server_error') });
      }
    },
};

module.exports = verifyMiddleware;
