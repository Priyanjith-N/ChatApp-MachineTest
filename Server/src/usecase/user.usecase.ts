import { isObjectIdOrHexString } from "mongoose";

// interfaces
import { IUserProfile } from "../entity/IUser.entity";
import IUserRepositroy from "../interface/repositories/user.repository";
import IUserUseCase from "../interface/usecase/IUser.usecase";

// errrors
import RequiredCredentialsNotGiven from "../errors/requiredCredentialsNotGiven.error";

export default class UserUseCase implements IUserUseCase {
    private userRepository: IUserRepositroy;

    constructor(userRepository: IUserRepositroy) {
        this.userRepository = userRepository;
    }

    async getUserProfile(id: string | undefined): Promise<IUserProfile | never> {
        try {
            if(!id || !isObjectIdOrHexString(id)) throw new RequiredCredentialsNotGiven('Provide all required details.');

            const userProfile: IUserProfile | null = await this.userRepository.getUserProfile(id);

            if(!userProfile) throw new RequiredCredentialsNotGiven('Invaild user.');

            return userProfile;
        } catch (err: any) {
            throw err;
        }
    }

    async handelLogout(id: string | undefined): Promise<void> {
        try {
            if(!id || !isObjectIdOrHexString(id)) throw new RequiredCredentialsNotGiven('Provide all required details.');

            await this.userRepository.changeUserStatus(id, "offline");
        } catch (err: any) {
            throw err;
        }
    }
}