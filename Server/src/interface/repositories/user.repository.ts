// interfaces
import { IChat, IChatWithParticipantDetails } from "../../entity/IChat.entity";
import { IUserProfile } from "../../entity/IUser.entity";

export default interface IUserRepositroy {
    getUserProfile(id: string): Promise<IUserProfile | null | never>;
    changeUserStatus(_id: string, status: "online" | "offline"): Promise<void>;
    getAllUsers(_id: string): Promise<IUserProfile[]>;
    isChatExisit(senderId: string, reciverId: string): Promise<IChatWithParticipantDetails | undefined | never>;
    createNewChat(senderId: string, reciverId: string): Promise<IChat| never>;
    getChatByIdWithParticipantDetails(id: string, senderId: string): Promise<IChatWithParticipantDetails | never>;
}