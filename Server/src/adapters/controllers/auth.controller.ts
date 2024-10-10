import { NextFunction, Request, Response } from "express";

// interfaces
import IAuthController from "../../interface/controllers/IAuth.controllers";
import { IUserLoginCredentials } from "../../entity/IUser.entity";
import IAuthUseCase from "../../interface/usecase/IAuth.usecase";

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
        } catch (err: any) {
            next(err);
        }
    }
}