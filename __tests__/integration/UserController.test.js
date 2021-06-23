const request = require('supertest');
const bcrypt = require('bcryptjs');
const app = require('../../src/app');
const User = require('../../src/models/User');
const database = require('../config/database-tests');

describe('UserController', () => {
  const userComplete = {
    name: 'User',
    email: 'user@email.com',
    password: '123456',
    phones: [
      { code: '01', number: '123456789' },
      { code: '02', number: '987654321' }
    ]
  };

  beforeAll(async () => {
    await database();
  });

  beforeEach(async () => {
    await User.deleteMany();
  });

  it('should signUp with valid body', async () => {
    const response = await request(app).post('/signUp').send(userComplete);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');
    expect(response.body).toHaveProperty('lastLogin');
    expect(response.body).toHaveProperty('createdAt');
    expect(response.body).toHaveProperty('updatedAt');
    expect(response.body).toHaveProperty('token');
    expect(response.body.password).toBeFalsy();
  });

  it('should not signUp with duplicated email', async () => {
    await User.create({
      ...userComplete,
      lastLogin: new Date(),
      token: 'jsonwebtokentest'
    });
    const response = await request(app).post('/signUp').send(userComplete);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('E-mail already registered');
  });

  it('should signIn with valid credentials', async () => {
    await User.create({
      ...userComplete,
      password: await bcrypt.hash('123456', 7),
      lastLogin: new Date(),
      token: 'jsonwebtokentest'
    });
    const response = await request(app)
      .post('/signIn')
      .send({ email: 'user@email.com', password: '123456' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id');
    expect(response.body).toHaveProperty('lastLogin');
    expect(response.body).toHaveProperty('createdAt');
    expect(response.body).toHaveProperty('updatedAt');
    expect(response.body).toHaveProperty('token');
    expect(response.body.password).toBeFalsy();
  });

  it('should not signIn with invalid email', async () => {
    await User.create({
      ...userComplete,
      lastLogin: new Date(),
      token: 'jsonwebtokentest'
    });
    const response = await request(app)
      .post('/signIn')
      .send({ email: 'invalid@email.com', password: '123456' });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('User/Password Invalid');
  });

  it('should not signIn with invalid password', async () => {
    await User.create({
      ...userComplete,
      lastLogin: new Date(),
      token: 'jsonwebtokentest'
    });
    const response = await request(app)
      .post('/signIn')
      .send({ email: 'test@email.com', password: 'invalid' });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('User/Password Invalid');
  });

  it('should find user with valid params', async () => {
    const user = await User.create({
      ...userComplete,
      lastLogin: new Date(),
      token: 'jsonwebtokentest'
    });
    const response = await request(app)
      .get(`/find/${user._id}`)
      .set('Authorization', `Bearer jsonwebtokentest`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id');
    expect(response.body).toHaveProperty('lastLogin');
    expect(response.body).toHaveProperty('createdAt');
    expect(response.body).toHaveProperty('updatedAt');
    expect(response.body).toHaveProperty('token');
    expect(response.body.password).toBeFalsy();
  });

  it('should not find user with invalid id', async () => {
    await User.create({
      ...userComplete,
      lastLogin: new Date(),
      token: 'jsonwebtokentest'
    });
    const response = await request(app)
      .get(`/find/123456789012`)
      .set('Authorization', `Bearer jsonwebtokentest`);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Unauthorized');
  });

  it('should not find user with invalid token', async () => {
    const user = await User.create({
      ...userComplete,
      lastLogin: new Date(),
      token: 'jsonwebtokentest'
    });
    const response = await request(app)
      .get(`/find/${user._id}`)
      .set('Authorization', `Bearer jsonwebtokentestinvalid`);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Unauthorized');
  });

  it('should not find user with invalid session', async () => {
    const user = await User.create({
      ...userComplete,
      lastLogin: new Date(new Date().getTime() - 1000 * 60 * 60), // 1 hour
      token: 'jsonwebtokentest'
    });
    const response = await request(app)
      .get(`/find/${user._id}`)
      .set('Authorization', `Bearer jsonwebtokentest`);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid Session');
  });
});
