exports.invalidEndpoint = (request, response) => {
    response.status(404).send({status: 404, message: "404 - Not Found"})
  }