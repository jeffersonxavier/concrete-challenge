module.exports = {
  processRequest: (response, serviceFunction, successStatus = 200) => {
    serviceFunction()
      .then(data => {
        response.status(successStatus).json(data);
      })
      .catch(error => {
        if (error && error.status) {
          return response.status(error.status).json({ message: error.message });
        } else {
          return response.status(500).json({ message: 'Unknow Error!' });
        }
      });
  }
};
