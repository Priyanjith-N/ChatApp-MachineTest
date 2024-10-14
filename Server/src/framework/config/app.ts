import express, { Express } from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from 'cookie-parser';

import authRouter from "../router/auth.router";

import userRouter from "../router/user.router";

// error handling middleware
import errorHandler from "../middleware/error.middleware";

const app: Express = express();

const allowedDomainFrontEndDomain: string = process.env.FRONTEND_DOMAIN ?? "";

app.use(cors({
    origin: [allowedDomainFrontEndDomain],
    credentials: true
}));

//for parseing cookie data
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev")); // Loging all http requests in detail

app.use("/auth", authRouter);

app.use("/api", userRouter);

app.use(errorHandler) // using error handling middleware

export default app;