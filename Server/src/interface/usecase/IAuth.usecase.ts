// interfaces
import { IUserLoginCredentials, IUserRegisterationCredentials } from "../../entity/IUser.entity";

export default interface IAuthUseCase {
    userLogin(userLoginCredential: IUserLoginCredentials): Promise<string | never>;
    userRegister(userRegisterationCredentials: IUserRegisterationCredentials): Promise<string | never>;
}