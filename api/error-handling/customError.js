const customError = (error, request, response, next) => {
  if (error.code && error.message) {
    response.status(error.code).send({ message: error.message });
  } else {
    next(error);
  }
};

export default customError;
