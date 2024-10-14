import { NextFunction, Request, Response } from "express";

// interfaces
import IAuthController from "../../interface/controllers/IAuth.controllers";
import { IUserLoginCredentials, IUserRegisterationCredentials } from "../../entity/IUser.entity";
import IAuthUseCase from "../../interface/usecase/IAuth.usecase";

// enums
import { StatusCodes } from "../../enums/statusCode.enum";
import { ResponseMessage } from "../../enums/responseMessage.enum";

export default class AuthController implements IAuthController {
    private authUseCase: IAuthUseCase;

    constructor(authUseCase: IAuthUseCase) {
        this.authUseCase = authUseCase;
    }

    async handelLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userLoginCredential: IUserLoginCredentials = {
                identifier: req.body.identifier,
                password: req.body.password
            }

            const token: string = await this.authUseCase.userLogin(userLoginCredential);

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 1 * 24 * 60 * 60
            });

            res.status(StatusCodes.Success).json({
                message: ResponseMessage.LOGIN_SUCCESS
            });
        } catch (err: any) {
            next(err);
        }
    }

    async handelRegister(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userRegisterationCredentials: IUserRegisterationCredentials = {
                userName: req.body.userName,
                displayName: req.body.displayName,
                email: req.body.email,
                phoneNumber: req.body.phoneNumber,
                password: req.body.password,
                confirmPassword: req.body.confirmPassword
            }

            const token: string = await this.authUseCase.userRegister(userRegisterationCredentials);

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 1 * 24 * 60 * 60
            });

            res.status(StatusCodes.Success).json({
                message: ResponseMessage.REGISTERTATION_SUCCESS
            });
        } catch (err: any) {
            next(err);
        }
    }

    async isUserAuthenticated(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { token } = req.cookies;

            await this.authUseCase.isUserAuthenticated(token);

            res.status(StatusCodes.Success).json({
                message: ResponseMessage.USER_AUTHENTICATED
            });
        } catch (err: any) {
            throw err;
        }
    }
}