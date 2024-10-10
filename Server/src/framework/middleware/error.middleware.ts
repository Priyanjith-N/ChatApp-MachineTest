import { NextFunction, Request, Response } from "express";

// enums
import { StatusCodes } from "../../enums/statusCode.enum";
import { ErrorMessage } from "../../enums/errorMesaage.enum";

// error
import ValidationError from "../../errors/validationErrorDetails.error";
import RequiredCredentialsNotGiven from "../../errors/requiredCredentialsNotGiven.error";


export default function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    if(err instanceof ValidationError) {
        res.status(err.details.statusCode).json({message: err.message, errorField: err.details.errorField});
    }else if(err instanceof RequiredCredentialsNotGiven) {
        res.status(StatusCodes.BadRequest).json({ requiredCredentialsError: true, message: err.message })
    }else{
        // Log entire error object
        console.error(err);
        res.status(StatusCodes.InternalServer).json({ internalServerError: true, message: ErrorMessage.INTERNAL_SERVER_ERROR });
    }
}