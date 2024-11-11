const { getUserByID } = require("../controllers/users.controller");

const usersRouter = require("express").Router();

usersRouter.route("/:user_id").get(getUserByID)

module.exports = usersRouter;

