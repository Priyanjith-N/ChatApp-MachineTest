// interfaces
import { IUserProfile } from "../../entity/IUser.entity";

export default interface IUserUseCase {
    getUserProfile(id: string | undefined): Promise<IUserProfile | never>;
    handelLogout(id: string | undefined): Promise<void>;
    getAllUser(id: string | undefined): Promise<IUserProfile[]>;
}