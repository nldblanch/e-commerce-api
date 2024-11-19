import express from "express";
import getEndpoints from "../controllers/api.controller.js";
import usersRouter from "./usersRouter.js";
import itemsRouter from "./itemsRouter.js";
import categoriesRouter from "./categoriesRouter.js";

const apiRouter = express.Router();

apiRouter.get("/", getEndpoints);

apiRouter.use("/users", usersRouter);
apiRouter.use("/items", itemsRouter)
apiRouter.use("/categories", categoriesRouter)
export default apiRouter;
