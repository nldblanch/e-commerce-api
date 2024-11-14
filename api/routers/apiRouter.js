import express from "express";
import getEndpoints from "../controllers/api.controller";
import usersRouter from "./usersRouter";
import itemsRouter from "./itemsRouter";
const apiRouter = express.Router();

apiRouter.get("/", getEndpoints);

apiRouter.use("/users", usersRouter);
apiRouter.use("/items", itemsRouter)

export default apiRouter;
