const { fetchEndpoints } = require("../models/api.model");

exports.getEndpoints = (request, response, next) => {
  fetchEndpoints().then((endpoints) => {
    response.status(200).send({ endpoints });
  });
};
