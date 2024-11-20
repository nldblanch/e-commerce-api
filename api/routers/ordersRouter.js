import { getOrderByID } from "../controllers/orders.controller.js";
import express from "express";
const ordersRouter = express.Router();

ordersRouter.route("/:order_id").get(getOrderByID);

export default ordersRouter;
