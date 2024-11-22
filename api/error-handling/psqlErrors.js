const missingKey = (error, request, response, next) => {
  if (error.code === "23502") {
    response.status(400).send({ message: "bad request - missing key" });
  } else {
    next(error);
  }
};

const invalidColumn = (error, request, response, next) => {
  if (error.code === "42703") {
    response.status(400).send({ message: "bad request - column does not exist" });
  } else {
    next(error);
  }
};

export { missingKey, invalidColumn };
