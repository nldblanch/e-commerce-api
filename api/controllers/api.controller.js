import fetchEndpoints from "../models/api.model.js";

const getEndpoints = (request, response, next) => {
  fetchEndpoints().then((endpoints) => {
    response.status(200).send({ endpoints });
  });
};

export default getEndpoints;
