const { getEndpoints } = require("../controllers/api.controller");
const usersRouter = require("./usersRouter");

const apiRouter = require("express").Router();

apiRouter.get("/", getEndpoints);

apiRouter.use("/users", usersRouter);

module.exports = apiRouter;
