// interfaces
import { IChat, IChatWithParticipantDetails } from "../../entity/IChat.entity";
import { IUserProfile } from "../../entity/IUser.entity";

export default interface IUserUseCase {
    getUserProfile(id: string | undefined): Promise<IUserProfile | never>;
    handelLogout(id: string | undefined): Promise<void>;
    getAllUser(id: string | undefined): Promise<IUserProfile[]>;
    createNewChat(senderId: string | undefined, reciverId: string | undefined): Promise<IChatWithParticipantDetails | never>;
    getAllChatsOfCurrentUser(_id: string | undefined): Promise<IChatWithParticipantDetails[] | never>;
}