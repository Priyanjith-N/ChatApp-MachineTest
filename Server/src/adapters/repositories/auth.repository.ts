// importing collections
import Users from "../../framework/models/user.models";

// interfaces
import IAuthRepository from "../../interface/repositories/IAuth.repository";
import IUser, { IUserRegisterationCredentials } from "../../entity/IUser.entity";

export default class AuthRepository implements IAuthRepository {
    async getUserByIdentifier(identifier: string): Promise<IUser | null | never> {
        try {
            return await Users.findOne({ $or: [{ phoneNumber: identifier }, { userName: { $regex: new RegExp(`^${identifier}$`, 'i') } }, { email: { $regex: new RegExp(`^${identifier}$`, 'i') } }] });
        } catch (err: any) {
            throw err;
        }
    }

    async getUserByUserName(userName: string): Promise<IUser | null | never> {
        try {
            return await Users.findOne({ userName: { $regex: new RegExp(`^${userName}$`, 'i') } });
        } catch (err: any) {
            throw err;
        }
    }

    async getUserByEmail(email: string): Promise<IUser | null | never> {
        try {
            return await Users.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
        } catch (err: any) {
            throw err;
        }
    }

    async getUserByPhoneNumber(phoneNumber: string): Promise<IUser | null | never> {
        try {
            return await Users.findOne({ phoneNumber: { $regex: new RegExp(`^${phoneNumber}$`, 'i') } });
        } catch (err: any) {
            throw err;
        }
    }

    async saveNewUser(userRegisterationCredentials: IUserRegisterationCredentials): Promise<IUser | never> {
        try {
            const newUserData = new Users({
                userName: userRegisterationCredentials.userName,
                displayName: userRegisterationCredentials.displayName,
                email: userRegisterationCredentials.email,
                phoneNumber: userRegisterationCredentials.phoneNumber,
                password: userRegisterationCredentials.password
            });

            newUserData.save();

            return newUserData;
        } catch (err: any) {
            throw err;
        }
    }
}