import express, { Router } from "express";

const router: Router = express.Router();

// interfaces
import IAuthMiddleware from "../../interface/middlewares/authMiddleware.middleware";
import IJWTService from "../../interface/utils/IJWTService";

// classes importing
import AuthMiddleware from "../middleware/auth.middleware";

// importing util services
import JWTService from "../utils/jwtService.utils";

// util service
const jwtService: IJWTService = new JWTService();

const authMiddleware: IAuthMiddleware = new AuthMiddleware(jwtService);

router.use(authMiddleware.isAuthenticate.bind(authMiddleware));

export default router;