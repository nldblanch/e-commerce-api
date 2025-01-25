const customError = (error, request, response, next) => {
  if (error.code && error.message) {
    response.status(error.code).send(error);
  } else {
    next(error);
  }
};

export default customError;
