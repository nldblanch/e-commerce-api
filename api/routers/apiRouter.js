import express from "express";
import getEndpoints from "../controllers/api.controller.js";
import usersRouter from "./usersRouter.js";
import itemsRouter from "./itemsRouter.js";
const apiRouter = express.Router();

apiRouter.get("/", getEndpoints);

apiRouter.use("/users", usersRouter);
apiRouter.use("/items", itemsRouter)

export default apiRouter;
