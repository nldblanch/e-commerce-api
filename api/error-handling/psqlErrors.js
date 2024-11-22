const psqlErrors = (error, request, response, next) => {
  switch (error.code) {
    case "23502":
      response.status(400).send({ message: "bad request - missing key" });
      break;
    case "42703":
      response.status(400).send({ message: "bad request - column does not exist" });
      break;
    case "23514":
      response.status(409).send({ message: "conflict - buyer id cannot match seller id" });
      break;
    default:
      next(error);
      break;
  }
};

export default psqlErrors;
