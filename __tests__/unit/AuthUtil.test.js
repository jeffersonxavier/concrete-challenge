const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AuthUtil = require('../../src/utils/AuthUtil');

describe('AuthUtil', () => {
  it('should generate token', async () => {
    jest.spyOn(bcrypt, 'hash').mockReturnValue(Promise.resolve('654321'));
    jest.spyOn(jwt, 'sign').mockReturnValue('jsonwebtokentest');

    const token = await AuthUtil.generateToken('test@email.com');
    expect(bcrypt.hash).toHaveBeenCalled();
    expect(jwt.sign).toHaveBeenCalled();
    expect(token).toBe('jsonwebtokentest');
  });

  it('should verify is authenticated', async () => {
    const req = { headers: { authorization: 'Bearer jsonwebtokentest' } };
    const res = { status: _ => ({ json: _ => {} }) };

    AuthUtil.isAuthenticated(req, res, jest.fn());
    expect(req.token).toBe('jsonwebtokentest');
  });

  it('should verify is authenticated with invalid token', async () => {
    const req = { headers: { authorization: 'invalid' } };
    const res = { status: _ => ({ json: _ => {} }) };

    AuthUtil.isAuthenticated(req, res, jest.fn());
    expect(req.token).toBeFalsy();

    AuthUtil.isAuthenticated({ headers: {} }, res, jest.fn());
    expect(req.token).toBeFalsy();
  });
});
