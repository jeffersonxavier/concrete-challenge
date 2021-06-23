const bcrypt = require('bcryptjs');
const User = require('../models/User');
const AuthUtil = require('../utils/AuthUtil');

module.exports = {
  signUp: async userToCreate => {
    let user = await User.findOne({ email: userToCreate.email });
    if (user) throw { status: 400, message: 'E-mail already registered' };

    const password = await bcrypt.hash(userToCreate.password, 7);

    user = await User.create({
      ...userToCreate,
      lastLogin: new Date(),
      password,
      token: await AuthUtil.generateToken(userToCreate.email)
    });

    return user.toJSON();
  },

  signIn: async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) throw { status: 401, message: 'User/Password Invalid' };

    const equalsPass = await bcrypt.compare(password, user.password);
    if (!equalsPass) throw { status: 401, message: 'User/Password Invalid' };

    user.token = await AuthUtil.generateToken(user.email);
    user.lastLogin = new Date();
    await user.save();

    return user.toJSON();
  },

  find: async (id, token) => {
    const user = await User.findById(id);
    if (!user || user.token !== token)
      throw { status: 401, message: 'Unauthorized' };

    const passedTime =
      (new Date().getTime() - new Date(user.lastLogin).getTime()) / (1000 * 60); // Time in minutes
    if (passedTime > 30) throw { status: 401, message: 'Invalid Session' };

    return user.toJSON();
  }
};
