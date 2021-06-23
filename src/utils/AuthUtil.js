const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

  generateToken: async email => {
    const jwtSecret = await bcrypt.hash(email, 7);
    return jwt.sign({ email }, jwtSecret);
  },

  isAuthenticated: (req, res, next) => {
    try {
      const authorization =
        req.headers.authorization && req.headers.authorization.split(' ');
      const authToken =
        authorization.length === 2 &&
        authorization[0] === 'Bearer' &&
        authorization[1];

      req.token = authToken;

      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  }
};
