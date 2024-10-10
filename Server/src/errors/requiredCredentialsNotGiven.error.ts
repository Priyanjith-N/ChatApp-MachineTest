export default class RequiredCredentialsNotGiven extends Error {
    errMessage: string;
    
    constructor(errMessage: string) {
        super(errMessage);
        this.errMessage = errMessage;
    }
}