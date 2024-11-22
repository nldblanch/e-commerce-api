import express from "express";
import apiRouter from "./routers/apiRouter.js";
import { invalidEndpoint, customError, missingKey, invalidColumn } from "./error-handling/index.js";
const app = express();
app.use(express.json());

app.use("/api", apiRouter);

app.all("*", invalidEndpoint);

app.use(invalidColumn);
app.use(missingKey);
app.use(customError);

export default app;
