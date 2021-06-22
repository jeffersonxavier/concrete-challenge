const database = require('./config/database');
const app = require('./app');

database()
  .then(() => {
    // Server
    app.listen(process.env.PORT || 3000, () => {
      console.log('Server Listen on :', process.env.PORT || 3000);
    });
  })
  .catch(error => console.log(error));
