import { Response, NextFunction } from "express";

// interfaces
import IAuthMiddleware, { AuthRequest } from "../../interface/middlewares/authMiddleware.middleware";
import IJWTService, { IPayload } from "../../interface/utils/IJWTService";

// errors
import JWTTokenError from "../../errors/jwtTokenError.error";
import { StatusCodes } from "../../enums/statusCode.enum";
import { ErrorMessage } from "../../enums/errorMesaage.enum";

import { isObjectIdOrHexString } from "mongoose";

export default class AuthMiddleware implements IAuthMiddleware {
    private jwtService: IJWTService;

    constructor(jwtService: IJWTService) {
        this.jwtService = jwtService;
    }

    async isAuthenticate(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { token } = req.cookies;

            if(!token) throw new JWTTokenError({ statusCode: StatusCodes.Unauthorized, message: ErrorMessage.NOT_AUTHENTICATED });

            try {
                const decoded: IPayload = this.jwtService.verifyToken(token);

                if(!isObjectIdOrHexString(decoded.id)) throw new JWTTokenError({ statusCode: StatusCodes.Unauthorized, message: ErrorMessage.NOT_AUTHENTICATED });

                req.id = decoded.id;
            } catch (err: any) {
                throw new JWTTokenError({ statusCode: StatusCodes.BadRequest, message: ErrorMessage.TOKEN_EXPIRED });
            }

            next(); // user is authenticated procced with the actual request
        } catch (err: any) {
            next(err);
        }
    }
}