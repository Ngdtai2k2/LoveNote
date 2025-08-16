const jwt = require('jsonwebtoken');

const jwtService = {
  generateAccessToken: (user) => {
    return jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_ACCESS_KEY,
      { expiresIn: '60s' }
    );
  },

  generateRefreshToken: (user, deviceId) => {
    return jwt.sign(
      { id: user.id, role: user.role, device_id: deviceId },
      process.env.JWT_REFRESH_KEY,
      { expiresIn: '7d' }
    );
  },

  verifyToken: (token, secret = process.env.JWT_ACCESS_KEY) => {
    try {
      return jwt.verify(token, secret);
    } catch (err) {
      return null;
    }
  },
};

module.exports = jwtService;
