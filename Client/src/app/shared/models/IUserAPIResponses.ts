// interfaces
import { IUserProfile } from "./user.entity";

export interface IGetUserProfileSuccessfullAPIResponse {
    message: string;
    data: IUserProfile;
}

export interface ILogoutSuccessfullAPIResponse {
    message: string;
}