const UserService = require('../services/UserService');
const ResponseUtil = require('../utils/ResponseUtil');
module.exports = {
  signIn: (req, res) => {
    const { email, password } = req.body;
    ResponseUtil.processRequest(res, () => UserService.signIn(email, password));
  }
};
