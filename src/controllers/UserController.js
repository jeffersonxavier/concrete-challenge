const UserService = require('../services/UserService');
const ResponseUtil = require('../utils/ResponseUtil');
module.exports = {
  signIn: (req, res) => {
    const { email, password } = req.body;
    ResponseUtil.processRequest(res, () => UserService.signIn(email, password));
  },

  signUp: (req, res) => {
    ResponseUtil.processRequest(res, () => UserService.signUp(req.body), 201);
  },

  find: (req, res) => {
    const { userId } = req.params;
    ResponseUtil.processRequest(res, () => UserService.find(userId, req.token));
  }
};
