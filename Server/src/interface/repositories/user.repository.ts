// interfaces
import { IUserProfile } from "../../entity/IUser.entity";

export default interface IUserRepositroy {
    getUserProfile(id: string): Promise<IUserProfile | null | never>;
    changeUserStatus(_id: string, status: "online" | "offline"): Promise<void>;
    getAllUsers(_id: string): Promise<IUserProfile[]>;
}