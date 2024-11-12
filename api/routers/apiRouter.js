import express from "express";
import getEndpoints from "../controllers/api.controller";
import usersRouter from "./usersRouter";
const apiRouter = express.Router();

apiRouter.get("/", getEndpoints);

apiRouter.use("/users", usersRouter);

export default apiRouter;
