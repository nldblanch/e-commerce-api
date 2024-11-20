import express from "express";
import { getAllCategories, getSubcategories } from "../controllers/categories.controller";
const categoriesRouter = express.Router();

categoriesRouter.route("/").get(getAllCategories);
categoriesRouter.route("/:category_id").get(getSubcategories);

export default categoriesRouter;