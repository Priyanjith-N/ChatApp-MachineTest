import { createServer } from "http";
import express, { Express } from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from 'cookie-parser';

import authRouter from "../router/auth.router";

import userRouter from "../router/user.router";

// error handling middleware
import errorHandler from "../middleware/error.middleware";
import connectSocket from "../utils/socket.utils";

const app: Express = express();

const httpServer = createServer(app);

const CORS_ORIGIN: string = process.env.CORS_ORIGIN ?? "";

app.use(cors({
    origin: [CORS_ORIGIN],
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

export default httpServer;