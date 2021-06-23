const UserController = require('./controllers/UserController');
const AuthUtil = require('./utils/AuthUtil');

const routes = require('express').Router();

// Routes Definition
routes.get('/', (req, res) => {
  res.json({ message: 'Welcome!!' });
});

routes.post('/signup', UserController.signUp);
routes.post('/signin', UserController.signIn);
routes.get('/find/:userId', AuthUtil.isAuthenticated, UserController.find);

module.exports = routes;
