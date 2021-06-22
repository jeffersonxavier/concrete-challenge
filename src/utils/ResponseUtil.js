module.exports = {
  processRequest: (response, serviceFunction) => {
    serviceFunction()
      .then(data => {
        response.json(data);
      })
      .catch(error => {
        console.log(error);
        if (error && error.status) {
          return response.status(error.status).json({ message: error.message });
        } else {
          return response.status(500).json({ message: 'Unknow Error!' });
        }
      });
  }
};
