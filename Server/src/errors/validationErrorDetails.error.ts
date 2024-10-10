// interface
import { IValidationErrorDetails } from "../interface/errors/IValidationError.error";

export default class ValidationError extends Error {
    public details: IValidationErrorDetails;
    constructor(details: IValidationErrorDetails) {
        super(details.message);
        this.details = details;
    }
}