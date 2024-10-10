// interfaces
import { IUserLoginCredentials } from "../../entity/IUser.entity";

export default interface IAuthUseCase {
    userLogin(userLoginCredential: IUserLoginCredentials): Promise<string | never>;
}