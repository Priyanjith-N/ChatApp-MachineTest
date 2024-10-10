import express, { Express } from "express";
import morgan from "morgan";

import authRouter from "../router/auth.router";

// error handling middleware
import errorHandler from "../middleware/error.middleware";

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev")); // Loging all http requests in detail

app.use("/auth", authRouter);

app.use(errorHandler) // using error handling middleware

export default app;