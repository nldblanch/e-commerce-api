import { getAllItems, getItemByID } from "../controllers/items.controller.js";
import express from "express";
const itemsRouter = express.Router();

itemsRouter.route("/").get(getAllItems);
itemsRouter.route("/:item_id").get(getItemByID);

export default itemsRouter;
