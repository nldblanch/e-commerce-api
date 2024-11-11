const express = require("express");
const apiRouter = require("./routers/apiRouter");
const app = express();
app.use(express.json());

app.use("/api", apiRouter);
app.use((error, request, response, next) => {
  console.log(error);
});
module.exports = app;
