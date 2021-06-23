const bcrypt = require('bcryptjs');
const User = require('../../src/models/User');
const UserService = require('../../src/services/UserService');
const AuthUtil = require('../../src/utils/AuthUtil');

describe('UserService', () => {
  const userData = {
    name: 'test',
    email: 'test@email.com',
    password: '123456',
    save: () => Promise.resolve()
  };
  const userComplete = {
    ...userData,
    _id: 'id_user',
    token: 'jsonwebtokentest',
    lastLogin: new Date(),
    toJSON: () => ({ ...userData, _id: 'id_user', token: 'jsonwebtokentest' })
  };

  it('should create user with new email', async () => {
    jest.spyOn(User, 'findOne').mockReturnValue(null);
    jest.spyOn(bcrypt, 'hash').mockReturnValue('654321');
    jest
      .spyOn(AuthUtil, 'generateToken')
      .mockReturnValue(Promise.resolve('jsonwebtokentest'));
    jest.spyOn(User, 'create').mockReturnValue(userComplete);

    const user = await UserService.signUp(userData);
    expect(User.findOne).toHaveBeenCalled();
    expect(AuthUtil.generateToken).toHaveBeenCalled();
    expect(bcrypt.hash).toHaveBeenCalled();
    expect(User.create).toHaveBeenCalled();
    expect(user._id).toBe('id_user');
    expect(user.token).toBe('jsonwebtokentest');
  });

  it('should not create user with duplicated email', async () => {
    jest.spyOn(User, 'findOne').mockReturnValue({});

    try {
      await UserService.signUp(userData);
      throw new Error({});
    } catch (error) {
      expect(User.findOne).toHaveBeenCalled();
      expect(error.status).toBe(400);
      expect(error.message).toBe('E-mail already registered');
    }
  });

  it('should signIn with valid credentials', async () => {
    jest.spyOn(User, 'findOne').mockReturnValue(userComplete);
    jest.spyOn(bcrypt, 'compare').mockReturnValue(Promise.resolve(true));
    jest
      .spyOn(AuthUtil, 'generateToken')
      .mockReturnValue(Promise.resolve('jsonwebtokentest'));

    const user = await UserService.signIn(userData);
    expect(User.findOne).toHaveBeenCalled();
    expect(bcrypt.compare).toHaveBeenCalled();
    expect(AuthUtil.generateToken).toHaveBeenCalled();
    expect(user._id).toBe('id_user');
    expect(user.token).toBe('jsonwebtokentest');
  });

  it('should not signIn with invalid email', async () => {
    jest.spyOn(User, 'findOne').mockReturnValue(null);

    try {
      await UserService.signIn(userData);
      throw new Error();
    } catch (error) {
      expect(User.findOne).toHaveBeenCalled();
      expect(error.status).toBe(401);
      expect(error.message).toBe('User/Password Invalid');
    }
  });

  it('should not signIn with invalid password', async () => {
    jest.spyOn(User, 'findOne').mockReturnValue(userComplete);
    jest.spyOn(bcrypt, 'compare').mockReturnValue(Promise.resolve(false));

    try {
      await UserService.signIn(userData);
      throw new Error({});
    } catch (error) {
      expect(User.findOne).toHaveBeenCalled();
      expect(bcrypt.compare).toHaveBeenCalled();
      expect(error.status).toBe(401);
      expect(error.message).toBe('User/Password Invalid');
    }
  });

  it('should find user', async () => {
    jest.spyOn(User, 'findById').mockReturnValue(userComplete);

    const user = await UserService.find('id_user', 'jsonwebtokentest');
    expect(User.findById).toHaveBeenCalled();
    expect(user._id).toBe('id_user');
    expect(user.token).toBe('jsonwebtokentest');
  });

  it('should not find user with invalid id', async () => {
    jest.spyOn(User, 'findById').mockReturnValue(null);

    try {
      await UserService.find('id_user_invalid', 'jsonwebtokentest');
      throw new Error({});
    } catch (error) {
      expect(User.findById).toHaveBeenCalled();
      expect(error.status).toBe(401);
      expect(error.message).toBe('Unauthorized');
    }
  });

  it('should not find user with invalid token', async () => {
    jest.spyOn(User, 'findById').mockReturnValue(userComplete);

    try {
      await UserService.find('id_user', 'jsonwebtokentestinvalid');
      throw new Error({});
    } catch (error) {
      expect(User.findById).toHaveBeenCalled();
      expect(error.status).toBe(401);
      expect(error.message).toBe('Unauthorized');
    }
  });

  it('should not find user with expired token', async () => {
    jest.spyOn(User, 'findById').mockReturnValue({
      ...userComplete,
      lastLogin: new Date(new Date().getTime() - 1000 * 60 * 60) // 1 hour
    });

    try {
      await UserService.find('id_user', 'jsonwebtokentest');
      throw new Error({});
    } catch (error) {
      expect(User.findById).toHaveBeenCalled();
      expect(error.status).toBe(401);
      expect(error.message).toBe('Invalid Session');
    }
  });
});
