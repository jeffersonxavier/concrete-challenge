const routes = require('express').Router();

// Routes Definition
routes.get('/', (req, res) => {
  res.json({ message: 'Welcome!!' });
});

module.exports = routes;
