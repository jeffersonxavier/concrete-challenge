const app = require('./app');

// Server
app.listen(process.env.PORT || 3000, () => {
  console.log('Server Listen on :', process.env.PORT || 3000);
});
