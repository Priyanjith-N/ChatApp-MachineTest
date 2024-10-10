// importing collections
import Users from "../../framework/models/user.models";

// interfaces
import IAuthRepository from "../../interface/repositories/IAuth.repository";
import IUser from "../../entity/IUser.entity";

export default class AuthRepository implements IAuthRepository {
    async getUserByIdentifier(identifier: string): Promise<IUser | null | never> {
        try {
            return await Users.findOne({ $or: [{ phoneNumber: identifier }, { userName: identifier }, { email: identifier }] });
        } catch (err: any) {
            throw err;
        }
    }
}