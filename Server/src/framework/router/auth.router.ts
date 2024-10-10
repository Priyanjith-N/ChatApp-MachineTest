import express, { Router } from "express";

const router: Router = express.Router();

//interfaces
import IAuthRepository from "../../interface/repositories/IAuth.repository";
import IAuthUseCase from "../../interface/usecase/IAuth.usecase";
import IAuthController from "../../interface/controllers/IAuth.controllers";
import IHashingService from "../../interface/utils/IHashingService";
import IJWTService from "../../interface/utils/IJWTService";

// classes importing
import AuthRepository from "../../adapters/repositories/auth.repository";
import AuthUseCase from "../../usecase/auth.usecase";
import AuthController from "../../adapters/controllers/auth.controller";

// importing util services
import HashingService from "../utils/hashingService.utils";
import JWTService from "../utils/jwtService.utils";

// util services
const hashingService: IHashingService = new HashingService();
const jwtService: IJWTService = new JWTService();

const authRepository: IAuthRepository = new AuthRepository();
const authUseCase: IAuthUseCase = new AuthUseCase(authRepository, hashingService, jwtService);
const authController: IAuthController = new AuthController(authUseCase);

router.post("/login", authController.handelLogin.bind(authController));

router.post("/register", authController.handelRegister.bind(authController));

export default router;