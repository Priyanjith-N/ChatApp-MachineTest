// interfaces
import IUser from "../../entity/IUser.entity";

export default interface IAuthRepository {
    getUserByIdentifier(identifier: string): Promise<IUser | null | never>;
}