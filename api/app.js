import express from "express";
import apiRouter from "./routers/apiRouter.js";
import { invalidEndpoint, customError, psqlErrors } from "./error-handling/index.js";
const app = express();
app.use(express.json());

app.use("/api", apiRouter);

app.all("*", invalidEndpoint);

app.use(psqlErrors);
app.use(customError);

export default app;
