// interfaces

import { IJWTTokenErrorDetails } from "../interface/errors/jwtTokenError.error";

export default class JWTTokenError extends Error {
    public details: IJWTTokenErrorDetails;
    constructor(details: IJWTTokenErrorDetails) {
        super(details.message);
        this.details = details;
    }
}