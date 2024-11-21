import { postItem, patchItem, getUserItems } from "../controllers/items.controller.js";
import { getUserOrders, postOrder, patchOrder } from "../controllers/orders.controller.js";
import { getUserByID, postUser, patchUser } from "../controllers/users.controller.js";
import express from "express";
const usersRouter = express.Router();

usersRouter.route("/").post(postUser);
usersRouter.route("/:user_id").get(getUserByID).patch(patchUser);
usersRouter.route("/:user_id/items").get(getUserItems).post(postItem);
usersRouter.route("/:user_id/orders").get(getUserOrders).post(postOrder);
usersRouter.route("/:user_id/items/:item_id").patch(patchItem);
usersRouter.route("/:user_id/orders/:order_id").patch(patchOrder);

export default usersRouter;
