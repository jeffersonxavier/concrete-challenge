const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const jwtSecret =
  process.env.JWT_SCECRET || 'my-jwt-secret-change-in-production';

module.exports = {
  buildPass: pass => {
    return new Promise((resolve, reject) => {
      bcrypt.hash(pass, 7, (err, hash) => {
        if (err) return reject(err);

        resolve(hash);
      });
    });
  },

  comparePasswords: (receivedPass, userPassHash) => {
    return new Promise((resolve, reject) => {
      bcrypt.compare(receivedPass, userPassHash, (err, equals) => {
        err && reject(err);
        resolve(equals);
      });
    });
  },

  generateToken: id => {
    const expiresAt = new Date(new Date().getTime() + 1000 * 60 * 30); // 30 minutes to expire token

    const payload = { expiresAt, id };
    return jwt.sign(payload, jwtSecret);
  },

  isAuthenticated: (req, res, next) => {
    try {
      const authorization =
        req.headers.authorization && req.headers.authorization.split(' ');
      const authToken =
        authorization.length === 2 &&
        authorization[0] === 'Bearer' &&
        authorization[1];

      const payload = jwt.verify(authToken, jwtSecret);
      if (new Date() > new Date(payload.expiresAt))
        return res.status(401).json({ message: 'Token Expired!' });

      req.user = payload;
      delete req.user.expiresAt;

      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid Authorization Token!' });
    }
  }
};
