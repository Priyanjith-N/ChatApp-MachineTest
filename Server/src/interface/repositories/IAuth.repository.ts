// interfaces
import IUser, { IUserRegisterationCredentials } from "../../entity/IUser.entity";

export default interface IAuthRepository {
    getUserByIdentifier(identifier: string): Promise<IUser | null | never>;
    getUserByUserName(userName: string): Promise<IUser | null | never>;
    getUserByEmail(email: string): Promise<IUser | null | never>;
    getUserByPhoneNumber(phoneNumber: string): Promise<IUser | null | never>;
    saveNewUser(userRegisterationCredentials: IUserRegisterationCredentials): Promise<IUser | never>;
}