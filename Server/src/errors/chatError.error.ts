// interface
import { IChatErrorDetails } from "../interface/errors/IChatError.error";

export default class ChatError extends Error {
    public details: IChatErrorDetails;
    constructor(details: IChatErrorDetails) {
        super(details.message);
        this.details = details;
    }
}