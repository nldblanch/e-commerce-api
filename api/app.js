import express from "express";
import apiRouter from "./routers/apiRouter";
import invalidEndpoint from "./error-handling/invalidEndpoint";
const app = express();
app.use(express.json());

app.use("/api", apiRouter);
app.all("*", invalidEndpoint);
app.use((error, request, response, next) => {
  if (error.code === "42703") {
    response
      .status(400)
      .send({ message: "bad request - column does not exist" });
  } else {
    next(error);
  }
});
app.use((error, request, response, next) => {
  if (error.flag === "patch") {
    response.status(error.code).send({ message: error.message });
  } else {
    next(error);
  }
});
app.use((error, request, response, next) => {
  if (error.code === "23502") {
    response
    .status(400)
    .send({message: "bad request - missing key"})
  } else {
    next(error)
  }
})
app.use((error, request, response, next) => {
  if (error.code && error.message) {
    response.status(error.code).send({ message: error.message });
  } else {
    next(error);
  }
});

export default app;
