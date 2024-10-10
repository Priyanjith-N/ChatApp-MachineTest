import { NextFunction, Request, Response } from "express";

export default interface IAuthController {
    handelLogin(req: Request, res: Response, next: NextFunction): Promise<void>;
}