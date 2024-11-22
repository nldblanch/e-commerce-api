import { getOrderByID } from "../controllers/orders.controller.js";
import { getFeedbackByOrderID, postFeedback } from "../controllers/feedback.controller.js";
import express from "express";
const ordersRouter = express.Router();

ordersRouter.route("/:order_id").get(getOrderByID);
ordersRouter.route("/:order_id/feedback").get(getFeedbackByOrderID).post(postFeedback);

export default ordersRouter;
