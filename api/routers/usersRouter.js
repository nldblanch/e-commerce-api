import {getUserByID, postUser, patchUser} from "../controllers/users.controller";
import express from "express";
const usersRouter = express.Router();

usersRouter.route("/:user_id").get(getUserByID).patch(patchUser);

usersRouter.route("/").post(postUser)

export default usersRouter;
