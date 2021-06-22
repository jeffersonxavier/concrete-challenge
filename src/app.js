const express = require('express');
const routes = require('./routes');

const app = express();

// Middlewares
app.use(express.json());
app.use(routes);

module.exports = app;
