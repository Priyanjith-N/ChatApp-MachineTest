// interfaces
import { NextFunction, Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware.middleware";

export default interface IUserController {
    getUserProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    handelLogout(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getAllUsers(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    createNewChat(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}