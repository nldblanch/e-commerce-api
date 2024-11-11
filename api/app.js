const express = require("express");
const api = require("./routers/api");
const app = express();
app.use(express.json());

app.use("/api", api);
app.use((error, request, response, next) => {
  console.log(error);
});
module.exports = app;
