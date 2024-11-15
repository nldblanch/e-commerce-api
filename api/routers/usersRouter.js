import {
  postItem,
  patchItem,
  getUserItems,
} from "../controllers/items.controller.js";
import {
  getUserByID,
  postUser,
  patchUser,
} from "../controllers/users.controller.js";
import express from "express";
const usersRouter = express.Router();

usersRouter.route("/").post(postUser);
usersRouter.route("/:user_id").get(getUserByID).patch(patchUser);
usersRouter.route("/:user_id/items").get(getUserItems).post(postItem);
usersRouter.route("/:user_id/items/:item_id").patch(patchItem);

export default usersRouter;
