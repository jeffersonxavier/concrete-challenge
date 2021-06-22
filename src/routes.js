const UserController = require('./controllers/UserController');

const routes = require('express').Router();

// Routes Definition
routes.get('/', (req, res) => {
  res.json({ message: 'Welcome!!' });
});

routes.post('/signin', UserController.signIn);

module.exports = routes;
