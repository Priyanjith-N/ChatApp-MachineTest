// interfaces
import { IChat, IChatWithParticipantDetails } from "../../entity/IChat.entity";
import { IMessagesAndChatData, IMessageWithSenderDetails } from "../../entity/IMessage.entity";
import { IUserProfile } from "../../entity/IUser.entity";

export default interface IUserUseCase {
    getUserProfile(id: string | undefined): Promise<IUserProfile | never>;
    handelLogout(id: string | undefined): Promise<void>;
    getAllUser(id: string | undefined): Promise<IUserProfile[]>;
    createNewChat(senderId: string | undefined, reciverId: string | undefined): Promise<IChatWithParticipantDetails | never>;
    getAllChatsOfCurrentUser(_id: string | undefined): Promise<IChatWithParticipantDetails[] | never>;
    getAllMessageOfChat(chatId: string | undefined, _id: string | undefined): Promise<IMessagesAndChatData | never>;
    sendMessage(chatId: string | undefined, senderId: string | undefined, content: string | undefined, type: string | undefined, file: Express.MulterS3.File | undefined): Promise<IMessageWithSenderDetails | never>;
    createNewGroupChat(groupName: string | undefined, participants: string[] | undefined, groupAdmin: string | undefined): Promise<IChatWithParticipantDetails | never>;
    leaveGroupChat(userId: string | undefined, chatId: string | undefined): Promise<void | never>;
    getAllUsersNotPresentInCurrentGroupChat(chatId: string | undefined, userId: string | undefined): Promise<IUserProfile[] | never>;
}