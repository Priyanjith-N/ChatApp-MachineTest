import express, { Router } from "express";

const router: Router = express.Router();

// interfaces
import IAuthMiddleware from "../../interface/middlewares/authMiddleware.middleware";
import IJWTService from "../../interface/utils/IJWTService";
import IUserRepositroy from "../../interface/repositories/user.repository";
import IUserUseCase from "../../interface/usecase/IUser.usecase";

// classes importing
import AuthMiddleware from "../middleware/auth.middleware";
import UserRepository from "../../adapters/repositories/user.repository";
import UserUseCase from "../../usecase/user.usecase";

// importing util services
import JWTService from "../utils/jwtService.utils";
import IUserController from "../../interface/controllers/user.controllers";
import UserController from "../../adapters/controllers/user.controller";

// util service
const jwtService: IJWTService = new JWTService();

// auth middleware
const authMiddleware: IAuthMiddleware = new AuthMiddleware(jwtService);

const userRepository: IUserRepositroy = new UserRepository();
const userUseCase: IUserUseCase = new UserUseCase(userRepository);
const userController: IUserController = new UserController(userUseCase);

router.use(authMiddleware.isAuthenticate.bind(authMiddleware));

router.get("/user", userController.getUserProfile.bind(userController));

router.post("/logout", userController.handelLogout.bind(userController));

export default router;