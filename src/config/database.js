const mongoose = require('mongoose');

module.exports = () => {
  return new Promise((resolve, reject) => {
    if (!process.env.MONGODB_CONCRETE_CHALLENGE)
      return reject('Provide a database url connection!');

    mongoose
      .connect(process.env.MONGODB_CONCRETE_CHALLENGE, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
      })
      .then(() => {
        console.log('MongoDB Connected!');
        resolve();
      })
      .catch(error => reject(error));
  });
};
