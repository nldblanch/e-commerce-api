import getUserByID from "../controllers/users.controller";
import express from "express";
const usersRouter = express.Router();

usersRouter.route("/:user_id").get(getUserByID);

export default usersRouter;
