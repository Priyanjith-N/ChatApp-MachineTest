// interfaces
import { NextFunction, Response } from "express";
import IUserController from "../../interface/controllers/user.controllers";
import { AuthRequest } from "../../interface/middlewares/authMiddleware.middleware";
import IUserUseCase from "../../interface/usecase/IUser.usecase";
import { IUserProfile } from "../../entity/IUser.entity";

// enums
import { StatusCodes } from "../../enums/statusCode.enum";
import { ResponseMessage } from "../../enums/responseMessage.enum";
import { IChat, IChatWithParticipantDetails } from "../../entity/IChat.entity";

export default class UserController implements IUserController {
    private userUseCase: IUserUseCase;

    constructor(userUseCase: IUserUseCase) {
        this.userUseCase = userUseCase;
    }

    async getUserProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userProfile: IUserProfile = await this.userUseCase.getUserProfile(req.id);

            res.status(StatusCodes.Success).json({
                message: ResponseMessage.SUCESSFULL,
                data: userProfile
            });
        } catch (err: any) {
            next(err);
        }
    }

    async handelLogout(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            await this.userUseCase.handelLogout(req.id);

            res.clearCookie("token", {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production'
            });

            res.status(StatusCodes.Success).json({
                message: ResponseMessage.LOGOUT_SUCCESS
            });
        } catch (err: any) {
            next(err);
        }
    }

    async getAllUsers(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const allUsers: IUserProfile[] = await this.userUseCase.getAllUser(req.id);

            res.status(StatusCodes.Success).json({
                message: ResponseMessage.SUCESSFULL,
                data: allUsers
            });
        } catch (err: any) {
            next(err);
        }
    }

    async createNewChat(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const senderId: string | undefined = req.id;
            const reciverId: string | undefined = req.body.reciverId;
            
            const chat: IChatWithParticipantDetails = await this.userUseCase.createNewChat(senderId, reciverId);

            res.status(StatusCodes.Success).json({
                message: ResponseMessage.SUCESSFULL,
                data: chat
            });
        } catch (err: any) {
            next(err);
        }
    }

    async getAllChatsOfCurrentUser(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const data: IChatWithParticipantDetails[] = await this.userUseCase.getAllChatsOfCurrentUser(req.id);

            res.status(StatusCodes.Success).json({
                message: ResponseMessage.SUCESSFULL,
                data
            });
        } catch (err: any) {
            next(err);
        }
    }
}