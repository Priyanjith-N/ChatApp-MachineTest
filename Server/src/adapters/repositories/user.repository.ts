// importing collections
import Users from "../../framework/models/user.models";

// interfaces
import IUserRepositroy from "../../interface/repositories/user.repository";
import { IUserProfile } from "../../entity/IUser.entity";

export default class UserRepository implements IUserRepositroy {
    async getUserProfile(id: string): Promise<IUserProfile | null | never> {
        try {
            return await Users.findOne({ _id: id }, { password: 0 });
        } catch (err: any) {
            throw err;
        }
    }

    async changeUserStatus(_id: string, status: "online" | "offline"): Promise<void> {
        try {
            await Users.updateOne({ _id }, { $set: { status } });
        } catch (err: any) {
            throw err;
        }
    }
}