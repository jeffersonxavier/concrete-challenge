const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
  generateToken: async email => {
    const jwtSecret = await bcrypt.hash(email, 7);
    return jwt.sign({ email }, jwtSecret);
  },

  isAuthenticated: (req, res, next) => {
    const authorization =
      req.headers.authorization && req.headers.authorization.split(' ');
    if (
      !authorization ||
      authorization.length !== 2 ||
      authorization[0] !== 'Bearer'
    )
      return res.status(401).json({ message: 'Unauthorized' });

    req.token = authorization[1];

    return next();
  }
};
